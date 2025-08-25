// lib/near/functions.ts
import { wNEAR, USDT } from "@near-js/tokens/testnet"; // swap to /mainnet in prod
import { FungibleToken } from "@near-js/tokens";
import { actionCreators } from "@near-js/transactions";
import { getNearClient, requireSignerAccount } from "./client";

/** ---------- View helpers ---------- */

/**
 * Call a contract view function (read-only).
 */
export async function viewFunction<T = unknown>(params: {
  contractId: string;
  methodName: string;
  args?: Record<string, unknown>;
}): Promise<T> {
  const { provider } = await getNearClient();
  const res = await provider.callFunction(
    params.contractId,
    params.methodName,
    params.args ?? {}
  );
  // provider.callFunction returns raw JSON result already
  return res as T;
}

/** ---------- Change helpers ---------- */

/**
 * Call a contract change function (state-changing).
 * Attach optional deposit (as NEAR string) and gas (TGas).
 */
export async function callFunction<T = unknown>(params: {
  contractId: string;
  methodName: string;
  args?: Record<string, unknown>;
  depositNEAR?: string;   // e.g. "0.001"
  gasTGas?: number;       // e.g. 30
  waitUntil?: "NONE" | "OPTIMISTIC" | "FINAL";
}): Promise<T | undefined> {
  const deps = await getNearClient();
  const account = requireSignerAccount(deps);

  const gas = String((params.gasTGas ?? 100) * 10 ** 12); // yocto-gas as string
  const deposit = params.depositNEAR ? wNEAR.toUnits(params.depositNEAR) : 0n;

  const outcome = await account.callFunction({
    contractId: params.contractId,
    methodName: params.methodName,
    args: params.args ?? {},
    gas,
    deposit,
    waitUntil: params.waitUntil ?? "FINAL",
  });

  // If method returns a JSON, it will be in outcome.result
  // (The modular SDK normalizes this—no need to base64 decode.)
  return (outcome as unknown) as T;
}

/** ---------- Account + tokens ---------- */

/**
 * Get NEAR balance for the signer, returned as a human-readable string.
 */
export async function getNearBalance(): Promise<string> {
  const deps = await getNearClient();
  const account = requireSignerAccount(deps);
  const amount = await account.getBalance(wNEAR); // bigint
  return wNEAR.toDecimal(amount);                 // e.g. "1.2345"
}

/**
 * Transfer native NEAR to a receiver.
 */
export async function transferNear(params: {
  receiverId: string;
  amountNEAR: string; // e.g. "0.1"
  waitUntil?: "NONE" | "OPTIMISTIC" | "FINAL";
}) {
  const deps = await getNearClient();
  const account = requireSignerAccount(deps);
  return account.transfer({
    token: wNEAR,
    amount: wNEAR.toUnits(params.amountNEAR),
    receiverId: params.receiverId,
    waitUntil: params.waitUntil ?? "FINAL",
  });
}

/**
 * Get an FT balance. Defaults to testnet USDT; pass a contract to override.
 */
export async function getFtBalance(params?: {
  tokenContractId?: string; // custom NEP-141 contract
  decimals?: number;
  symbol?: string;
}): Promise<string> {
  const { provider } = await getNearClient();
  const deps = await getNearClient();
  const account = requireSignerAccount(deps);

  if (!params?.tokenContractId) {
    const amount = await account.getBalance(USDT);
    return USDT.toDecimal(amount);
  }

  const token = new FungibleToken(params.tokenContractId, {
    decimals: params.decimals ?? 24,
    symbol: params.symbol ?? "TKN",
  });

  const amount = await account.getBalance(token);
  return token.toDecimal(amount);
}

/**
 * Ensure an FT registration then transfer amount.
 */
export async function transferFt(params: {
  tokenContractId: string;
  decimals?: number;
  symbol?: string;
  receiverId: string;
  amount: string; // human-readable, e.g. "1.23"
}) {
  const deps = await getNearClient();
  const account = requireSignerAccount(deps);

  const token = new FungibleToken(params.tokenContractId, {
    decimals: params.decimals ?? 24,
    symbol: params.symbol ?? "TKN",
  });

  await token.registerAccount({
    accountIdToRegister: params.receiverId,
    fundingAccount: account,
  });

  return account.transfer({
    token,
    amount: token.toUnits(params.amount),
    receiverId: params.receiverId,
    waitUntil: "FINAL",
  });
}

/** ---------- Keys & account mgmt ---------- */

/**
 * List access keys of any account.
 */
export async function listAccessKeys(accountId: string) {
  const { provider } = await getNearClient();
  return provider.viewAccessKeyList(accountId);
}

/**
 * Add a full-access key to the signer’s account.
 */
export async function addFullAccessKey(publicKey: string) {
  const deps = await getNearClient();
  const account = requireSignerAccount(deps);

  return account.signAndSendTransaction({
    receiverId: account.accountId,
    actions: [actionCreators.addKey(publicKey, actionCreators.fullAccessKey())],
    waitUntil: "FINAL",
  });
}

/**
 * Add a function-call key to the signer’s account.
 */
export async function addFunctionCallKey(params: {
  publicKey: string;
  contractId: string;
  methodNames?: string[];
  allowanceNEAR?: string; // e.g. "0.25"
}) {
  const deps = await getNearClient();
  const account = requireSignerAccount(deps);

  return account.addFunctionCallAccessKey({
    publicKey: params.publicKey,
    contractId: params.contractId,
    methodNames: params.methodNames ?? [],
    allowance: params.allowanceNEAR ? wNEAR.toUnits(params.allowanceNEAR) : undefined,
  });
}

/**
 * Delete a key from the signer’s account.
 */
export async function deleteAccessKey(publicKey: string) {
  const deps = await getNearClient();
  const account = requireSignerAccount(deps);
  return account.deleteKey(publicKey);
}
