"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useWalletSelector } from "@near-wallet-selector/react-hook"
import { Button } from "@/components/ui/button"
import { ConnectWalletButton } from "@/components/campaign/ConnectWalletButton"
import SkeletonGrid from "@/components/bets/SkeletonGrid"
import type { Bet } from "@/types/types"
import { normalizeBet, PAGE_SIZE, STORAGE_CONTRACT_ID, parseTotal } from "@/lib/bets"

export default function ShowcaseBets() {
  const { signedAccountId, viewFunction } = useWalletSelector()
  const [bets, setBets] = useState<Bet[]>([])
  const [total, setTotal] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [loadingPage, setLoadingPage] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [supportsRange, setSupportsRange] = useState<boolean | null>(null)
  const nextIndexRef = useRef(0)

  const hasMore = useMemo(() => (total == null ? false : bets.length < total), [bets.length, total])

  // 1) Initialize: fetch total & detect range support
  useEffect(() => {
    let cancelled = false
    async function init() {
      if (!STORAGE_CONTRACT_ID) {
        setError("Storage contract id is not configured.")
        return
      }
      setLoading(true)
      setError(null)
      try {
        const totalRaw = await viewFunction({
          contractId: STORAGE_CONTRACT_ID,
          method: "total_bets",             // <-- method (not methodName)
        })
        if (cancelled) return
        const t = parseTotal(totalRaw)
        setTotal(t)

        // detect get_bets support
        try {
          const probe = await viewFunction({
            contractId: STORAGE_CONTRACT_ID,
            method: "get_bets",
            args: { from_index: 0, limit: Math.min(PAGE_SIZE, Math.max(1, t)) },
          })
          const probeIsArray = Array.isArray(probe)
          if (!cancelled) setSupportsRange(probeIsArray)
          if (!cancelled && probeIsArray) {
            const normalized = (probe as any[]).map((raw, i) => normalizeBet(raw, i + 1))
            setBets(normalized)
            nextIndexRef.current = normalized.length
          }
        } catch {
          if (!cancelled) setSupportsRange(false)
        }
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? "Failed to load bets")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    init()
    return () => {
      cancelled = true
    }
  }, [viewFunction])

  // 2) Load more (range first, fallback per-index)
  const loadMore = async () => {
    if (loadingPage || total == null) return
    setLoadingPage(true)
    setError(null)
    try {
      if (supportsRange) {
        const from_index = nextIndexRef.current
        if (from_index >= total) return
        const limit = Math.min(PAGE_SIZE, total - from_index)
        const chunk = await viewFunction({
          contractId: STORAGE_CONTRACT_ID,
          method: "get_bets",
          args: { from_index, limit },
        })
        const arr = Array.isArray(chunk) ? chunk : []
        const normalized = arr.map((raw, i) => normalizeBet(raw, from_index + i + 1))
        setBets((prev) => [...prev, ...normalized])
        nextIndexRef.current = from_index + normalized.length
      } else {
        // per-index fallback
        const start = bets.length
        if (start >= total) return
        const end = Math.min(start + PAGE_SIZE, total)
        const indices = Array.from({ length: end - start }, (_, i) => start + i)
        const chunk = await Promise.all(
          indices.map(async (idx) => {
            try {
              const b = await viewFunction({
                contractId: STORAGE_CONTRACT_ID,
                method: "get_bet",          // <-- method (not methodName)
                args: { index: idx },       // change to idx + 1 if your contract is 1-based
              })
              return b ?? null
            } catch {
              return null
            }
          })
        )
        const normalized = chunk.filter(Boolean).map((raw, i) => normalizeBet(raw as any, start + i + 1))
        setBets((prev) => [...prev, ...normalized])
      }
    } catch (e: any) {
      setError(e?.message ?? "Failed to load more bets")
    } finally {
      setLoadingPage(false)
    }
  }

  // auto-load first page if range unsupported & we didn’t get initial bets
  useEffect(() => {
    if (!loading && supportsRange === false && bets.length === 0 && total && total > 0) {
      loadMore()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, supportsRange, total])

  // requirement: show empty state if wallet not connected OR no bets
  const showEmpty = !loading && (bets.length === 0 || !signedAccountId)

  return (
    <div className="min-h-[100dvh] bg-charcoal text-off">
      <header className="sticky top-0 z-20 border-b border-white/10 backdrop-blur supports-[backdrop-filter]:bg-charcoal/70">
        <div className="container mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg md:text-2xl font-black tracking-tight">Showcase Bets</h1>
            <p className="text-sm text-white/60">
              Reading from <span className="font-mono">{STORAGE_CONTRACT_ID}</span>
              {total != null && <> — total: <span className="font-mono">{total}</span></>}
            </p>
          </div>
          <ConnectWalletButton />
        </div>
      </header>

      <main className="container mx-auto px-4 md:px-6 py-6 md:py-10 space-y-6">
        {error && (
          <div className="rounded-xl border border-red-400/30 bg-red-400/10 text-red-200 px-4 py-3">
            {error}
          </div>
        )}

        {showEmpty ? (
          <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.03] p-8 text-center">
            {!signedAccountId && (
              <p className="text-sm text-white/70">
                You’re not connected.{" "}
                <span className="text-white/60">Connect your NEAR wallet to continue.</span>
              </p>
            )}
            {bets.length === 0 && (
              <p className="mt-2 text-sm text-white/60">
                {loading ? "Loading…" : "No bets found — check back soon."}
              </p>
            )}
          </div>
        ) : (
          <>
            {loading && bets.length === 0 ? (
              <SkeletonGrid />
            ) : (
              <>
                <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                  {bets.map((bet) => {
                    const resolved = !!bet.resolution
                    return (
                      <li key={bet.currentid ?? bet.bet_id} className="group">
                        <article className="h-full rounded-2xl border border-white/10 bg-white/[0.04] p-4 md:p-5 transition-transform duration-200 group-hover:-translate-y-0.5">
                          <header className="flex items-center justify-between gap-3">
                            <div className="text-xs md:text-sm text-white/70 font-mono">
                              #{String(bet.bet_id ?? 0).padStart(4, "0")}
                            </div>
                            <span
                              className={`text-[11px] rounded-md px-2 py-1 border ${
                                (bet.betstatus || "").toLowerCase() === "created"
                                  ? "border-cyan-400/30 text-cyan-200/90"
                                  : resolved
                                  ? "border-emerald-400/30 text-emerald-300/90"
                                  : "border-white/15 text-white/60"
                              }`}
                            >
                              {bet.betstatus || (resolved ? "Resolved" : "Pending")}
                            </span>
                          </header>

                          {(bet.initiator || bet.opponent) && (
                            <div className="mt-1 text-xs text-white/60">
                              <span className="font-mono">{bet.initiator ?? "—"}</span>
                              <span className="mx-1.5">vs</span>
                              <span className="font-mono">{bet.opponent ?? "—"}</span>
                            </div>
                          )}

                          <div className="mt-3 space-y-2">
                            <div>
                              <div className="text-[11px] uppercase tracking-wide text-white/50">Terms</div>
                              <p className="text-sm md:text-base leading-relaxed break-words">{bet.terms}</p>
                            </div>

                            {(bet.resolution && bet.resolution.trim().length > 0) && (
                              <div className="pt-2 border-t border-white/10">
                                <div className="text-[11px] uppercase tracking-wide text-white/50">Resolution</div>
                                <p className="text-sm md:text-base leading-relaxed">{bet.resolution}</p>
                              </div>
                            )}

                            <div className="pt-2 border-t border-white/10">
                              <div className="text-[11px] uppercase tracking-wide text-white/50 mb-2">Details</div>
                              <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-white/70">
                                {bet.amount && (
                                  <>
                                    <dt className="text-white/50">Amount</dt>
                                    <dd>{bet.amount}{bet.currency ? ` ${bet.currency}` : ""}</dd>
                                  </>
                                )}
                                {bet.chain && (
                                  <>
                                    <dt className="text-white/50">Chain</dt>
                                    <dd className="uppercase">{bet.chain}</dd>
                                  </>
                                )}
                                {bet.currentid && (
                                  <>
                                    <dt className="text-white/50">Current ID</dt>
                                    <dd className="font-mono break-all">{bet.currentid}</dd>
                                  </>
                                )}
                                {bet.parentid && (
                                  <>
                                    <dt className="text-white/50">Parent ID</dt>
                                    <dd className="font-mono break-all">{bet.parentid}</dd>
                                  </>
                                )}
                                {bet.remarks && (
                                  <>
                                    <dt className="text-white/50">Remarks</dt>
                                    <dd className="break-words">{bet.remarks}</dd>
                                  </>
                                )}
                                {bet.currency && !bet.amount && (
                                  <>
                                    <dt className="text-white/50">Currency</dt>
                                    <dd>{bet.currency}</dd>
                                  </>
                                )}
                                {bet.betstatus && (
                                  <>
                                    <dt className="text-white/50">Status</dt>
                                    <dd>{bet.betstatus}</dd>
                                  </>
                                )}
                              </dl>
                            </div>
                          </div>
                        </article>
                      </li>
                    )
                  })}
                </ul>

                {hasMore && (
                  <div className="flex justify-center">
                    <Button
                      onClick={loadMore}
                      variant="ghost"
                      className="h-9 px-4 border border-white/15 hover:bg-white/10"
                      disabled={loadingPage}
                    >
                      {loadingPage ? "Loading…" : "Load more"}
                    </Button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </main>
    </div>
  )
}
