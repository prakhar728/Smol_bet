// lib/near/client.ts
import { JsonRpcProvider, FailoverRpcProvider } from "@near-js/providers";
import { Account } from "@near-js/accounts";
import { KeyPairSigner } from "@near-js/signers";
import { KeyPair } from "@near-js/crypto";

export type NearEnv = {
  NEAR_NETWORK: "mainnet" | "testnet";
  NEAR_RPC_URLS?: string;          // comma-separated list for failover (optional)
  ACCOUNT_ID?: string;             // signer (optional for read-only)
  PRIVATE_KEY?: string;            // ed25519:... (optional for read-only)
};

type ClientDeps = {
  provider: JsonRpcProvider;
  signer?: KeyPairSigner;
  account?: Account;               // only if ACCOUNT_ID + PRIVATE_KEY present
  network: NearEnv["NEAR_NETWORK"];
};

/**
 * Build a FailoverRpcProvider from env or fall back to sane defaults.
 */
export function buildProvider(network: NearEnv["NEAR_NETWORK"], urls?: string) {
  const defaultUrls =
    network === "mainnet"
      ? ["https://rpc.mainnet.near.org", "https://free.rpc.fastnear.com"]
      : ["https://rpc.testnet.near.org", "https://test.rpc.fastnear.com"];

  const list = (urls?.split(",").map(s => s.trim()).filter(Boolean) ?? defaultUrls)
    .map(u => new JsonRpcProvider({ url: u }));

  return new FailoverRpcProvider(list, {
    retries: 3,
    backoff: 2,
    wait: 500,
  });
}

/**
 * Centralized client factory. Reads from process.env by default.
 */
export async function getNearClient(env: Partial<NearEnv> = {}): Promise<ClientDeps> {
  const network = (env.NEAR_NETWORK ?? process.env.NEAR_NETWORK ?? "testnet") as NearEnv["NEAR_NETWORK"];
  const rpcUrls = env.NEAR_RPC_URLS ?? process.env.NEAR_RPC_URLS;
  const ACCOUNT_ID = env.ACCOUNT_ID ?? process.env.ACCOUNT_ID;
  const PRIVATE_KEY = env.PRIVATE_KEY ?? process.env.PRIVATE_KEY;

  const provider = buildProvider(network, rpcUrls);

  // Create signer + account only if creds are present
  if (ACCOUNT_ID && PRIVATE_KEY) {
    const keyPair = KeyPair.fromString(PRIVATE_KEY);
    const signer = new KeyPairSigner(keyPair);
    const account = new Account(ACCOUNT_ID, provider, signer);
    return { provider, signer, account, network };
  }

  return { provider, network };
}

/**
 * Helper to assert that we have a signer-backed Account (for change methods).
 */
export function requireSignerAccount(deps: ClientDeps): Account {
  if (!deps.account) {
    throw new Error(
      "No signer configured. Set ACCOUNT_ID and PRIVATE_KEY in your environment to perform change methods."
    );
  }
  return deps.account;
}
