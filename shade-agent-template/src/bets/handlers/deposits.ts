import { evm } from "../../utils/evm";
import { sleep } from "../../utils/utils";
import {
  DEPOSIT_PROCESSING_DELAY,
  MAX_DEPOSIT_ATTEMPTS,
  BOT_NAME,
  CHAIN_ID,
  PUBLIC_CONTRACT_ID,
} from "../config";
import {
  pendingDeposits,
  pendingSettlement,
  pendingRefund,
} from "../state";
import { getTransactionsForAddress } from "../services/explorer";
import { createBetInContract } from "../services/contract";
import { xPost } from "../../lib/X/endpoints/xPost";
import { log } from "../lib/log";
import { generateAddress } from "../../lib/chain-signatures";

export async function processDeposits(): Promise<void> {
  const bet = pendingDeposits.shift(); 
  log.info("Trying to check for deposits");

  if (!bet) {
    await sleep(DEPOSIT_PROCESSING_DELAY);
    return void processDeposits();
  }

  log.info("Deposit attempt #" + bet.depositAttempt);

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
      log.info("Balance1 is ", balance1);
      log.info("Balance2 is ", balance2);

      if (balance1 >= bet.stake && balance2 >= bet.stake) {

        log.info(balance1 >= bet.stake);
        log.info(balance2 >= bet.stake);
        let tx = await getTransactionsForAddress(bet.authorDepositAddress, CHAIN_ID);
        
        const creatorAddress = tx?.from;

        tx = await getTransactionsForAddress(bet.opponentDepositAddress, CHAIN_ID);
        const opponentAddress = tx?.from;

        if (creatorAddress && opponentAddress) {
          log.success("Both parties have made the deposit!");

          totalDeposited = true;
          bet.totalDeposited = true;
          bet.creatorAddress = creatorAddress;
          bet.opponentAddress = opponentAddress;
        }
      }
    } catch (e) {
      log.error("Error checking balance:", e);
    }
  }

  if (totalDeposited) {
    log.success("Full amount deposited → create bet in contract");

    const betPath = `ethereum-2`;
    const { address: resolverAddress } = await generateAddress({
      accountId: PUBLIC_CONTRACT_ID,
      path: betPath,
      chain: "evm",
    });

    console.log("Resolver address", resolverAddress);
    

    bet.resolverAddress = resolverAddress;
    bet.betPath = betPath;

    const transferResult = await evm.transferDepositsToResolver({
      creatorDepositAddress: bet.authorDepositAddress,
      opponentDepositAddress: bet.opponentDepositAddress,
      resolverAddress: bet.resolverAddress || "0x0",
      creatorBetPath: bet.authorBetPath,
      opponentBetPath: bet.opponentBetPath,
      individualStake: bet.stake
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

      console.log("Bet created");
      
      await xPost(
        `Bet created!
        \n\nBet between @${bet.creatorUsername} and @${bet.opponentUsername} is now active!
        \n\nTotal stake: ${evm.formatBalance(bet.stake * 2n)} ETH\n\nDescription: "${bet.description}"
        \n\nEither party can trigger settlement by tagging @${BOT_NAME} with "settle bet"`,
        bet.mostRecentTweetId,
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
