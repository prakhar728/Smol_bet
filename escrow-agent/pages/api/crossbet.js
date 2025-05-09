import { searchTweetsWithMasa } from "../../utils/social/masa";
import { crosspostReply } from "../../utils/social/crosspost";
import { generateAddress, networkId } from "@neardefi/shade-agent-js";
import { evm } from "../../utils/evm";
import { fetchJson, sleep } from "../../utils/utils";
import { parsePostToBet, resolveBetWithAI } from "./lib/intent-parser";

// Bot configuration
const SMOL_BET_BOT = "funnyorfud";
const BANKR_BOT = process.env.BANKRBOT || "bankrbot";
const BANKR_BOT_ID = process.env.BANKRBOT_ID || "1871167275723575296";
const ESCROW_BOT_ID = "1869279598522896384";

// Configuration constants
const REPLY_PROCESSING_DELAY = 30000;
const DEPOSIT_PROCESSING_DELAY = 60000;
const SETTLEMENT_PROCESSING_DELAY = 30000;
const REFUND_PROCESSING_DELAY = 60000;
const MAX_DEPOSIT_ATTEMPTS = 12 * 60; // 12 per minute * 60 mins
const MAX_ADDRESS_REQUESTS = 3; // Maximum attempts to get addresses from bankrbot
const POLLING_INTERVAL = 5 * 60 * 1000; // 5 minutes between search polls

// Processing queues
const pendingReply = []; // New bet requests awaiting initial reply
const pendingAddressRequest = []; // Waiting for @bankrbot to provide addresses
const pendingAddressConfirmation = []; // Awaiting creator & opponent confirmation
const pendingDeposits = []; // Waiting for both parties to deposit stakes
const pendingSettlement = []; // Active bets awaiting settlement
const pendingRefund = []; // Failed bets requiring refunds
const completedBets = []; // Successfully settled bets (for record-keeping)
const acknowledgedPosts = new Set(); // Track if the post is already picked up by any queue.

// Keep track of the last processed tweet
let lastSearchTimestamp =
  parseInt(process.env.LAST_SEARCH_TIMESTAMP) ||
  Math.floor(Date.now() / 1000) - 86400; // Default to 24 hours ago

let lastSettleBetSeachTimestamp =
  parseInt(process.env.LAST_SEARCH_TIMESTAMP) ||
  Math.floor(Date.now() / 1000) - 86400; // Default to 24 hours ago

// Toggle for testing mode
const FAKE_REPLY = process.env.FAKE_REPLY === "true";
const SEARCH_ONLY = process.env.SEARCH_ONLY === "true";

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
 * Create a bet in the smart contract
 */
