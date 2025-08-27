
// BOT CONFIGURATIONS
export const BOT_NAME = process.env.BOT_NAME || "smol_bet";
export const BOT_ID = process.env.BOT_ID || "1869279598522896384";


// LOOP CONSTANTS
export const REPLY_PROCESSING_DELAY = 30000;
export const DEPOSIT_PROCESSING_DELAY = 60000;
export const SETTLEMENT_PROCESSING_DELAY = 30000;
export const MAX_DEPOSIT_ATTEMPTS = 12 * 60; // 12 per minute * 60 mins
export const POLLING_INTERVAL = 5 * 60 * 1000; // 5 minutes between search polls

export const BASESCAN_API = (networkId: string) =>
  `https://api${networkId === "testnet" ? "-sepolia" : ""}.basescan.org/api`;

export const FAKE_REPLY = process.env.FAKE_REPLY === "true";
export const SEARCH_ONLY = process.env.SEARCH_ONLY === "true";

export const NEAR_SIGNED_AUTH = process.env.NEAR_SIGNED_AUTH || "";