"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useWalletSelector } from "@near-wallet-selector/react-hook"
import { ConnectWalletButton } from "@/components/campaign/ConnectWalletButton"
import { useBets } from "@/hooks/useBets"
import { CONTRACT_ID } from "@/lib/near/config"

type Bet = { bet_id: number; terms: string; resolution: string }


export default function AICampaignPage() {
  const { signedAccountId, viewFunction, callFunction } = useWalletSelector();
  const { bets, loading, hasMore, loadMore } = useBets(CONTRACT_ID);
  const [terms, setTerms] = useState("")
  const [nextId, setNextId] = useState(1)
  const [resolvingId, setResolvingId] = useState<number | null>(null)

  const maxChars = 280
  const remaining = maxChars - terms.length
  const overLimit = remaining < 0
  const canPost = !!signedAccountId && terms.trim().length > 0 && !overLimit

  const postTerm = async () => {
    if (!canPost) return
    // When your contract is ready, uncomment this:
    const res = await callFunction({
      contractId: CONTRACT_ID,
      method: "add_bet",
      args: { terms: terms.trim() },
    });

    console.log(res);

    setNextId((n) => n + 1)
    setTerms("")
  }

  const requestResolve = async (bet_id: number) => {
    setResolvingId(bet_id)
    console.log(bet_id);
    
    const res = await callFunction({
      contractId: CONTRACT_ID,
      method: "request_resolve",
      args: { index: (bet_id - 1) },
    });

    setResolvingId(null)
  }

  return (
    <div className="min-h-[100dvh] bg-charcoal text-off flex flex-col">
      <header className="sticky top-0 z-20 border-b border-white/10 backdrop-blur supports-[backdrop-filter]:bg-charcoal/70">
        <div className="container mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <h1 className="text-lg md:text-2xl font-black tracking-tight">AI Test Campaign</h1>
          <ConnectWalletButton />
        </div>
      </header>

      <main className="container mx-auto px-4 md:px-6 py-6 md:py-10 flex-1 space-y-8">
        <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 md:p-6 shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
          <div className="flex items-start gap-4">
            <div className="w-full">
              <label htmlFor="bet-terms" className="sr-only">Bet terms</label>
              <textarea
                id="bet-terms"
                value={terms}
                onChange={(e) => setTerms(e.target.value)}
                placeholder="Enter bet terms in natural language…"
                className="w-full min-h-[120px] md:min-h-[140px] resize-vertical rounded-xl bg-black/30 border border-white/15 p-3 md:p-4 text-sm md:text-base outline-none focus:ring-2 focus:ring-[#C3F53B] focus:border-transparent transition"
                maxLength={maxChars + 50}
              />
              <div className="mt-2 flex items-center justify-between text-xs">
                <span className="text-white/60">Describe who/what/when…</span>
                <span className={overLimit ? "text-red-400" : "text-white/60"}>
                  {remaining < 0 ? `+${Math.abs(remaining)}` : remaining}/{maxChars}
                </span>
              </div>
            </div>

            <Button
              onClick={postTerm}
              disabled={!canPost}
              className="shrink-0 bg-[#C3F53B] text-black hover:bg-[#C3F53B]/90 disabled:opacity-50 rounded-xl h-[44px] md:h-[48px] px-4 md:px-5 transition"
              title={!signedAccountId ? "Connect wallet to post" : overLimit ? "Too many characters" : "Post this term"}
            >
              Post this term
            </Button>
          </div>
          {!signedAccountId && <p className="mt-3 text-xs text-white/60">Connect your NEAR wallet to submit.</p>}
        </section>

        {/* Bets */}
        <section className="space-y-4" aria-labelledby="bets-heading">
          <div className="flex items-center justify-between">
            <h2 id="bets-heading" className="text-base md:text-lg font-semibold">
              Submitted Bets <span className="text-white/40 font-normal">({bets.length})</span>
            </h2>

            {typeof hasMore !== "undefined" && hasMore && (
              <Button
                onClick={loadMore}
                variant="ghost"
                className="h-8 px-3 border border-white/15 hover:bg-white/10"
                disabled={loading}
              >
                {loading ? "Loading…" : "Load more"}
              </Button>
            )}
          </div>

          {/* Empty state */}
          {!loading && bets.length === 0 && (
            <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.03] p-8 text-center">
              <p className="text-sm text-white/60">No bets yet — add your first above.</p>
            </div>
          )}

          {/* Initial skeletons */}
          {loading && bets.length === 0 && (
            <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <li key={i} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                  <div className="animate-pulse space-y-3">
                    <div className="h-4 w-24 bg-white/10 rounded" />
                    <div className="h-4 w-3/4 bg-white/10 rounded" />
                    <div className="h-4 w-2/3 bg-white/10 rounded" />
                  </div>
                </li>
              ))}
            </ul>
          )}

          {/* Bets grid */}
          {bets.length > 0 && (
            <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
              {bets.map((bet) => {
                const resolved = !!bet.resolution;
                return (
                  <li key={bet.bet_id} className="group">
                    <article className="h-full rounded-2xl border border-white/10 bg-white/[0.04] p-4 md:p-5 transition-transform duration-200 group-hover:-translate-y-0.5">
                      <header className="flex items-center justify-between gap-3">
                        <div className="text-xs md:text-sm text-white/70 font-mono">
                          #{bet.bet_id.toString().padStart(4, "0")}
                        </div>
                        <span className={`text-[11px] rounded-md px-2 py-1 border ${resolved
                            ? "border-emerald-400/30 text-emerald-300/90"
                            : "border-white/15 text-white/60"
                          }`}>
                          {resolved ? "Resolved" : "Pending"}
                        </span>
                      </header>

                      <div className="mt-3 space-y-2">
                        <div>
                          <div className="text-[11px] uppercase tracking-wide text-white/50">Terms</div>
                          <p className="text-sm md:text-base leading-relaxed">{bet.terms}</p>
                        </div>
                        <div className="pt-2 border-t border-white/10">
                          <div className="text-[11px] uppercase tracking-wide text-white/50">Resolution</div>
                          <p className="text-sm md:text-base leading-relaxed">
                            {bet.resolution || <span className="text-white/50">— not resolved yet —</span>}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 flex justify-end">
                        <Button
                          variant="ghost"
                          className="border border-white/15 hover:bg-white/10 rounded-lg h-8 px-3"
                          onClick={() => requestResolve(bet.bet_id)}
                          disabled={resolvingId === bet.bet_id || resolved}
                          title={resolved ? "Already resolved" : "Request AI resolution"}
                        >
                          {resolvingId === bet.bet_id ? "Resolving…" : resolved ? "Resolved" : "Request Resolve"}
                        </Button>
                      </div>
                    </article>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

      </main>
    </div>
  )
}
