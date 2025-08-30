"use client";
import { useCallback, useEffect, useState } from "react";
import { useWalletSelector } from "@near-wallet-selector/react-hook";

export type Bet = { bet_id: number; terms: string; resolution: string };

export function useBets(contractId: string, pageSize = 20) {
  const { viewFunction } = useWalletSelector();
  const [bets, setBets] = useState<Bet[]>([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchPage = useCallback(async (from: number) => {
    setLoading(true);
    try {
      const page: Bet[] = await viewFunction({
        contractId,
        method: "get_bets",
        // U64 in JSON => strings
        args: { from_index: String(from), limit: String(pageSize) },
      });
      setHasMore(page.length === pageSize);
      if (from === 0) setBets(page);
      else setBets(prev => [...prev, ...page]);
      setOffset(from + page.length);
    } finally { setLoading(false); }
  }, [contractId, pageSize, viewFunction]);

  useEffect(() => { fetchPage(0); }, [fetchPage]);

  return {
    bets, loading, hasMore,
    refresh: () => fetchPage(0),
    loadMore: () => (!loading && hasMore ? fetchPage(offset) : Promise.resolve()),
  };
}
