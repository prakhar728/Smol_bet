import { generateAddress, networkId } from "@neardefi/shade-agent-js";
import { evm } from "../../utils/evm";
import { fetchJson, sleep } from "../../utils/utils";
import { TwitterApi } from "twitter-api-v2";
import {
  getConversationId,
  getLatestConversationTweet,
} from "../../utils/twitter-client";
import { parsePostToBet } from "./lib/intent-parser";

const SMOL_BET_BOT = "funnyorfud";
const BANKR_BOT = process.env.BANKRBOT_ID || "bankrbot";

// Configuration constants
const REPLY_PROCESSING_DELAY = 15000;
const DEPOSIT_PROCESSING_DELAY = 5000;
const SETTLEMENT_PROCESSING_DELAY = 30000;
const REFUND_PROCESSING_DELAY = 60000;
const MAX_DEPOSIT_ATTEMPTS = 12 * 60; // 12 per minute * 60 mins
const MAX_ADDRESS_REQUESTS = 3; // Maximum attempts to get addresses from bankrbot

// Processing queues
const pendingReply = []; // New bet requests awaiting initial reply
const pendingAddressRequest = []; // Waiting for @bankrbot to provide addresses
const pendingAddressConfirmation = []; // Awaiting creator & opponent confirmation
const pendingDeposits = []; // Waiting for both parties to deposit stakes
const pendingSettlement = []; // Active bets awaiting settlement
const pendingRefund = []; // Failed bets requiring refunds
const completedBets = []; // Successfully settled bets (for record-keeping)

// Keep track of the last processed tweet
let lastTweetTimestamp = parseInt(process.env.TWITTER_LAST_TIMESTAMP);
let waitingForReset = 0;

// Authentication
let accessToken = process.env.TWITTER_ACCESS_TOKEN;
let refreshToken = process.env.TWITTER_REFRESH_TOKEN;

// Toggle for testing mode
const FAKE_REPLY = true;
const SEARCH_ONLY = true;

// Twitter client (initialized on first search)
let client = null;

const createUserMap = (response) => {
  const users = response.includes?.users || [];
  return new Map(users.map((user) => [user.id, user.username]));
};

// Sleep helper function
const sleepThen = async (dur, fn) => {
  await sleep(dur);
  fn();
};

/**
 * Get transactions for an ETH address from blockchain explorer
 */
const getTransactionsForAddress = async (address, action = "txlist") => {
  let tx;
  try {
    const res = await fetchJson(
      `https://api${
        networkId === "testnet" ? "-sepolia" : ""
      }.basescan.org/api?module=account&action=${action}&address=${address}&startblock=0&endblock=latest&page=1&offset=10&sort=asc&apikey=${
        process.env.BASE_API_KEY
      }`
    );
    if (!res.result || !res.result.length > 0) {
      return;
    }
    tx = res.result[0];
    if (tx?.isError === "1" || !tx?.from) {
      return;
    }
  } catch (e) {
    console.log(e);
  }
  return tx;
};

/**
 * Refresh Twitter API access token
 */
const refreshAccessToken = async () => {
  console.log("refreshAccessToken");
  const client = new TwitterApi({
    clientId: process.env.TWITTER_CLIENT_KEY,
    clientSecret: process.env.TWITTER_CLIENT_SECRET,
  });
  try {
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      await client.refreshOAuth2Token(refreshToken);
    accessToken = newAccessToken;
    refreshToken = newRefreshToken;
    console.log("success refreshAccessToken", accessToken);
  } catch (e) {
    console.log("error refreshAccessToken");
    console.log(e);
  }
};

/**
 * Reply to a tweet
 */
const replyToTweet = async (text, id, secondAttempt = false) => {
  console.log("replyToTweet");
  const client = new TwitterApi(accessToken);
  let res;
  try {
    console.log("client.v2.reply", id);
    res = FAKE_REPLY ? { data: true } : await client.v2.reply(text, id);
  } catch (e) {
    console.log("error", e);
    if (!secondAttempt && /401/gi.test(JSON.stringify(e))) {
      await refreshAccessToken();
      res = await replyToTweet(text, id, true);
    }
  }
  console.log(res);
  return res;
};

/**
 * Create a bet in the smart contract
 */
