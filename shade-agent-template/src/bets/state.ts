import type { Bet, Post } from "./types";

export const pendingReply: (Post & { replyAttempt: number })[] = [];
export const pendingAddressRequest: Bet[] = [];
export const pendingAddressConfirmation: Bet[] = [];
export const pendingDeposits: Bet[] = [];
export const pendingSettlement: Bet[] = [];
export const pendingRefund: Bet[] = [];
export const completedBets: Bet[] = [];
export const acknowledgedPosts = new Set<string>();

export let lastSearchTimestamp =
  parseInt(process.env.LAST_SEARCH_TIMESTAMP ?? "", 10) ||
  Math.floor(Date.now() / 1000) - 100;

export let lastSettleBetSeachTimestamp =
  parseInt(process.env.LAST_SEARCH_TIMESTAMP ?? "", 10) ||
  Math.floor(Date.now() / 1000) - 100;

export const setLastSearchTimestamp = (v: number) => (lastSearchTimestamp = v);
export const setLastSettleTimestamp = (v: number) =>
  (lastSettleBetSeachTimestamp = v);
export const setLoopRunning = (v: boolean) => (isLoopRunning = v);

// NEW: loop running flag
export let isLoopRunning = false;

export function getStateSnapshot() {
  return {
    isLoopRunning,
    lastSearchTimestamp,
    lastSettleBetSeachTimestamp,
    pendingReply,
    pendingAddressRequest,
    pendingAddressConfirmation,
    pendingDeposits,
    pendingSettlement,
    pendingRefund,
    completedBets,
    acknowledgedPosts: [...acknowledgedPosts],
  };
}
