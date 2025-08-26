import { wNEAR, USDT } from "@near-js/tokens/testnet"; // swap to /mainnet in prod
import { getNearClient, requireSignerAccount } from "./client";
import { TxExecutionStatus } from "./types";

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
  waitUntil?: TxExecutionStatus;
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






