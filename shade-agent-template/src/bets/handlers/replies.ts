import { evm } from "../../utils/evm";
import { sleep } from "../../utils/utils";
import {
  REPLY_PROCESSING_DELAY,
} from "../config";
import {
  pendingReply,
  pendingDeposits,
} from "../state";
import { xPost } from "../../lib/X/endpoints/xPost";
import { parsePostToBet } from "../lib/nearai";
import { generateAddress, networkId } from "../../lib/chain-signatures";
import { log } from "../lib/log";

export async function processReplies(): Promise<void> {
  const post = pendingReply.shift() as
    | ({
      id: string;
      text: string;
      author_username?: string;
      conversation_id?: string;
      created_at?: string;
      replyAttempt: number;
    } | undefined);

  if (!post || post.replyAttempt >= 3) {
    await sleep(REPLY_PROCESSING_DELAY);
    return void processReplies();
  }

  try {
    const betInfo = await parsePostToBet(post.text);

    if (!betInfo || betInfo.includes("INVALID")) {
      await xPost(
        `Sorry, I couldn't understand the bet format. Please use: "@username I bet you X ETH that [condition]"`,
        post.id,
      );
      await sleep(REPLY_PROCESSING_DELAY);
      return void processReplies();
    }

    const parsed = JSON.parse(betInfo);
    const opponentUsername: string = parsed.opponent.substring(1);
    const stakeAmountStr: string = parsed.amount.split(" ")[0];
    const description: string = parsed.bet_terms;

    const stake = BigInt(Math.floor(parseFloat(stakeAmountStr) * 1e18));
    if (stake <= 0n) {
      await xPost(
        `Sorry, the bet amount must be greater than 0 ETH.`,
        post.id,
      );
      await sleep(REPLY_PROCESSING_DELAY);
      return void processReplies();
    }

    const formattedStake = evm.formatBalance(stake);

    const authorBetPath = `${post.author_username}-${post.id}`;
    const { address: authorDepositAddress } = await generateAddress({
      accountId: process.env.NEXT_PUBLIC_contractId!,
      path: authorBetPath,
      chain: "evm",
    });

    log.info(`Derived AuthDepositAddress: ${authorDepositAddress}`)

    const opponentBetPath = `${opponentUsername}-${post.id}`;
    const { address: opponentDepositAddress } = await generateAddress({
      accountId: process.env.NEXT_PUBLIC_contractId!,
      path: opponentBetPath,
      chain: "evm",
    });

    log.info(`Derived OpponentDepositAddress: ${opponentDepositAddress}`)

    const response = await xPost(
      `I got you! \n @${post.author_username} deposit ${formattedStake} ETH to ${authorDepositAddress} \n and @${opponentUsername} deposit ${formattedStake} ETH to ${opponentDepositAddress}`,
      post.id,
    );

    if (response) {
      const conversationId = post.conversation_id || post.id;

      const bet = {
        id: post.id,
        conversationId,
        creatorUsername: post.author_username ? post.author_username : "Unknown authorname",
        opponentUsername,
        stake,
        description,
        mostRecentTweetId: response.id,
        authorBetPath,
        authorDepositAddress,
        opponentBetPath,
        opponentDepositAddress,
        addressRequestAttempt: 0,
        depositAttempt: 0,
        timestamp: post.created_at
          ? new Date(post.created_at).getTime() / 1000
          : Math.floor(Date.now() / 1000),
      };

      pendingDeposits.push(bet);
    } else {
      post.replyAttempt++;
      pendingReply.push(post);
    }
  } catch (e) {
    console.log("Error processing reply:", e);
    post.replyAttempt++;
    pendingReply.push(post);
  }

  await sleep(REPLY_PROCESSING_DELAY);
  return void processReplies();
}

export function startRepliesLoop() {
  processReplies();
}
