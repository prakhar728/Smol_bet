"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useWalletSelector } from "@near-wallet-selector/react-hook"
import { Button } from "@/components/ui/button"
import { ConnectWalletButton } from "@/components/campaign/ConnectWalletButton"

type Bet = {
    bet_id: number
    terms: string
    resolution?: string | null
    creator?: string | null
}

const STORAGE_CONTRACT_ID = process.env.NEXT_PUBLIC_STORAGE_CONTRACT || "";
const PAGE_SIZE = 30

export default function ShowcaseBets() {
    const { viewFunction } = useWalletSelector()
    const [bets, setBets] = useState<Bet[]>([])
    const [total, setTotal] = useState<number | null>(null)
    const [loading, setLoading] = useState(false)
    const [loadingPage, setLoadingPage] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [supportsRange, setSupportsRange] = useState<boolean | null>(null)
    const nextIndexRef = useRef(0) // where to continue from in range mode

    const hasMore = useMemo(() => {
        if (total == null) return false
        return bets.length < total
    }, [bets.length, total])

    // 1) Initialize: fetch total & detect range support
    useEffect(() => {
        let cancelled = false
        async function init() {
            setLoading(true)
            setError(null)
            try {
                const t = await viewFunction({
                    contractId: STORAGE_CONTRACT_ID,
                    method: "total_bets",
                })
                if (cancelled) return
                setTotal(t)

                // detect get_bets support on first call
                try {
                    const probe = await viewFunction({
                        contractId: STORAGE_CONTRACT_ID,
                        method: "get_bets",
                        args: { from_index: 0, limit: Math.min(PAGE_SIZE, Math.max(1, t)) },
                    })
                    if (!cancelled) setSupportsRange(Array.isArray(probe))
                    if (!cancelled && Array.isArray(probe)) {
                        setBets(normalizeBets(probe, 0))
                        nextIndexRef.current = probe.length
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
                const normalized = normalizeBets(chunk || [], from_index)
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
                            // NOTE: many contracts treat index as 0-based
                            const b = await viewFunction({
                                contractId: STORAGE_CONTRACT_ID,
                                method: "get_bet",
                                args: { index: idx }, // adjust to idx-1 if your contract is 1-based
                            })
                            return b ?? null
                        } catch {
                            return null
                        }
                    })
                )
                const normalized = normalizeBets(chunk.filter(Boolean) as Bet[], start)
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

    return (
        <div className="min-h-[100dvh] bg-charcoal text-off">
            <header className="sticky top-0 z-20 border-b border-white/10 backdrop-blur supports-[backdrop-filter]:bg-charcoal/70">
                <div className="container mx-auto px-4 md:px-6 py-4">
                    <h1 className="text-lg md:text-2xl font-black tracking-tight">Showcase Bets</h1>
                    <p className="text-sm text-white/60">
                        Reading from <span className="font-mono">{STORAGE_CONTRACT_ID}</span>
                        {total != null && <> — total: <span className="font-mono">{total}</span></>}
                    </p>

                    <ConnectWalletButton />
                </div>
            </header>

            <main className="container mx-auto px-4 md:px-6 py-6 md:py-10 space-y-6">
                {error && (
                    <div className="rounded-xl border border-red-400/30 bg-red-400/10 text-red-200 px-4 py-3">
                        {error}
                    </div>
                )}

                {/* Empty / Loading state */}
                {loading && bets.length === 0 ? (
                    <SkeletonGrid />
                ) : bets.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.03] p-8 text-center">
                        <p className="text-sm text-white/60">No bets yet.</p>
                    </div>
                ) : (
                    <>
                        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                            {bets.map((bet) => {
                                const resolved = !!bet.resolution
                                return (
                                    <li key={bet.bet_id} className="group">
                                        <article className="h-full rounded-2xl border border-white/10 bg-white/[0.04] p-4 md:p-5 transition-transform duration-200 group-hover:-translate-y-0.5">
                                            <header className="flex items-center justify-between gap-3">
                                                <div className="text-xs md:text-sm text-white/70 font-mono">
                                                    #{String(bet.bet_id ?? 0).padStart(4, "0")}
                                                </div>
                                                <span
                                                    className={`text-[11px] rounded-md px-2 py-1 border ${resolved
                                                            ? "border-emerald-400/30 text-emerald-300/90"
                                                            : "border-white/15 text-white/60"
                                                        }`}
                                                >
                                                    {resolved ? "Resolved" : "Pending"}
                                                </span>
                                            </header>

                                            {bet.creator && (
                                                <div className="mt-1 text-xs text-white/50">
                                                    by <span className="font-mono">{bet.creator}</span>
                                                </div>
                                            )}

                                            <div className="mt-3 space-y-2">
                                                <div>
                                                    <div className="text-[11px] uppercase tracking-wide text-white/50">
                                                        Terms
                                                    </div>
                                                    <p className="text-sm md:text-base leading-relaxed">{bet.terms}</p>
                                                </div>
                                                <div className="pt-2 border-t border-white/10">
                                                    <div className="text-[11px] uppercase tracking-wide text-white/50">
                                                        Resolution
                                                    </div>
                                                    <p className="text-sm md:text-base leading-relaxed">
                                                        {bet.resolution || <span className="text-white/50">— not resolved yet —</span>}
                                                    </p>
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
            </main>
        </div>
    )
}

/** Helpers */
function normalizeBets(chunk: Bet[], baseIndex: number): Bet[] {
    return (chunk || []).map((b, i) => ({
        bet_id: typeof b?.bet_id === "number" ? b.bet_id : baseIndex + i + 1, // fallback numbering
        terms: b?.terms ?? "",
        resolution: (b as any)?.resolution ?? null,
        creator: (b as any)?.creator ?? null,
    }))
}

function SkeletonGrid() {
    return (
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
                <li key={i} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 md:p-5 animate-pulse">
                    <div className="flex justify-between items-center">
                        <div className="h-4 w-16 bg-white/10 rounded" />
                        <div className="h-5 w-16 bg-white/10 rounded" />
                    </div>
                    <div className="mt-3 h-4 w-24 bg-white/10 rounded" />
                    <div className="mt-3 space-y-2">
                        <div className="h-4 w-full bg-white/10 rounded" />
                        <div className="h-4 w-5/6 bg-white/10 rounded" />
                    </div>
                    <div className="mt-3 pt-2 border-t border-white/10 space-y-2">
                        <div className="h-4 w-2/3 bg-white/10 rounded" />
                        <div className="h-4 w-1/2 bg-white/10 rounded" />
                    </div>
                </li>
            ))}
        </ul>
    )
}