const createBetInContract = async (bet) => {
  try {
    console.log("Creating bet...");
    const createResult = await evm.createBetTx(
      bet.description,
      bet.creatorAddress,
      bet.opponentAddress,
      bet.depositAddress,
      bet.stake * 2n,
      bet.betPath
    );

    if (!createResult.success) {
      return console.log({
        success: false,
        message: "Failed to create bet",
        error: createResult.error,
      });
    }

    console.log("Bet creation transaction sent, waiting for it to be mined...");
    console.log("Transaction hash:", createResult.hash);

    await sleep(5000);

    const betId = (await evm.getBetCount()) - 1;
    console.log("Bet created with ID:", betId);

    return {
      success: true,
      betId: betId,
      explorerLink: `${
        networkId === "testnet"
          ? "https://sepolia.basescan.org/tx/"
          : "https://basescan.org/tx/"
      }${createResult.hash}`,
    };
  } catch (e) {
    console.log("Error creating bet in contract:", e);
    return { success: false, error: e.message };
  }
};

/**
 * Resolve a bet in the smart contract
 */
const resolveBetInContract = async (bet, winner) => {
  try {
    const resolveResult = await evm.resolveBetTx(
      bet.betId,
      winner,
      bet.depositAddress,
      bet.betPath
    );

    if (!resolveResult.success) {
      return console.log({
        success: false,
        message: "Failed to resolve bet",
        error: resolveResult.error,
      });
    }

    // Wait for 3 seconds to allow resolution transaction to propagate
    await sleep(3000);

    return {
      success: true,
      explorerLink: `${
        networkId === "testnet"
          ? "https://sepolia.basescan.org/tx/"
          : "https://basescan.org/tx/"
      }${resolveResult.hash}`,
    };
  } catch (e) {
    console.log("Error resolving bet in contract:", e);
    return { success: false, error: e.message };
  }
};

/**
 * Process pending refunds
 */
const processRefunds = async () => {
  const bet = pendingRefund.shift();
  if (!bet) {
    await sleepThen(REFUND_PROCESSING_DELAY, processRefunds);
    return;
  }
  console.log("Processing refund for bet:", bet.id);

  // Handle refund if there's a deposit
  const address = bet.depositAddress;
  if (!address) {
    // No deposit address, nothing to refund
    await sleepThen(REFUND_PROCESSING_DELAY, processRefunds);
    return;
  }

  let tx = await getTransactionsForAddress(address);
  let internal = false;

  // Check internal transactions if no regular transactions found
  if (!tx) {
    tx = await getTransactionsForAddress(address, "txlistinternal");
    internal = true;
  }

  if (tx) {
    try {
      const balance = await evm.getBalance({
        address: address,
      });

      if (balance > 0n) {
        const feeData = await evm.getGasPrice();
        const gasPrice =
          BigInt(feeData.maxFeePerGas) + BigInt(feeData.maxPriorityFeePerGas);
        const gasLimit = internal ? 500000n : 21000n;
        const gasFee = gasPrice * gasLimit;

        // Ensure we don't overdraw
        const adjust = 5000000000000n;
        const amount = evm.formatBalance(balance - gasFee - adjust);

        // Send refund back to original sender
        await evm.send({
          path: bet.betPath,
          from: address,
          to: tx.from,
          amount,
          gasLimit,
        });

        console.log(`Refunded ${amount} to ${tx.from}`);

        // If there are multiple transactions, we might need a more sophisticated refund logic
        // This simple version assumes a single depositor or refunds everything to the first depositor
      }
    } catch (e) {
      console.log(`Error processing refund:`, e);
    }
  }

  // Move on to next refund
  await sleepThen(REFUND_PROCESSING_DELAY, processRefunds);
};

/**
 * Process bet settlements
 */
