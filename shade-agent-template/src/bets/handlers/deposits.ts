import { generateAddress, networkId } from "@neardefi/shade-agent-js";
import { evm } from "../../utils/evm";
import { sleep } from "../../utils/utils";
import {
  DEPOSIT_PROCESSING_DELAY,
  MAX_DEPOSIT_ATTEMPTS,
  SMOL_BET_BOT,
  FAKE_REPLY,
} from "../config/constants";
import {
  pendingDeposits,
  pendingSettlement,
  pendingRefund,
} from "../queues/state";
import { getTransactionsForAddress } from "../services/explorer";
import { createBetInContract } from "../services/contracts";
import { crosspostReply } from "../../utils/social/crosspost";

export async function processDeposits(): Promise<void> {
  const bet = pendingDeposits.shift();

  if (!bet) {
    await sleep(DEPOSIT_PROCESSING_DELAY);
    return void processDeposits();
  }

  if (bet.depositAttempt >= MAX_DEPOSIT_ATTEMPTS) {
    console.log("Deposit timed out for bet:", bet.id);
    pendingRefund.push(bet);
    await sleep(DEPOSIT_PROCESSING_DELAY);
    return void processDeposits();
  }

  let totalDeposited = bet.totalDeposited || false;

  if (!totalDeposited) {
    try {
      const balance1 = await evm.getBalance({ address: bet.authorDepositAddress });
      const balance2 = await evm.getBalance({ address: bet.opponentDepositAddress });

      if (balance1 >= bet.stake && balance2 >= bet.stake) {
        let tx = await getTransactionsForAddress(bet.authorDepositAddress);
        const creatorAddress = tx?.from;

        tx = await getTransactionsForAddress(bet.opponentDepositAddress);
        const opponentAddress = tx?.from;

        if (creatorAddress && opponentAddress) {
          totalDeposited = true;
          bet.totalDeposited = true;
          bet.creatorAddress = creatorAddress;
          bet.opponentAddress = opponentAddress;
        }
      }
    } catch (e) {
      console.log("Error checking balance:", e);
    }
  }

  if (totalDeposited) {
    console.log("Full amount deposited → create bet in contract");

    const betPath = `${bet.creatorUsername}-${bet.opponentUsername}-${bet.id}`;
    const { address: resolverAddress } = await generateAddress({
      publicKey:
        networkId === "testnet"
          ? process.env.MPC_PUBLIC_KEY_TESTNET
          : process.env.MPC_PUBLIC_KEY_MAINNET,
      accountId: process.env.NEXT_PUBLIC_contractId!,
      path: betPath,
      chain: "evm",
    });

    bet.resolverAddress = resolverAddress;
    bet.betPath = betPath;

    const transferResult = await evm.transferDepositsToResolver({
      creatorDepositAddress: bet.authorDepositAddress,
      opponentDepositAddress: bet.opponentDepositAddress,
      resolverAddress: bet.resolverAddress,
      creatorBetPath: bet.authorBetPath,
      opponentBetPath: bet.opponentBetPath,
    });

    if (!transferResult.success) {
      console.error("Failed to transfer funds to resolver:", transferResult);
      bet.depositAttempt++;
      pendingDeposits.push(bet);
      await sleep(DEPOSIT_PROCESSING_DELAY);
      return void processDeposits();
    }

    const betResult = await createBetInContract({
      description: bet.description,
      creatorAddress: bet.creatorAddress!,
      opponentAddress: bet.opponentAddress!,
      resolverAddress: bet.resolverAddress!,
      stake: bet.stake,
      betPath: bet.betPath!,
    });

    if (betResult.success) {
      bet.betId = betResult.betId;

      await crosspostReply(
        `Bet created! 🎲\n\nBet between @${bet.creatorUsername} and @${
          bet.opponentUsername
        } is now active!\n\nTotal stake: ${evm.formatBalance(
          bet.stake * 2n
        )} ETH\n\nDescription: "${
          bet.description
        }"\n\nEither party can trigger settlement by tagging @${SMOL_BET_BOT} with "settle bet"`,
        { id: bet.mostRecentTweetId },
        FAKE_REPLY
      );

      pendingSettlement.push(bet);
    } else {
      console.log("Contract creation failed:", betResult.error);
      pendingRefund.push(bet);
    }
  } else {
    bet.depositAttempt++;
    pendingDeposits.push(bet);
  }

  await sleep(DEPOSIT_PROCESSING_DELAY);
  return void processDeposits();
}

export function startDepositsLoop() {
  processDeposits();
}
