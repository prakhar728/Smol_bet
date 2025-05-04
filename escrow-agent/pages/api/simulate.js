/**
 * Bankr Bot Simulator
 *
 * This script simulates the entire flow of the Bankr betting system
 * without relying on actual Twitter API calls or real blockchain transactions.
 */

import { sleep } from "../../utils/utils";

// Configuration constants
const SIMULATION_STEP_DELAY = 2000; // Delay between simulation steps (ms)

// Simulated blockchain addresses
const SIMULATED_ADDRESSES = {
  alex: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
  bob: "0x2B5AD5c4795c026514f8317c7a215E218DcCD6cF",
  charlie: "0x6813Eb9362372EEF6200f3b1dbC3f819671cBA69",
  diana: "0x1efF47bc3a10a45D4B230B5d10E37751FE6AA718",
  bankrbot: "0x09D40fCAc4D5F8C5d0D7E9DC846cB7a5c63aC91B",
};

// Create unique deposit addresses generator
const generateDepositAddress = (username, tweetId) => {
  const base = "0x";
  // Create a deterministic but different address based on username and tweet ID
  const hash = [...(username + tweetId).slice(0, 38)]
    .reduce(
      (acc, char) => acc + char.charCodeAt(0).toString(16).padStart(2, "0"),
      ""
    )
    .slice(0, 40);
  return base + hash;
};

// Simulated processing queues
const pendingReply = [];
const pendingAddressRequest = [];
const pendingAddressConfirmation = [];
const pendingDeposits = [];
const pendingSettlement = [];
const pendingRefund = [];
const completedBets = [];

// Create fake tweets that represent different stages of the betting process
const fakeTweets = [
  // Initial bet creation tweets
  {
    id: "tweet-001",
    author_id: "alex_id",
    author_username: "alex",
    text: "@funnyorfud Wagered @bob 0.05 ETH that Near will be up by 10% tomorrow.",
    created_at: "2023-05-01T10:00:00.000Z",
    timestamp: Date.now() / 1000 - 3600,
    referenced_tweets: [],
  },
  {
    id: "tweet-002",
    author_id: "charlie_id",
    author_username: "charlie",
    text: "@funnyorfud Wagered @diana 0.1 ETH that Bitcoin will close above 60k this week.",
    created_at: "2023-05-01T11:00:00.000Z",
    timestamp: Date.now() / 1000 - 3000,
    referenced_tweets: [],
  },

  // Bank bot responses with addresses (will be automatically generated in simulator)
  {
    id: "tweet-003",
    author_id: "bankrbot_id",
    author_username: "bankrbot",
    text:
      "@alex @bob Addresses: " +
      SIMULATED_ADDRESSES.alex +
      " and " +
      SIMULATED_ADDRESSES.bob,
    created_at: "2023-05-01T10:01:00.000Z",
    timestamp: Date.now() / 1000 - 3540,
    referenced_tweets: [{ type: "replied_to", id: "tweet-001" }],
  },
  {
    id: "tweet-004",
    author_id: "bankrbot_id",
    author_username: "bankrbot",
    text:
      "@charlie @diana Addresses: " +
      SIMULATED_ADDRESSES.charlie +
      " and " +
      SIMULATED_ADDRESSES.diana,
    created_at: "2023-05-01T11:01:00.000Z",
    timestamp: Date.now() / 1000 - 2940,
    referenced_tweets: [{ type: "replied_to", id: "tweet-002" }],
  },

  // Settlement tweets
  {
    id: "tweet-005",
    author_id: "alex_id",
    author_username: "alex",
    text: "@bankrbot settle bet - Near is up 10%, I won the bet with @bob",
    created_at: "2023-05-02T10:00:00.000Z",
    timestamp: Date.now() / 1000 - 1800,
    referenced_tweets: [],
  },
  {
    id: "tweet-006",
    author_id: "diana_id",
    author_username: "diana",
    text: "@bankrbot settle bet - Bitcoin is below 60k, I won the bet with @charlie",
    created_at: "2023-05-08T11:00:00.000Z",
    timestamp: Date.now() / 1000 - 1200,
    referenced_tweets: [],
  },
];

