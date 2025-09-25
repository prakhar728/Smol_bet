import type { Bet } from "@/types/types"

export const STORAGE_CONTRACT_ID =
  process.env.NEXT_PUBLIC_STORAGE_CONTRACT || "storage-contract-7.testnet"

export const PAGE_SIZE = 30

// Normalize raw contract data into our Bet shape
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

// Some contracts return numbers as strings — make it robust
export function parseTotal(raw: unknown): number {
  if (typeof raw === "number") return raw
  if (typeof raw === "string") {
    const n = Number(raw)
    return Number.isFinite(n) ? n : 0
  }
  return 0
}