const processSettlements = async () => {
  const bet = pendingSettlement.shift();
  if (!bet) {
    await sleepThen(SETTLEMENT_PROCESSING_DELAY, processSettlements);
    return;
  }
  console.log("Processing settlement for bet:", bet.id);

  // Parse tweet text to determine winner
  // This would need more sophisticated logic to accurately determine outcome
  // For now, we'll look for specific settlement phrases

  // TEMPORARY IMPLEMENTATION: Always make the creator the winner
  // This will be replaced with proper settlement logic later
  let winnerAddress = bet.creatorAddress;
  let winnerUsername = bet.creatorUsername;

  const resolution = await resolveBetWithAI(description);

  let winner = "";
  if (resolution.toLowerCase().includes("true")) {
    winnerAddress = bet.creatorAddress;
    winnerUsername = bet.creatorUsername;
  } else {
    winnerAddress = bet.opponentAddress;
    winnerUsername = bet.opponentUsername;
  }

  const settlementReason = `The bet parser resolves to ${resolution}`;

  if (winnerAddress) {
    // Resolve bet in the contract
    const resolution = await resolveBetInContract(bet, winnerAddress);

    if (resolution.success) {
      // Get conversation ID and latest tweet to reply to
      const conversationId = await getConversationId(
        client,
        bet.settlementTweet.id
      );
      let replyId = bet.settlementTweet.id;

      if (conversationId) {
        const latestTweet = await getLatestConversationTweet(
          client,
          conversationId
        );
        if (latestTweet) {
          replyId = latestTweet.id;
        }
      }

      // Reply with settlement confirmation
      await replyToTweet(
        `Bet settled! 🎉\n\n@${winnerUsername} won ${evm.formatBalance(
          (bet.stake * 2n * 99n) / 100n
        )} ETH\n\nReason: ${settlementReason}\n\nTx: ${
          resolution.explorerLink
        }`,
        replyId
      );

      // Move bet to completed
      completedBets.push({
        ...bet,
        winner: winnerUsername,
        settlementTx: resolution.explorerLink,
      });
    } else {
      // If settlement failed, try again later
      console.log("Settlement failed, retrying later:", resolution.error);
      bet.settlementAttempt = (bet.settlementAttempt || 0) + 1;

      if (bet.settlementAttempt < 3) {
        pendingSettlement.push(bet);
      } else {
        // If multiple failures, may need manual intervention
        console.log("Multiple settlement failures, needs manual review");

        // Try to refund if settlement is impossible
        pendingRefund.push(bet);
      }
    }
  } else {
    // Couldn't determine winner, put back in queue or wait for clearer instruction
    console.log(
      "Could not determine winner, waiting for clearer settlement instruction"
    );
    bet.settlementAttempt = (bet.settlementAttempt || 0) + 1;

    if (bet.settlementAttempt < 3) {
      pendingSettlement.push(bet);
    }
  }

  await sleepThen(SETTLEMENT_PROCESSING_DELAY, processSettlements);
};

/**
 * Process deposit monitoring
 */
const processDeposits = async () => {
  const bet = pendingDeposits.shift();
  if (!bet) {
    await sleepThen(DEPOSIT_PROCESSING_DELAY, processDeposits);
    return;
  }

  console.log("Processing deposits for bet:", bet.id);
  console.log("Deposit attempts:", bet.depositAttempt);

  // Check if deposits are timed out
  const timedOut = bet.depositAttempt >= MAX_DEPOSIT_ATTEMPTS;

  if (timedOut) {
    console.log("Deposit timed out for bet:", bet.id);
    pendingRefund.push(bet);
    await sleepThen(DEPOSIT_PROCESSING_DELAY, processDeposits);
    return;
  }

  // Check for total deposit amount
  let totalDeposited = bet.totalDeposited || false;

  if (!totalDeposited) {
    try {
      const balance = await evm.getBalance({
        address: bet.depositAddress,
      });
      console.log("Deposit balance:", evm.formatBalance(balance));

      // Check if the full amount (both stakes) has been deposited
      if (balance >= bet.stake * 2n) {
        totalDeposited = true;
        bet.totalDeposited = true;
        console.log("Total deposit confirmed");
      }
    } catch (e) {
      console.log("Error checking balance:", e);
    }
  }

  // If the full amount has been deposited, create the bet in contract
  if (totalDeposited) {
    console.log("Full amount deposited, creating bet in contract");

    const betResult = await createBetInContract(bet); // take a look at this

    if (betResult.success) {
      bet.betId = betResult.betId;

      // Get conversation ID and latest tweet to reply to
      const conversationId = await getConversationId(client, bet.id);
      let replyId = bet.id;

      if (conversationId) {
        const latestTweet = await getLatestConversationTweet(
          client,
          conversationId
        );
        if (latestTweet) {
          replyId = latestTweet.id;
        }
      }

      // Reply with bet confirmation
      await replyToTweet(
        `Bet created! 🎲\n\nBet between @${bet.creatorUsername} and @${
          bet.opponentUsername
        } is now active!\n\nTotal stake: ${evm.formatBalance(
          bet.stake * 2n
        )} ETH\n\nDescription: "${
          bet.description
        }"\n\nEither party can trigger settlement by tagging @${SMOL_BET_BOT} with "settle bet"`,
        replyId
      );

      // Move to active bets (pending settlement)
      pendingSettlement.push(bet);
    } else {
      // If contract creation failed, try again or refund
      console.log("Contract creation failed:", betResult.error);
      pendingRefund.push(bet);
    }
  } else {
    // Increment attempt counter
    bet.depositAttempt++;

    // Put back in queue to check again
    pendingDeposits.push(bet);
  }

  await sleepThen(DEPOSIT_PROCESSING_DELAY, processDeposits);
};