// Simulate Twitter conversation ID and latest tweet functions
const getConversationId = async (client, tweetId) => {
  console.log(`[Simulation] Getting conversation ID for tweet ${tweetId}`);
  return `conversation-${tweetId}`;
};

const getLatestConversationTweet = async (client, conversationId) => {
  console.log(
    `[Simulation] Getting latest tweet in conversation ${conversationId}`
  );
  const tweetId = conversationId.replace("conversation-", "");
  // Find all tweets that reference this tweet
  const relatedTweets = fakeTweets.filter(
    (tweet) =>
      tweet.referenced_tweets &&
      tweet.referenced_tweets.some((ref) => ref.id === tweetId)
  );

  if (relatedTweets.length === 0) {
    return null;
  }

  // Return the most recent one
  return relatedTweets.sort((a, b) => b.timestamp - a.timestamp)[0];
};

// Simulate Twitter search function
const searchTweets = async (query, options = {}) => {
  console.log(`[Simulation] Searching tweets with query: ${query}`);

  // Filter tweets based on the query
  let matchingTweets = [];

  if (query.includes("Wagered")) {
    matchingTweets = fakeTweets.filter(
      (tweet) =>
        tweet.text.toLowerCase().includes("wagered") &&
        tweet.author_username !== "bankrbot"
    );
  } else if (query.includes("settle")) {
    matchingTweets = fakeTweets.filter(
      (tweet) =>
        tweet.text.toLowerCase().includes("settle") &&
        tweet.author_username !== "bankrbot"
    );
  } else if (query.includes("conversation_id")) {
    const conversationId = query.split(":")[1].trim();
    const tweetId = conversationId.replace("conversation-", "");
    matchingTweets = fakeTweets.filter(
      (tweet) =>
        tweet.referenced_tweets &&
        tweet.referenced_tweets.some((ref) => ref.id === tweetId)
    );
  }

  return {
    async *[Symbol.asyncIterator]() {
      for (const tweet of matchingTweets) {
        yield tweet;
      }
    },
    _rateLimit: {
      remaining: 100,
      reset: Date.now() / 1000 + 900, // 15 minutes
    },
  };
};

// Simulate replying to a tweet
const replyToTweet = async (text, replyToId) => {
  console.log(
    `[Simulation] Replying to tweet ${replyToId} with text: ${text.slice(
      0,
      50
    )}...`
  );

  // Create a new fake tweet as a reply
  const newTweet = {
    id: `tweet-reply-${Date.now().toString(36)}`,
    author_id: "bankrbot_id",
    author_username: "bankrbot",
    text: text,
    created_at: new Date().toISOString(),
    timestamp: Date.now() / 1000,
    referenced_tweets: [{ type: "replied_to", id: replyToId }],
  };

  // Add to fake tweets
  fakeTweets.push(newTweet);

  return { data: { id: newTweet.id } };
};