const createBetInContract = async (bet) => {
  try {
    console.log("Creating bet...");
    const createResult = await evm.createBetTx({
      description: bet.description,
      creator: bet.creatorAddress,
      opponent: bet.opponentAddress,
      resolver: bet.resolverAddress,
      stake: bet.stake * 2n,
      path: bet.betPath,
    });

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
    const resolveResult = await evm.resolveBetTx({
      betId: bet.betId,
      winner: winner,
      resolverAddress: bet.resolverAddress,
      path: bet.betPath,
    });

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
 * Process bet settlements
 */
const processSettlements = async () => {
  const bet = pendingSettlement.shift();
  if (!bet) {
    await sleep(SETTLEMENT_PROCESSING_DELAY);
    processSettlements();
    return;
  }

  if (!bet.settlementTweet) {
    pendingSettlement.push(bet); // Put it back at the end of the queue
    await sleep(SETTLEMENT_PROCESSING_DELAY);
    processSettlements();
    return;
  }
  console.log("Processing settlement for bet:", bet.id);

  // Parse bet description to determine winner using AI
  const resolution = await resolveBetWithAI(bet.description);

  let winnerAddress = "";
  let winnerUsername = "";

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
      // Reply with settlement confirmation
      await crosspostReply(
        `Bet settled! 🎉\n\n@${winnerUsername} won ${evm.formatBalance(
          (bet.stake * 2n * 99n) / 100n
        )} ETH\n\nReason: ${settlementReason}\n\nTx: ${
          resolution.explorerLink
        }`,
        bet.settlementTweet,
        FAKE_REPLY
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

  await sleep(SETTLEMENT_PROCESSING_DELAY);
  processSettlements();
};

/**
 * Process deposit monitoring
 */
const processDeposits = async () => {
  const bet = pendingDeposits.shift();
  if (!bet) {
    await sleep(DEPOSIT_PROCESSING_DELAY);
    processDeposits();
    return;
  }

  console.log("Processing deposits for bet:", bet.id);
  console.log("Deposit attempts:", bet.depositAttempt);

  // Check if deposits are timed out
  const timedOut = bet.depositAttempt >= MAX_DEPOSIT_ATTEMPTS;

  if (timedOut) {
    console.log("Deposit timed out for bet:", bet.id);
    pendingRefund.push(bet);
    await sleep(DEPOSIT_PROCESSING_DELAY);
    processDeposits();
    return;
  }

  // Check for deposits
  let totalDeposited = bet.totalDeposited || false;

  if (!totalDeposited) {
    try {
      const balance1 = await evm.getBalance({
        address: bet.authorDepositAddress,
      });
      console.log("Author deposit balance:", evm.formatBalance(balance1));

      const balance2 = await evm.getBalance({
        address: bet.opponentDepositAddress,
      });
      console.log("Opponent deposit balance:", evm.formatBalance(balance2));

      // Check if both parties have deposited their stakes
      if (balance1 >= bet.stake && balance2 >= bet.stake) {
        let tx = await getTransactionsForAddress(bet.authorDepositAddress);
        const creatorAddress = tx.from;

        tx = await getTransactionsForAddress(bet.opponentDepositAddress);
        const opponentAddress = tx.from;

        totalDeposited = true;
        bet.totalDeposited = true;
        bet.creatorAddress = creatorAddress;
        bet.opponentAddress = opponentAddress;
        console.log("Total deposit confirmed");
      }
    } catch (e) {
      console.log("Error checking balance:", e);
    }
  }

  // If the full amount has been deposited, create the bet in contract
  if (totalDeposited) {
    console.log("Full amount deposited, preparing to create bet in contract");

    // Generate a resolver address and path
    const betPath = `${bet.creatorUsername}-${bet.opponentUsername}-${bet.id}`;
    const { address: resolverAddress } = await generateAddress({
      publicKey:
        networkId === "testnet"
          ? process.env.MPC_PUBLIC_KEY_TESTNET
          : process.env.MPC_PUBLIC_KEY_MAINNET,
      accountId: process.env.NEXT_PUBLIC_contractId,
      path: betPath,
      chain: "evm",
    });

    bet.resolverAddress = resolverAddress;
    bet.betPath = betPath;

    // First, transfer funds from both deposit addresses to the resolver address
    console.log("Transferring funds to resolver address:", resolverAddress);
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
      processDeposits();
      return;
    }

    console.log("Successfully transferred funds to resolver address");

    // Now create the bet in the contract using funds from the resolver address
    const betResult = await createBetInContract(bet);

    if (betResult.success) {
      bet.betId = betResult.betId;

      // Reply with bet confirmation
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

  await sleep(DEPOSIT_PROCESSING_DELAY);
  processDeposits();
};

/**
 * Process initial bet replies
 */
const processReplies = async () => {
  const tweet = pendingReply.shift();
  if (!tweet || tweet.replyAttempt >= 3) {
    await sleep(REPLY_PROCESSING_DELAY);
    processReplies();
    return;
  }

  console.log("Processing initial reply for tweet:", tweet.id);

  try {
    // Parse bet from tweet text
    const betInfo = await parsePostToBet(tweet.text);

    console.log("Parsed bet info:", betInfo);

    if (!betInfo || betInfo.includes("INVALID")) {
      console.log("Could not parse bet from tweet");
      await crosspostReply(
        `Sorry, I couldn't understand the bet format. Please use the format: "@username I bet you X ETH that [condition]"`,
        tweet,
        FAKE_REPLY
      );
      await sleep(REPLY_PROCESSING_DELAY);
      processReplies();
      return;
    }

    let betParsedJson = JSON.parse(betInfo);

    const opponentUsername = betParsedJson.opponent.substring(1);
    const stakeAmount = betParsedJson.amount.split(" ")[0];
    const description = betParsedJson.bet_terms;

    // Convert stake to wei
    const stake = BigInt(Math.floor(parseFloat(stakeAmount) * 1e18));

    if (stake <= 0n) {
      await crosspostReply(
        `Sorry, the bet amount must be greater than 0 ETH.`,
        tweet,
        FAKE_REPLY
      );
      await sleep(REPLY_PROCESSING_DELAY);
      processReplies();
      return;
    }

    const formattedStake = evm.formatBalance(stake);

    const authorBetPath = `${tweet.author_username}-${tweet.id}`;
    const { address: authorDepositAddress } = await generateAddress({
      publicKey:
        networkId === "testnet"
          ? process.env.MPC_PUBLIC_KEY_TESTNET
          : process.env.MPC_PUBLIC_KEY_MAINNET,
      accountId: process.env.NEXT_PUBLIC_contractId,
      path: authorBetPath,
      chain: "evm",
    });

    const opponentBetPath = `${opponentUsername}-${tweet.id}`;
    const { address: opponentDepositAddress } = await generateAddress({
      publicKey:
        networkId === "testnet"
          ? process.env.MPC_PUBLIC_KEY_TESTNET
          : process.env.MPC_PUBLIC_KEY_MAINNET,
      accountId: process.env.NEXT_PUBLIC_contractId,
      path: opponentBetPath,
      chain: "evm",
    });

    // Ask for deposit
    const response = await crosspostReply(
      `I got you! \n @${tweet.author_username} deposit ${formattedStake} ETH to ${authorDepositAddress} \n and @${opponentUsername} deposit ${formattedStake} ETH to ${opponentDepositAddress}`,
      tweet,
      FAKE_REPLY
    );

    if (response?.data) {
      // Find conversation ID for future searches
      // We'll use the original tweet ID as a conversation ID for Masa searches
      const conversationId = tweet.conversation_id || tweet.id;

      // Store bet information
      const bet = {
        id: tweet.id,
        conversationId: conversationId,
        creatorUsername: tweet.author_username,
        opponentUsername: opponentUsername,
        stake: stake,
        description: description,
        mostRecentTweetId: response.data.results[0]["details"]["id"],
        authorBetPath: authorBetPath,
        authorDepositAddress: authorDepositAddress,
        opponentBetPath: opponentBetPath,
        opponentDepositAddress: opponentDepositAddress,
        addressRequestAttempt: 0,
        depositAttempt: 0,
        timestamp: tweet.created_at
          ? new Date(tweet.created_at).getTime() / 1000
          : Math.floor(Date.now() / 1000),
      };

      console.log("Created bet object:", bet);

      // Move to address request queue
      pendingDeposits.push(bet);
    } else {
      // Retry reply
      console.log("Failed to get response from crosspostReply, retrying");
      tweet.replyAttempt++;
      pendingReply.push(tweet);
    }
  } catch (e) {
    console.log("Error processing reply:", e);
    tweet.replyAttempt++;
    pendingReply.push(tweet);
  }

  await sleep(REPLY_PROCESSING_DELAY);
  processReplies();
};

/**
 * Start all processing queues
 */
const startProcessingQueues = () => {
  processReplies();
  processDeposits();
  processSettlements();
};

/**
 * Search for bet tweets and settlement requests
 */
const searchTwitter = async () => {
  console.log("Searching for new bets and settlement requests...");
  console.log(
    "Last search timestamp:",
    new Date(lastSearchTimestamp * 1000).toISOString()
  );

  try {
    // Search for bet tweets
    let betTweets = [];
    let retry = false;

    do {
      try {
        betTweets = await searchTweetsWithMasa(`@${SMOL_BET_BOT} "bet"`, 100);
        retry = false;
      } catch (error) {
        console.log("Error fetching betTweets trying again in 30 seconds");
        await sleep(30000);
        retry = true;
      }
    } while (retry);

    console.log("Log betTweets", betTweets);

    if (betTweets && betTweets.length > 0) {
      console.log(`Found ${betTweets.length} potential bet tweets`);
      let latestTimestamp = lastSearchTimestamp;

      for (const tweet of betTweets) {
        // Extract fields from Masa API response format
        const processedTweet = {
          id: tweet.ExternalID,
          text: tweet.Content,
          author_username: tweet.Metadata.username || "unknown_user",
          conversation_id: tweet.Metadata.conversation_id,
          created_at: tweet.Metadata.created_at,
        };

        // Get timestamp from Masa's created_at field
        const tweetTimestamp = processedTweet.created_at
          ? new Date(processedTweet.created_at).getTime() / 1000
          : Math.floor(Date.now() / 1000);

        if (tweetTimestamp <= lastSearchTimestamp) continue;

        if (acknowledgedPosts.has(processedTweet.id) || tweet.Metadata.user_id == ESCROW_BOT_ID) continue;

        acknowledgedPosts.add(processedTweet.id);

        if (tweetTimestamp > latestTimestamp) {
          latestTimestamp = tweetTimestamp;
        }

        processedTweet.replyAttempt = 0;
        if (!SEARCH_ONLY) {
          pendingReply.push(processedTweet);
        } else {
          console.log("[Search Only] Found valid bet tweet:", processedTweet);
        }
      }

      // Update last search timestamp
      lastSearchTimestamp = latestTimestamp;
    }

    await sleep(60000);

    let settlementTweets = [];
    retry = false;
    do {
      try {
        // Search for settlement tweets
        settlementTweets = await searchTweetsWithMasa(
          `@${SMOL_BET_BOT} "settle"`,
          100
        );
        retry = false;
      } catch (error) {
        console.log(
          "Error fetching settlement tweets trying again in 30 seconds"
        );
        await sleep(30000);
        retry = true;
      }
    } while (retry);

    if (settlementTweets && settlementTweets.length > 0) {
      console.log(
        `Found ${settlementTweets.length} potential settlement tweets`
      );

      for (const tweet of settlementTweets) {
        // Extract fields from Masa API response format
        const processedTweet = {
          id: tweet.ExternalID,
          text: tweet.Content,
          author_username: tweet.Metadata.username || "unknown_user",
          conversation_id: tweet.Metadata.conversation_id,
          created_at: tweet.Metadata.created_at,
        };

        // Get timestamp from Masa's created_at field
        const tweetTimestamp = processedTweet.created_at
          ? new Date(processedTweet.created_at).getTime() / 1000
          : Math.floor(Date.now() / 1000);

        if (tweetTimestamp <= lastSettleBetSeachTimestamp) continue;

        if (acknowledgedPosts.has(processedTweet.id) || tweet.Metadata.user_id == ESCROW_BOT_ID) continue;

        acknowledgedPosts.add(processedTweet.id);

        if (tweetTimestamp > lastSettleBetSeachTimestamp) {
          lastSettleBetSeachTimestamp = tweetTimestamp;
        }

        // Find matching active bets for this user
        const matchingBets = pendingSettlement.filter(
          (b) =>
            b.creatorUsername === processedTweet.author_username ||
            b.opponentUsername === processedTweet.author_username
        );

        if (matchingBets.length > 0) {
          const bet = matchingBets.sort((a, b) => b.timestamp - a.timestamp)[0];
          console.log("Matched settlement tweet to bet:", bet.id);

          bet.settlementTweet = processedTweet;
          bet.settlementAttempt = 0;

          pendingSettlement.splice(pendingSettlement.indexOf(bet), 1);
          pendingSettlement.unshift(bet);
        } else {
          console.log(
            "No matching active bet for settlement tweet:",
            processedTweet.id
          );
          if (!SEARCH_ONLY) {
            await crosspostReply(
              `Sorry @${processedTweet.author_username}, I couldn't find an active bet for you to settle. Make sure the bet is active first.`,
              processedTweet,
              FAKE_REPLY
            );
          }
        }
      }
    }

    // Schedule next search
    setTimeout(searchTwitter, POLLING_INTERVAL);
  } catch (error) {
    console.error("Error in searchTwitter():", error);
    // Retry after a delay even on error
    setTimeout(searchTwitter, POLLING_INTERVAL);
  }
};

/**
 * Main API handler for the bet system
 */
export default async function handler(req, res) {
  try {
    // --- Handle admin triggers (restart, manual settlement) ---
    const url = new URL("https://example.com" + req?.url);
    const restart = url.searchParams.get("restart");
    const manualSettle = url.searchParams.get("settle");
    const pass = url.searchParams.get("pass");

    if (pass === process.env.RESTART_PASS) {
      if (restart === "all") {
        startProcessingQueues();
        searchTwitter(); // Start the polling search
      }
      if (manualSettle) {
        const [betId, winner] = manualSettle.split(",");
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

    // Start the system if this is the first time
    if (!global.systemStarted) {
      global.systemStarted = true;
      startProcessingQueues();
      searchTwitter(); // Start the polling search
    }

    // --- Respond with queue state ---
    res.status(200).json({
      pendingReply: pendingReply.length,
      pendingAddressRequest: pendingAddressRequest.length,
      pendingAddressConfirmation: pendingAddressConfirmation.length,
      pendingDeposits: pendingDeposits.length,
      pendingSettlement: pendingSettlement.length,
      lastSearchTimestamp: lastSearchTimestamp,
    });
  } catch (e) {
    console.error("Error in handler:", e);
    res.status(500).json({ error: "Internal server error" });
  }
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