/**
 * Process address confirmation for users
 */
const processAddressConfirmation = async () => {
  const bet = pendingAddressConfirmation.shift();
  if (!bet) {
    await sleepThen(REPLY_PROCESSING_DELAY, processAddressConfirmation);
    return;
  }

  console.log("Processing address confirmation for bet:", bet.id);

  // Generate a single unique deposit address for the bet
  try {
    // Generate address using combined path of both usernames
    const betPath = `${bet.creatorUsername}-${bet.opponentUsername}-${bet.id}`;
    const { address: depositAddress } = await generateAddress({
      publicKey:
        networkId === "testnet"
          ? process.env.MPC_PUBLIC_KEY_TESTNET
          : process.env.MPC_PUBLIC_KEY_MAINNET,
      accountId: process.env.NEXT_PUBLIC_contractId,
      path: betPath,
      chain: "evm",
    });

    // Store address and path
    bet.betPath = betPath;
    bet.depositAddress = depositAddress;

    // Format stake amount
    const formattedStake = evm.formatBalance(bet.stake);
    const totalStake = evm.formatBalance(bet.stake * 2n);

    // Get conversation ID and latest tweet to reply to
    const conversationId = await getConversationId(client, bet.id);
    let replyId = bet.id;

    if (conversationId) {
      const latestTweet = await getLatestConversationTweet(
        client,
        conversationId
      );
      if (latestTweet) {
        replyId = latestTweet.id;
      }
    }

    // Reply with deposit instructions
    const response = await replyToTweet(
      `Bet confirmed! 🎲\n\n@${bet.creatorUsername} and @${bet.opponentUsername}, please send a total of ${totalStake} ETH (${formattedStake} ETH each) to: ${depositAddress}\n\nDeposits must be completed within 10 minutes. The bet will be activated once the full amount is received!`,
      replyId
    );

    if (response?.data) {
      // Initialize deposit monitoring
      bet.depositAttempt = 0;
      bet.totalDeposited = false;

      // Move to deposit monitoring
      pendingDeposits.push(bet);
    } else {
      // Retry if reply failed
      console.log("Failed to send deposit instructions, retrying");
      bet.confirmationAttempt = (bet.confirmationAttempt || 0) + 1;

      if (bet.confirmationAttempt < 3) {
        pendingAddressConfirmation.push(bet);
      }
    }
  } catch (e) {
    console.log("Error generating address:", e);
    bet.confirmationAttempt = (bet.confirmationAttempt || 0) + 1;

    if (bet.confirmationAttempt < 3) {
      pendingAddressConfirmation.push(bet);
    }
  }

  await sleepThen(REPLY_PROCESSING_DELAY, processAddressConfirmation);
};

/**
 * Process address request from bankrbot
 */