// Simulate blockchain interactions
const simulateBlockchain = {
  // Simulate balance checking
  getBalance: async ({ address }) => {
    console.log(`[Simulation] Checking balance for address: ${address}`);

    // In real implementation, this would call blockchain API
    // For simulation, we'll return a balance based on the address pattern

    // Find the bet this address belongs to
    const creatorBet = pendingDeposits.find(
      (bet) => bet.creatorDepositAddress === address
    );
    const opponentBet = pendingDeposits.find(
      (bet) => bet.opponentDepositAddress === address
    );

    if (creatorBet && creatorBet.simulateCreatorDeposit) {
      return BigInt(Math.floor(parseFloat(creatorBet.stake) * 1.01)); // 1% extra for gas
    }

    if (opponentBet && opponentBet.simulateOpponentDeposit) {
      return BigInt(Math.floor(parseFloat(opponentBet.stake) * 1.01)); // 1% extra for gas
    }

    return BigInt(0);
  },

  // Simulate contract deployment
  getBankrDeployer: async () => {
    console.log("[Simulation] Getting Bankr deployer");
    return { address: SIMULATED_ADDRESSES.bankrbot };
  },

  // Simulate getting contract instance
  getBankrContract: async () => {
    console.log("[Simulation] Getting Bankr contract");
    return {
      createBet: async (description, creator, opponent, resolver) => {
        console.log(
          `[Simulation] Creating bet between ${creator} and ${opponent}`
        );
        console.log(`[Simulation] Bet description: "${description}"`);

        return {
          betId: `bet-${Date.now().toString(36)}`,
          hash: `0x${Math.random().toString(16).substring(2)}${Math.random()
            .toString(16)
            .substring(2)}`,
        };
      },

      resolveBet: async (betId, winner) => {
        console.log(
          `[Simulation] Resolving bet ${betId} with winner ${winner}`
        );

        return {
          hash: `0x${Math.random().toString(16).substring(2)}${Math.random()
            .toString(16)
            .substring(2)}`,
        };
      },
    };
  },

  // Format balance for display
  formatBalance: (balance) => {
    return (Number(balance) / 1e18).toFixed(5);
  },

  // Simulate gas price
  getGasPrice: async () => {
    return {
      maxFeePerGas: "5000000000",
      maxPriorityFeePerGas: "1000000000",
    };
  },
};

// Helper function for sleeping
const sleepThen = async (dur, fn) => {
  await sleep(dur);
  fn();
};

// Functions to process each stage
const processReplies = async () => {
  const tweet = pendingReply.shift();
  if (!tweet) {
    console.log("[Simulation] No pending replies to process");
    return;
  }

  console.log(`[Simulation] Processing initial reply for tweet: ${tweet.id}`);

  try {
    // Parse bet from tweet text
    const betInfo = parsePostToBet(tweet.text);

    if (!betInfo) {
      console.log("[Simulation] Could not parse bet from tweet");
      await replyToTweet(
        `Sorry, I couldn't understand the bet format. Please use the format: "@funnyorfud Wagered @username X ETH that [condition]"`,
        tweet.id
      );
      return;
    }

    const opponentUsername = betInfo.opponent.substring(1); // Remove '@' symbol
    const stakeAmount = betInfo.amount.split(" ")[0]; // Get the numeric part
    const description = betInfo.bet_terms;

    // Convert stake to wei (simulation)
    const stake = BigInt(Math.floor(parseFloat(stakeAmount) * 1e18));

    if (stake <= 0n) {
      await replyToTweet(
        `Sorry, the bet amount must be greater than 0 ETH.`,
        tweet.id
      );
      return;
    }

    // Ask @bankrbot for addresses
    const response = await replyToTweet(
      `@bankrbot What are the addresses for @${tweet.author_username} and @${opponentUsername}?`,
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
      console.log(
        `[Simulation] Added bet to pendingAddressRequest queue: ${JSON.stringify(
          bet,
          (key, value) => (typeof value === "bigint" ? value.toString() : value)
        )}`
      );
    }
  } catch (e) {
    console.log("[Simulation] Error processing reply:", e);
  }
};

const processAddressRequest = async () => {
  const bet = pendingAddressRequest.shift();
  if (!bet) {
    console.log("[Simulation] No pending address requests to process");
    return;
  }

  console.log(`[Simulation] Processing address request for bet: ${bet.id}`);

  // For simulation, we'll use predefined addresses
  bet.creatorAddress =
    SIMULATED_ADDRESSES[bet.creatorUsername] || SIMULATED_ADDRESSES.alex;
  bet.opponentAddress =
    SIMULATED_ADDRESSES[bet.opponentUsername] || SIMULATED_ADDRESSES.bob;

  console.log(
    `[Simulation] Found addresses: ${bet.creatorAddress}, ${bet.opponentAddress}`
  );

  // Move to address confirmation
  pendingAddressConfirmation.push(bet);
};

