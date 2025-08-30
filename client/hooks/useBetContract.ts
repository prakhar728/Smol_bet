"use client";

import { CONTRACT_ID } from "@/lib/near/config";
import { callFunction, viewFunction } from "@/lib/near/rpc";

export type Bet = { bet_id: number; terms: string; resolution: string };

export function useBetContract(contractId = CONTRACT_ID) {
  return {
    createBet: (terms: string) =>
      callFunction<{ bet_id: number }>({ contractId, method: "create_bet", args: { terms } }),
    viewBet: (bet_id: number) =>
      viewFunction<Bet>({ contractId, method: "view_bet", args: { bet_id } }),
    getResolution: (bet_id: number) =>
      viewFunction<string>({ contractId, method: "get_resolution", args: { bet_id } }),
  };
}