const processAddressRequest = async () => {
  const bet = pendingAddressRequest.shift();
  if (!bet) {
    await sleepThen(REPLY_PROCESSING_DELAY, processAddressRequest);
    return;
  }

  console.log("Processing address request for bet:", bet.id);

  // Look for reply from @bankrbot with addresses
  try {
    const conversationId = await getConversationId(
      client,
      bet.addressRequestTweetId
    );

    if (conversationId) {
      // Get replies in conversation
      const replies = await client.v2.search(
        `conversation_id:${conversationId} from:${BANKR_BOT}`,
        {
          "tweet.fields": "author_id,created_at,referenced_tweets",
          expansions: "referenced_tweets.id,author_id",
          "user.fields": "username",
        }
      );

      const replyUserMap = createUserMap(replies);

      reply.author_username = replyUserMap.get(reply.author_id);

      // Look for bankrbot reply with addresses
      for await (const reply of replies) {
        if (reply.author_username.toLowerCase() === BANKR_BOT.toLowerCase()) {
          const tweetText = reply.text.toLowerCase();

          // Extract addresses from reply (this regex pattern is simplified)
          const addressPattern = /0x[a-fA-F0-9]{40}/g;
          const addresses = tweetText.match(addressPattern);

          // Check if we found two addresses (creator and opponent)
          if (addresses && addresses.length >= 2) {
            bet.creatorAddress = addresses[0];
            bet.opponentAddress = addresses[1];

            console.log(
              "Found addresses:",
              bet.creatorAddress,
              bet.opponentAddress
            );

            // Move to address confirmation
            pendingAddressConfirmation.push(bet);
            await sleepThen(REPLY_PROCESSING_DELAY, processAddressRequest);
            return;
          }
        }
      }
    }

    // If we reach here, we didn't find a reply with addresses
    bet.addressRequestAttempt = (bet.addressRequestAttempt || 0) + 1;

    if (bet.addressRequestAttempt < MAX_ADDRESS_REQUESTS) {
      console.log("No address reply found, trying again later");
      pendingAddressRequest.push(bet);
    } else {
      console.log("Max address request attempts reached, giving up");

      // Reply to user that we couldn't get addresses
      await replyToTweet(
        `Sorry, I couldn't get the addresses for @${bet.creatorUsername} and @${bet.opponentUsername}. Please try again later.`,
        bet.id
      );
    }
  } catch (e) {
    console.log("Error processing address request:", e);
    bet.addressRequestAttempt = (bet.addressRequestAttempt || 0) + 1;

    if (bet.addressRequestAttempt < MAX_ADDRESS_REQUESTS) {
      pendingAddressRequest.push(bet);
    }
  }

  await sleepThen(REPLY_PROCESSING_DELAY, processAddressRequest);
};

/**
 * Process initial bet replies
 */
const processReplies = async () => {
  const tweet = pendingReply.shift();
  if (!tweet || tweet.replyAttempt >= 3) {
    await sleepThen(REPLY_PROCESSING_DELAY, processReplies);
    return;
  }

  console.log("Processing initial reply for tweet:", tweet.id);

  try {
    // Parse bet from tweet text
    const betInfo = parsePostToBet(tweet.text);

    console.log("Got the betInfo", betInfo);

    if (!betInfo || betInfo.contains("INVALID")) {
      console.log("Could not parse bet from tweet");
      await replyToTweet(
        `Sorry, I couldn't understand the bet format. Please use the format: "@username I bet you X ETH that [condition]"`,
        tweet.id
      );
      await sleepThen(REPLY_PROCESSING_DELAY, processReplies);
      return;
    }

    const opponentUsername = betInfo.opponent.substring(1);
    const stakeAmount = betInfo.amount.split(" ")[0];
    const description = betInfo.bet_terms;

    console.log("These are the info", {
      opponentUsername,
      stakeAmount,
      description,
    });

    // Convert stake to wei
    const stake = BigInt(Math.floor(parseFloat(stakeAmount) * 1e18));

    if (stake <= 0n) {
      await replyToTweet(
        `Sorry, the bet amount must be greater than 0 ETH.`,
        tweet.id
      );
      await sleepThen(REPLY_PROCESSING_DELAY, processReplies);
      return;
    }

    // Ask @bankrbot for addresses
    const response = await replyToTweet(
      `@${BANKR_BOT} What are the addresses for @${tweet.author_username} and @${opponentUsername}?`,
      tweet.id
    );

    if (response?.data) {
      // Store bet information
      const bet = {
        id: tweet.id,
        creatorUsername: tweet.author_username,
        opponentUsername: opponentUsername,
        stake: stake,
        description: description,
        addressRequestTweetId: response.data.id,
        addressRequestAttempt: 0,
        timestamp: tweet.timestamp,
      };

      // Move to address request queue
      pendingAddressRequest.push(bet);
    } else {
      // Retry reply
      tweet.replyAttempt++;
      pendingReply.push(tweet);
    }
  } catch (e) {
    console.log("Error processing reply:", e);
    tweet.replyAttempt++;
    pendingReply.push(tweet);
  }

  await sleepThen(REPLY_PROCESSING_DELAY, processReplies);
};