const processAddressConfirmation = async () => {
  const bet = pendingAddressConfirmation.shift();
  if (!bet) {
    console.log("[Simulation] No pending address confirmations to process");
    return;
  }

  console.log(
    `[Simulation] Processing address confirmation for bet: ${bet.id}`
  );

  // Generate deposit addresses
  const creatorPath = `${bet.creatorUsername}-${bet.id}`;
  const opponentPath = `${bet.opponentUsername}-${bet.id}`;

  const creatorAddress = generateDepositAddress(bet.creatorUsername, bet.id);
  const opponentAddress = generateDepositAddress(bet.opponentUsername, bet.id);

  // Store addresses and paths
  bet.creatorPath = creatorPath;
  bet.opponentPath = opponentPath;
  bet.creatorDepositAddress = creatorAddress;
  bet.opponentDepositAddress = opponentAddress;

  // Format stake amount
  const formattedStake = simulateBlockchain.formatBalance(bet.stake);

  // Reply with deposit instructions
  const response = await replyToTweet(
    `Bet confirmed! 🎲\n\n@${bet.creatorUsername} Please send ${formattedStake} ETH to: ${creatorAddress}\n\n@${bet.opponentUsername} Please send ${formattedStake} ETH to: ${opponentAddress}\n\nBoth parties must deposit within 10 minutes. When both deposits are received, the bet will be activated!`,
    bet.id
  );

  if (response?.data) {
    // Initialize deposit monitoring
    bet.creatorDepositAttempt = 0;
    bet.opponentDepositAttempt = 0;
    bet.creatorDeposited = false;
    bet.opponentDeposited = false;

    // For simulation, we'll set flags to simulate deposits after a few cycles
    bet.simulateCreatorDeposit = true;
    bet.simulateOpponentDeposit = true;

    // Move to deposit monitoring
    pendingDeposits.push(bet);
    console.log(
      `[Simulation] Added bet to pendingDeposits queue: ${JSON.stringify({
        ...bet,
        stake: bet.stake.toString(),
      })}`
    );
  }
};

const processDeposits = async () => {
  const bet = pendingDeposits.shift();
  if (!bet) {
    console.log("[Simulation] No pending deposits to process");
    return;
  }

  console.log(`[Simulation] Processing deposits for bet: ${bet.id}`);
  console.log(
    `[Simulation] Creator deposit attempts: ${bet.creatorDepositAttempt}`
  );
  console.log(
    `[Simulation] Opponent deposit attempts: ${bet.opponentDepositAttempt}`
  );

  // Check deposits from both participants
  let creatorDeposited = bet.creatorDeposited || false;
  let opponentDeposited = bet.opponentDeposited || false;

  // Simulate deposit checks with delays
  if (!creatorDeposited && bet.creatorDepositAttempt >= 2) {
    // Simulate deposit after 2 attempts
    try {
      const creatorBalance = await simulateBlockchain.getBalance({
        address: bet.creatorDepositAddress,
      });
      console.log(
        `[Simulation] Creator balance: ${simulateBlockchain.formatBalance(
          creatorBalance
        )}`
      );

      if (creatorBalance >= bet.stake) {
        creatorDeposited = true;
        bet.creatorDeposited = true;
        console.log("[Simulation] Creator deposit confirmed");
      }
    } catch (e) {
      console.log("[Simulation] Error checking creator balance:", e);
    }
  }

  if (!opponentDeposited && bet.opponentDepositAttempt >= 3) {
    // Simulate deposit after 3 attempts (slightly later)
    try {
      const opponentBalance = await simulateBlockchain.getBalance({
        address: bet.opponentDepositAddress,
      });
      console.log(
        `[Simulation] Opponent balance: ${simulateBlockchain.formatBalance(
          opponentBalance
        )}`
      );

      if (opponentBalance >= bet.stake) {
        opponentDeposited = true;
        bet.opponentDeposited = true;
        console.log("[Simulation] Opponent deposit confirmed");
      }
    } catch (e) {
      console.log("[Simulation] Error checking opponent balance:", e);
    }
  }

  // If both have deposited, create the bet in contract
  if (creatorDeposited && opponentDeposited) {
    console.log(
      "[Simulation] Both parties deposited, creating bet in contract"
    );

    const betResult = await simulateBlockchain
      .getBankrContract()
      .then((contract) =>
        contract.createBet(
          bet.description,
          bet.creatorAddress,
          bet.opponentAddress,
          "0x0000000000000000000000000000000000000000" // No resolver
        )
      );

    if (betResult) {
      bet.betId = betResult.betId;

      // Reply with bet confirmation
      await replyToTweet(
        `Bet created! 🎲\n\nBet between @${bet.creatorUsername} and @${
          bet.opponentUsername
        } is now active!\n\nStake: ${simulateBlockchain.formatBalance(
          bet.stake
        )} ETH each\n\nDescription: "${
          bet.description
        }"\n\nEither party can trigger settlement by tagging @bankrbot`,
        bet.id
      );

      // Move to active bets (pending settlement)
      pendingSettlement.push(bet);
      console.log(
        `[Simulation] Moved bet to pendingSettlement queue: ${bet.id}`
      );

      return; // Exit function after moving the bet
    }
  }

  // Increment attempt counters for deposits not yet received
  if (!creatorDeposited) {
    bet.creatorDepositAttempt++;
  }
  if (!opponentDeposited) {
    bet.opponentDepositAttempt++;
  }

  // Put back in queue to check again
  pendingDeposits.push(bet);
};

