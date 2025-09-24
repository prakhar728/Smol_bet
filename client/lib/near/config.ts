export const NETWORK = process.env.NEXT_PUBLIC_NEAR_NETWORK || "testnet";
export const CONTRACT_ID = process.env.NEXT_PUBLIC_CONTRACT_ID!;
export const CREATE_ACCESS_KEY_FOR = process.env.NEXT_PUBLIC_CREATE_ACCESS_KEY_FOR;

export const RPC_URL = NETWORK === "mainnet"
  ? "https://rpc.mainnet.fastnear.com"
  : "https://rpc.testnet.fastnear.com";

export const TGAS = (n: number) => `${n}000000000000`; // 1 TGAS = 1e12
export const NO_DEPOSIT = "0";

