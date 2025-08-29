"use client";

import { providers, utils } from "near-api-js";
import { RPC_URL, TGAS, NO_DEPOSIT } from "./config";
import { getSelector } from "./selector";

const provider = new providers.JsonRpcProvider({ url: RPC_URL });

export async function viewFunction<T>({
  contractId, method, args = {}
}: { contractId: string; method: string; args?: object }): Promise<T> {
  const res = await provider.query({
    request_type: "call_function",
    account_id: contractId,
    method_name: method,
    args_base64: Buffer.from(JSON.stringify(args)).toString("base64"),
    finality: "optimistic",
  } as any);
  // @ts-ignore
  return JSON.parse(Buffer.from(res.result).toString());
}

export async function callFunction<T>({
  contractId, method, args = {}, gas = TGAS(100), deposit = NO_DEPOSIT
}: { contractId: string; method: string; args?: object; gas?: string; deposit?: string }): Promise<T> {
  const selector = await getSelector();
  const wallet = await selector.wallet();
  const outcome = await wallet.signAndSendTransaction({
    receiverId: contractId,
    actions: [{
      type: "FunctionCall",
      params: {
        methodName: method,
        args,
        gas,
        deposit: utils.format.parseNearAmount(deposit) ?? deposit, // accept raw yocto or NEAR string
      },
    }],
  });
  // Return last outcome's SuccessValue if present
  const success = outcome?.transaction_outcome;
  return success as unknown as T;
}