const processSettlements = async () => {
  const bet = pendingSettlement.shift();
  if (!bet) {
    console.log("[Simulation] No pending settlements to process");
    return;
  }

  console.log(`[Simulation] Processing settlement for bet: ${bet.id}`);

  // For simulation, we'll check if there's a settlement tweet
  const settlementTweets = fakeTweets.filter(
    (tweet) =>
      tweet.text.toLowerCase().includes("settle bet") &&
      (tweet.author_username === bet.creatorUsername ||
        tweet.author_username === bet.opponentUsername)
  );

  if (settlementTweets.length > 0) {
    bet.settlementTweet = settlementTweets[0];
    const settlementText = bet.settlementTweet.text.toLowerCase();

    let winnerAddress = null;
    let winnerUsername = null;
    let settlementReason = "";

    if (settlementText.includes(bet.creatorUsername.toLowerCase())) {
      winnerAddress = bet.creatorAddress;
      winnerUsername = bet.creatorUsername;
      settlementReason = "Creator won";
    } else if (settlementText.includes(bet.opponentUsername.toLowerCase())) {
      winnerAddress = bet.opponentAddress;
      winnerUsername = bet.opponentUsername;
      settlementReason = "Opponent won";
    } else {
      // Default winner for simulation
      winnerAddress = bet.creatorAddress;
      winnerUsername = bet.creatorUsername;
      settlementReason = "Default winner (simulation)";
    }

    console.log(`[Simulation] Determined winner: ${winnerUsername}`);

    // Resolve bet in the contract
    const contract = await simulateBlockchain.getBankrContract();
    const resolution = await contract.resolveBet(bet.betId, winnerAddress);

    if (resolution) {
      // Reply with settlement confirmation
      await replyToTweet(
        `Bet settled! 🎉\n\n@${winnerUsername} won ${simulateBlockchain.formatBalance(
          (bet.stake * 2n * 99n) / 100n
        )} ETH\n\nReason: ${settlementReason}\n\nTx: https://basescan.org/tx/${
          resolution.hash
        }`,
        bet.settlementTweet.id
      );

      // Move bet to completed
      completedBets.push({
        ...bet,
        winner: winnerUsername,
        settlementTx: resolution.hash,
      });

      console.log(
        `[Simulation] Bet settled and moved to completedBets: ${bet.id}`
      );
    }
  } else {
    // No settlement tweet yet, put back in queue
    console.log(
      "[Simulation] No settlement tweet found, putting bet back in queue"
    );
    pendingSettlement.push(bet);
  }
};