/**
 * Start all processing queues
 */
const startProcessingQueues = () => {
  processReplies();
  processAddressRequest();
  processAddressConfirmation();
  processDeposits();
  processSettlements();
  //   processRefunds();  // NO REFUNDS FOR TESTNET
};

/**
 * Main search function to find bet tweets and settlement requests
 */
export default async function search(req, res) {
  // Handle admin operations
  try {
    const url = new URL("https://example.com" + req?.url);
    const restart = url.searchParams.get("restart");
    const manualSettle = url.searchParams.get("settle");
    const pass = url.searchParams.get("pass");

    if (pass === process.env.RESTART_PASS) {
      if (restart === "all") {
        startProcessingQueues();
      }
      if (manualSettle) {
        const [betId, winner] = manualSettle.split(",");
        // Find bet in pendingSettlement
        const betIndex = pendingSettlement.findIndex((b) => b.id === betId);
        if (betIndex >= 0) {
          const bet = pendingSettlement[betIndex];
          const winnerAddress =
            winner === "creator" ? bet.creatorAddress : bet.opponentAddress;

          resolveBetInContract(bet, winnerAddress).then((res) =>
            console.log("Manual settlement result:", res)
          );
        }
      }
    }
  } catch (e) {
    console.log("Error handling admin operations:", e);
  }

  // Rate limited?
  if (waitingForReset !== 0 && Date.now() / 1000 < waitingForReset) {
    return res.status(429).json({ error: "Rate limited" });
  }
  waitingForReset = 0;

  // Initialize Twitter client
  const consumerClient = new TwitterApi({
    appKey: process.env.TWITTER_API_KEY,
    appSecret: process.env.TWITTER_API_SECRET,
  });
  client = await consumerClient.appLogin();

  // Search for new bet tweets
  const start_time =
    lastTweetTimestamp > 0
      ? new Date(lastTweetTimestamp * 1000 + 1000).toISOString()
      : undefined;

  console.log("Search start_time:", start_time);

  console.log(`Searching for @${SMOL_BET_BOT} "bet"`);

  // Find bet creation tweets
  const betTweetGenerator = await client.v2.search(`@${SMOL_BET_BOT} "bet"`, {
    start_time,
    "tweet.fields": "author_id,created_at,referenced_tweets",
    expansions: "author_id",
    "user.fields": "username",
  });

  await sleep(10000);

  // Find settlement request tweets
  const settleTweetGenerator = await client.v2.search(
    `@${SMOL_BET_BOT} "settle bet"`,
    {
      start_time,
      "tweet.fields": "author_id,created_at,referenced_tweets",
      expansions: "author_id",
      "user.fields": "username",
    }
  );

  // Check rate limits
  console.log(
    "REMAINING API CALLS:",
    betTweetGenerator._rateLimit?.remaining || "unknown"
  );

  if (betTweetGenerator._rateLimit?.reset) {
    console.log(
      "RESET:",
      Number(
        (betTweetGenerator._rateLimit.reset - Date.now() / 1000) / 60
      ).toPrecision(4) + " minutes"
    );

    if (betTweetGenerator._rateLimit.remaining <= 0) {
      waitingForReset = betTweetGenerator._rateLimit.reset;
    }
  }

  // Process new bet tweets
  let seen = 0;
  const limit = 99;
  let latestValidTimestamp = 0;

  const betUserMap = createUserMap(betTweetResponse);

  // Process bet creation tweets
  for await (const tweet of betTweetGenerator) {
    if (++seen > limit) break;

    // Get unix timestamp in seconds
    console.log("Reading bet tweet:", tweet.id);
    tweet.timestamp = new Date(tweet.created_at).getTime() / 1000;

    // Add username to tweet object
    tweet.author_username = betUserMap.get(tweet.author_id);

    // Skip if already in a pending queue
    if (
      pendingReply.findIndex((t) => t.id === tweet.id) > -1 ||
      pendingAddressRequest.findIndex((t) => t.id === tweet.id) > -1 ||
      pendingAddressConfirmation.findIndex((t) => t.id === tweet.id) > -1 ||
      pendingDeposits.findIndex((t) => t.id === tweet.id) > -1 ||
      pendingSettlement.findIndex((t) => t.id === tweet.id) > -1
    ) {
      continue;
    }

    // Skip if already processed
    if (tweet.timestamp <= lastTweetTimestamp) {
      continue;
    }

    if (latestValidTimestamp === 0) {
      latestValidTimestamp = tweet.timestamp;
    }

    // Add to pendingReply queue
    console.log("Bet tweet qualified:", tweet.id);
    tweet.replyAttempt = 0;
    if (!SEARCH_ONLY) {
      pendingReply.push(tweet);
    } else {
      console.log(tweet);
    }
  }

  // Create user mapping for settlement tweets
  const settleUserMap = createUserMap(settleTweetResponse);

  // Process settlement request tweets
  seen = 0;
  for await (const tweet of settleTweetGenerator) {
    if (++seen > limit) break;

    // Get unix timestamp in seconds
    console.log("Reading settlement tweet:", tweet.id);
    tweet.timestamp = new Date(tweet.created_at).getTime() / 1000;

    // Add username to tweet object
    tweet.author_username = settleUserMap.get(tweet.author_id);

    if (!tweet.author_username) {
      console.log("Could not find username for settlement tweet:", tweet.id);
      continue;
    }

    // Skip if already processed
    if (tweet.timestamp <= lastTweetTimestamp) {
      continue;
    }

    if (latestValidTimestamp === 0 || tweet.timestamp > latestValidTimestamp) {
      latestValidTimestamp = tweet.timestamp;
    }

    // Find related active bet
    // This is a simplified approach - in production we would need more robust matching
    const activeBets = pendingSettlement.filter(
      (bet) =>
        bet.creatorUsername === tweet.author_username ||
        bet.opponentUsername === tweet.author_username
    );

    if (activeBets.length > 0) {
      // Take the most recent bet if multiple matches found
      const targetBet = activeBets.sort((a, b) => b.timestamp - a.timestamp)[0];
      console.log("Found matching active bet for settlement:", targetBet.id);

      // Add settlement info
      targetBet.settlementTweet = tweet;
      targetBet.settlementAttempt = 0;

      // Move bet to beginning of pendingSettlement queue for priority processing
      pendingSettlement.splice(pendingSettlement.indexOf(targetBet), 1);
      pendingSettlement.unshift(targetBet);
    } else {
      console.log("No matching active bet found for settlement request");

      // Reply to user that no active bet was found
      if (!SEARCH_ONLY) {
        await replyToTweet(
          `Sorry @${tweet.author_username}, I couldn't find an active bet for you to settle. Make sure the bet is active first.`,
          tweet.id
        );
      }
    }
  }

  // Update last processed tweet timestamp
  if (latestValidTimestamp > 0) {
    lastTweetTimestamp = latestValidTimestamp;
  }

  console.log("Last tweet timestamp:", lastTweetTimestamp);
  console.log("Pending reply queue length:", pendingReply.length);
  console.log("Pending settlement queue length:", pendingSettlement.length);

  // Start processing if not already running
  startProcessingQueues();

  res.status(200).json({
    pendingReply: pendingReply.length,
    pendingAddressRequest: pendingAddressRequest.length,
    pendingAddressConfirmation: pendingAddressConfirmation.length,
    pendingDeposits: pendingDeposits.length,
    pendingSettlement: pendingSettlement.length,
  });
}

/**
 * Expose completed bets for API access
 */
export const getCompletedBets = () => completedBets;

/**
 * Expose active bets for API access
 */
export const getActiveBets = () => pendingSettlement;

/**
 * Expose pending deposits for API access
 */
export const getPendingDeposits = () => pendingDeposits;
