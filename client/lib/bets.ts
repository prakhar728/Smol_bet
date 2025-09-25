import type { Bet } from "@/types/types"

export function normalizeBet(raw: any, fallbackId: number): Bet {
  return {
    bet_id: typeof raw?.bet_id === "number" ? raw.bet_id : fallbackId,
    terms: raw?.terms ?? "",
    initiator: raw?.initiator ?? null,
    opponent: raw?.opponent ?? null,
    amount: raw?.amount ?? null,
    currency: raw?.currency ?? null,
    chain: raw?.chain ?? null,
    betstatus: raw?.betstatus ?? null,
    currentid: raw?.currentid ?? null,
    parentid: raw?.parentid ?? null,
    remarks: raw?.remarks ?? null,
    resolution: raw?.resolution ?? null,
  }
}