// Main simulation function
const runSimulation = async () => {
  console.log("=== STARTING BANKR BOT SIMULATION ===");

  // Initialize simulation
  console.log("\n[Simulation] Step 1: Finding bet creation tweets");

  // Find bet creation tweets and add to pendingReply
  for (const tweet of fakeTweets) {
    if (
      tweet.text.toLowerCase().includes("wagered") &&
      tweet.text.toLowerCase().includes("eth") &&
      !tweet.text.toLowerCase().includes("settle") &&
      tweet.author_username !== "bankrbot"
    ) {
      pendingReply.push(tweet);
      console.log(`[Simulation] Found bet tweet: ${tweet.id}`);
    }
  }

  // Process each step of the flow with delays
  await sleep(SIMULATION_STEP_DELAY);
  console.log("\n[Simulation] Step 2: Processing initial replies");

  // Process initial replies
  while (pendingReply.length > 0) {
    await processReplies();
    await sleep(SIMULATION_STEP_DELAY);
  }

  console.log("\n[Simulation] Step 3: Processing address requests");

  // Process address requests
  while (pendingAddressRequest.length > 0) {
    await processAddressRequest();
    await sleep(SIMULATION_STEP_DELAY);
  }

  console.log("\n[Simulation] Step 4: Processing address confirmations");

  // Process address confirmations
  while (pendingAddressConfirmation.length > 0) {
    await processAddressConfirmation();
    await sleep(SIMULATION_STEP_DELAY);
  }

  console.log("\n[Simulation] Step 5: Processing deposits");

  // Process deposits (multiple cycles to simulate time passing)
  for (let i = 0; i < 5; i++) {
    if (pendingDeposits.length === 0) break;

    const betsToProcess = [...pendingDeposits];
    pendingDeposits.length = 0;

    for (const bet of betsToProcess) {
      pendingDeposits.push(bet);
      await processDeposits();
      await sleep(SIMULATION_STEP_DELAY / 2);
    }

    console.log(
      `[Simulation] Deposit cycle ${i + 1} completed. Bets remaining: ${
        pendingDeposits.length
      }`
    );
    await sleep(SIMULATION_STEP_DELAY);
  }

  console.log("\n[Simulation] Step 6: Processing settlements");

  // Process settlements
  while (pendingSettlement.length > 0) {
    await processSettlements();
    await sleep(SIMULATION_STEP_DELAY);
  }

  // Show simulation results
  console.log("\n=== SIMULATION COMPLETE ===");
  console.log("\nCompleted Bets:");
  completedBets.forEach((bet, index) => {
    console.log(`\nBet #${index + 1}:`);
    console.log(`Creator: @${bet.creatorUsername}`);
    console.log(`Opponent: @${bet.opponentUsername}`);
    console.log(`Description: ${bet.description}`);
    console.log(`Stake: ${simulateBlockchain.formatBalance(bet.stake)} ETH`);
    console.log(`Winner: @${bet.winner}`);
    console.log(`Settlement Transaction: ${bet.settlementTx}`);
  });

  console.log("\nAll generated tweets:");
  fakeTweets.forEach((tweet, index) => {
    console.log(`\nTweet #${index + 1} (${tweet.id}):`);
    console.log(`From: @${tweet.author_username}`);
    console.log(`Text: ${tweet.text}`);
  });
};

// Export simulation functions for testing
export {
  runSimulation,
  pendingReply,
  pendingAddressRequest,
  pendingAddressConfirmation,
  pendingDeposits,
  pendingSettlement,
  completedBets,
  fakeTweets,
};

// If this module is run directly, start the simulation
if (require.main === module) {
  runSimulation().catch(console.error);
}
