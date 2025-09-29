import { sleep } from "../../utils/utils";
import { evm } from "../../utils/evm";
import {
  SETTLEMENT_PROCESSING_DELAY,
} from "../config";
import {
  pendingSettlement,
  pendingRefund,
  completedBets,
} from "../state";
import { resolveBetInContract } from "../services/contract";
import { xPost } from "../../lib/X/endpoints/xPost";
import { resolveBetWithAI } from "../lib/nearai";

export async function processSettlements(): Promise<void> {
  const bet = pendingSettlement.shift();

  if (!bet) {
    await sleep(SETTLEMENT_PROCESSING_DELAY);
    return void processSettlements();
  }

  if (!bet.settlementTweet) {
    pendingSettlement.push(bet);
    await sleep(SETTLEMENT_PROCESSING_DELAY);
    return void processSettlements();
  }

  const resolution = await resolveBetWithAI(bet.description);

  let winnerAddress = "";
  let winnerUsername = "";

  if (resolution.toLowerCase().includes("true")) {
    winnerAddress = bet.creatorAddress!;
    winnerUsername = bet.creatorUsername;
  } else {
    winnerAddress = bet.opponentAddress!;
    winnerUsername = bet.opponentUsername;
  }

  const settlementReason = `The bet parser resolves to ${resolution}`;

  if (winnerAddress) {
    const result = await resolveBetInContract(
      bet.betId!,
      winnerAddress,
      bet.resolverAddress!,
      bet.betPath!,
      bet.chain
    );

    if (result.success) {
      await xPost(
        `Bet settled! 🎉\n\n@${winnerUsername} won ${evm.formatBalance(
          (bet.stake * 2n * 99n) / 100n
        )} ETH\n\nReason: ${settlementReason}\n\nTx: ${result.explorerLink}`,
        bet.settlementTweet.id,
      );

      completedBets.push({
        ...bet,
        winner: winnerUsername as any,
        settlementTx: result.explorerLink,
      });
    } else {
      console.log("Settlement failed, retrying later:", result.error);
      bet.settlementAttempt = (bet.settlementAttempt || 0) + 1;
      if (bet.settlementAttempt < 3) {
        pendingSettlement.push(bet);
      } else {
        console.log("Multiple settlement failures, needs manual review");
        pendingRefund.push(bet);
      }
    }
  } else {
    console.log("Could not determine winner, will retry");
    bet.settlementAttempt = (bet.settlementAttempt || 0) + 1;
    if (bet.settlementAttempt < 3) pendingSettlement.push(bet);
  }

  await sleep(SETTLEMENT_PROCESSING_DELAY);
  return void processSettlements();
}

export function startSettlementsLoop() {
  processSettlements();
}
