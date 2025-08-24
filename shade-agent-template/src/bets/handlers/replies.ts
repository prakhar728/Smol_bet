import { parsePostToBet } from "../../lib/intent-parser";
import { crosspostReply } from "../../utils/social/crosspost";
import { generateAddress, networkId } from "@neardefi/shade-agent-js";
import { evm } from "../../utils/evm";
import { sleep } from "../../utils/utils";
import {
  REPLY_PROCESSING_DELAY,
  FAKE_REPLY,
} from "../config";
import {
  pendingReply,
  pendingDeposits,
} from "../state";

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
      await crosspostReply(
        `Sorry, I couldn't understand the bet format. Please use: "@username I bet you X ETH that [condition]"`,
        post,
        FAKE_REPLY
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
      await crosspostReply(
        `Sorry, the bet amount must be greater than 0 ETH.`,
        post,
        FAKE_REPLY
      );
      await sleep(REPLY_PROCESSING_DELAY);
      return void processReplies();
    }

    const formattedStake = evm.formatBalance(stake);

    const authorBetPath = `${post.author_username}-${post.id}`;
    const { address: authorDepositAddress } = await generateAddress({
      publicKey:
        networkId === "testnet"
          ? process.env.MPC_PUBLIC_KEY_TESTNET
          : process.env.MPC_PUBLIC_KEY_MAINNET,
      accountId: process.env.NEXT_PUBLIC_contractId!,
      path: authorBetPath,
      chain: "evm",
    });

    const opponentBetPath = `${opponentUsername}-${post.id}`;
    const { address: opponentDepositAddress } = await generateAddress({
      publicKey:
        networkId === "testnet"
          ? process.env.MPC_PUBLIC_KEY_TESTNET
          : process.env.MPC_PUBLIC_KEY_MAINNET,
      accountId: process.env.NEXT_PUBLIC_contractId!,
      path: opponentBetPath,
      chain: "evm",
    });

    const response = await crosspostReply(
      `I got you! \n @${post.author_username} deposit ${formattedStake} ETH to ${authorDepositAddress} \n and @${opponentUsername} deposit ${formattedStake} ETH to ${opponentDepositAddress}`,
      post,
      FAKE_REPLY
    );

    if (response?.data) {
      const conversationId = post.conversation_id || post.id;

      const bet = {
        id: post.id,
        conversationId,
        creatorUsername: post.author_username,
        opponentUsername,
        stake,
        description,
        mostRecentTweetId: response.data.results[0]["details"]["id"],
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
