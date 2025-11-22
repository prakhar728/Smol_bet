"use client"

import * as React from "react"
import { motion, useReducedMotion } from "framer-motion"
import { ChevronLeft, ChevronRight, Bot, CheckCircle2, Clock, Play, Pause } from "lucide-react"
import { StepDialog } from "@/components/step-dialog"

// ---------- tiny “X-style” bits (compact) ----------
function Avatar({ label, accent }: { label: string; accent?: boolean }) {
    const initials = label.split(" ").map(s => s[0]?.toUpperCase()).join("").slice(0, 2)
    return (
        <div className={`grid place-items-center size-8 rounded-full text-[10px] font-bold
      ${accent ? "bg-[#C3F53B] text-black" : "bg-white/10 text-white/90]"}`}>
            {initials}
        </div>
    )
}

function NameRow({ name, handle, time = "now", bot }: {
    name: string; handle: string; time?: string; bot?: boolean
}) {
    return (
        <div className="flex items-center gap-2 text-[13px]">
            <span className="font-semibold text-off/95">{name}</span>
            {bot && (
                <span className="inline-flex items-center gap-1 rounded-md border border-white/12 bg-white/[0.06] px-1.5 py-0.5 text-[10px] tracking-wide text-white/80">
                    <Bot className="size-3" /> BOT
                </span>
            )}
            <span className="text-white/50">@{handle}</span>
            <span className="text-white/30">·</span>
            <span className="inline-flex items-center gap-1 text-white/50">
                <Clock className="size-3.5" /> {time}
            </span>
        </div>
    )
}

function XPost({
    name, handle, time, bot, children,
}: React.PropsWithChildren<{ name: string; handle: string; time?: string; bot?: boolean }>) {
    return (
        <div className="flex items-start gap-3">
            <Avatar label={name} accent={bot} />
            <div className="min-w-0 flex-1">
                <NameRow name={name} handle={handle} time={time} bot={bot} />
                <div className="mt-1 whitespace-pre-wrap text-[15px] leading-6 text-off/95">{children}</div>
            </div>
        </div>
    )
}

function Thread({ children, tag }: React.PropsWithChildren<{ tag: string }>) {
    return (
        <div className="relative rounded-2xl border border-white/12 bg-white/[0.02] p-4 md:p-6">
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-2xl opacity-80"
                style={{
                    backgroundImage: [
                        "radial-gradient(900px 220px at 18% -12%, rgba(195,245,59,0.06), rgba(0,0,0,0))",
                        "radial-gradient(#222 1px, transparent 1px)",
                    ].join(", "),
                    backgroundSize: "auto, 22px 22px",
                }}
            />
            <div className="relative z-10">
                <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-off/95 text-lg md:text-xl font-semibold tracking-tight">How it works</h3>
                    <span className="text-[11px] leading-4 tracking-[0.14em] uppercase text-[#C3F53B]">{tag}</span>
                </div>
                <div className="space-y-5">{children}</div>
            </div>
        </div>
    )
}

// ---------- scenes ----------
function SceneCreate() {
    return (
        <Thread tag="Create">
            <XPost name="Prakhar Ojha" handle="PrakharOjha4" time="2m">
                <span className="text-[#C3F53B]">@smol_bet</span> I bet <span className="text-[#C3F53B]">@_fiatisabubble</span> that <b>BTC closes above $64k this Friday 23:59 UTC</b>.
                {"\n"}Stake: <b>0.02 ETH each on Aurora </b>. Source: Coinbase daily close.
            </XPost>
        </Thread>
    )
}
function SceneLock() {
    return (
        <Thread tag="Lock">
            <XPost name="Prakhar Ojha" handle="PrakharOjha4" time="2m">
                <span className="text-[#C3F53B]">@smol_bet</span> I bet <span className="text-[#C3F53B]">@_fiatisabubble</span> that <b>BTC closes above $64k this Friday 23:59 UTC</b>.
                {"\n"}Stake: <b>0.02 ETH each on Aurora</b>. Source: Coinbase daily close.
            </XPost>
            <div className="pl-11">
                <XPost name="Smol Bet" handle="smol_bet" bot time="1m">
                    <span className="inline-flex items-center gap-2 text-[#C3F53B] font-semibold">
                        <CheckCircle2 className="size-4" /> Bet detected
                    </span>
                    {"\n"}
                    @PrakharOjha4 deposit 0.02 ETH to{" "}
                    <span className="font-mono text-[14px] bg-white/[0.06] px-2 py-1 rounded-md border border-white/12">
                        0xbee5d74ce865f5d56b046cac522fc0250bebe2f3
                    </span>
                    {"\n"}
                    and
                    {" "}
                    @_fiatisabubble deposit 0.02 ETH to{" "}
                    <span className="font-mono text-[14px] bg-white/[0.06] px-2 py-1 rounded-md border border-white/12">
                        0x62d6294e7db0b9c88494ab3859d5d2fa0d61a678
                    </span>
                    {" "} on Aurora network!
                </XPost>
            </div>
        </Thread>
    )
}
function SceneResolve() {
    return (
        <Thread tag="Resolve">
            <XPost name="Prakhar Ojha" handle="PrakharOjha4" time="now">
                Settle
            </XPost>
            <div className="pl-11">
                <XPost name="Smol Bet" handle="smol_bet" bot time="now">
                    Settling… delegating to <b>NearAI Agent</b>.
                </XPost>
            </div>
        </Thread>
    )
}
function ScenePayout() {
    return (
        <Thread tag="Payout">
            <XPost name="Smol Bet" handle="smol_bet" bot time="1m">
                <div className="inline-flex items-center gap-2 text-[#C3F53B] font-semibold">
                    <CheckCircle2 className="size-4" /> Resolved
                </div>
                {"\n"}
                NearAI confirms BTC <b>closed below $64k</b>. Winner: <b className="text-[#C3F53B]">@_fiatisabubble</b>.
                Payout: <b>0.0396 ETH</b> (1% fee).
            </XPost>
        </Thread>
    )
}

const SCENES = [
    { key: "create", label: "Create", el: <SceneCreate /> },
    { key: "lock", label: "Lock", el: <SceneLock /> },
    { key: "resolve", label: "Resolve", el: <SceneResolve /> },
    { key: "payout", label: "Payout", el: <ScenePayout /> },
] as const

// ---------- inline player with AUTOPLAY ----------
export function HowItWorksInline({
    interval = 4200,
    autoplay = true,
    pauseOnHover = true,
}: {
    interval?: number
    autoplay?: boolean
    pauseOnHover?: boolean
}) {
    const reduce = useReducedMotion()
    const [i, setI] = React.useState(0)
    const [playing, setPlaying] = React.useState(autoplay && !reduce)

    const go = React.useCallback((n: number) => {
        setI((p) => (p + n + SCENES.length) % SCENES.length)
    }, [])
    const to = React.useCallback((n: number) => {
        setI(((n % SCENES.length) + SCENES.length) % SCENES.length)
    }, [])

    // viewport awareness
    const rootRef = React.useRef<HTMLDivElement>(null)
    const [inView, setInView] = React.useState(true)
    React.useEffect(() => {
        const el = rootRef.current
        if (!el || typeof IntersectionObserver === "undefined") return
        const obs = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.6 })
        obs.observe(el)
        return () => obs.disconnect()
    }, [])

    React.useEffect(() => {
        if (reduce) setPlaying(false)
    }, [reduce])

    const hoverRef = React.useRef(false)

    // autoplay loop
    React.useEffect(() => {
        if (!playing || !inView) return
        const id = setInterval(() => {
            if (document.visibilityState !== "visible") return
            if (pauseOnHover && hoverRef.current) return
            go(1)
        }, interval)
        return () => clearInterval(id)
    }, [playing, inView, pauseOnHover, interval, go])

    // keyboard + simple swipe
    const startX = React.useRef<number | null>(null)
    const onPointerDown = (e: React.PointerEvent) => { startX.current = e.clientX }
    const onPointerUp = (e: React.PointerEvent) => {
        if (startX.current == null) return
        const dx = e.clientX - startX.current
        startX.current = null
        const TH = 60
        if (dx > TH) go(-1)
        else if (dx < -TH) go(1)
    }
    const onKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "ArrowLeft") { e.preventDefault(); go(-1) }
        else if (e.key === "ArrowRight") { e.preventDefault(); go(1) }
        else if (e.key === " ") { e.preventDefault(); setPlaying(p => !p) }
    }

    const currentKey = SCENES[i].key as "create" | "lock" | "resolve" | "payout"

    return (
        <div
            ref={rootRef}
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            onMouseEnter={() => { if (pauseOnHover) hoverRef.current = true }}
            onMouseLeave={() => { if (pauseOnHover) hoverRef.current = false }}
            onKeyDown={onKeyDown}
            role="region"
            aria-roledescription="carousel"
            aria-label="How it works"
            tabIndex={0}
            className="mx-auto w-full max-w-[880px] space-y-4 outline-none"
        >
            {/* segmented control + controls */}
            <div className="flex flex-wrap items-center gap-2 rounded-xl border border-white/12 bg-white/[0.03] p-1">
                {SCENES.map((s, idx) => (
                    <button
                        key={s.key}
                        onClick={() => to(idx)}
                        className={`rounded-lg px-2.5 md:px-3.5 py-2 text-xs md:text-sm uppercase tracking-wide transition min-h-[36px] md:min-h-[40px]
              ${idx === i ? "bg-[#C3F53B] text-black" : "text-white/80 hover:text-white"}`}
                        aria-current={idx === i}
                    >
                        {s.label}
                    </button>
                ))}
                <div className="ml-auto flex items-center gap-1.5 md:gap-2">
                    <button
                        onClick={() => setPlaying((p) => !p)}
                        aria-label={playing ? "Pause autoplay" : "Play autoplay"}
                        className="grid place-items-center h-8 md:h-9 px-2 md:px-3 rounded-lg border border-white/12 bg-white/[0.02] hover:bg-white/[0.06] min-h-[36px] md:min-h-[40px]"
                    >
                        {playing ? (
                            <span className="inline-flex items-center gap-1 text-off/90 text-xs md:text-sm">
                                <Pause className="size-3.5 md:size-4 text-[#C3F53B]" /> <span className="hidden sm:inline">Pause</span>
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1 text-off/90 text-xs md:text-sm">
                                <Play className="size-3.5 md:size-4 text-[#C3F53B]" /> <span className="hidden sm:inline">Play</span>
                            </span>
                        )}
                    </button>
                    <button onClick={() => go(-1)} aria-label="Previous" className="grid place-items-center size-8 md:size-9 rounded-lg border border-white/12 bg-white/[0.02] hover:bg-white/[0.06] min-h-[36px] md:min-h-[40px]">
                        <ChevronLeft className="size-3.5 md:size-4 text-[#C3F53B]" />
                    </button>
                    <button onClick={() => go(1)} aria-label="Next" className="grid place-items-center size-8 md:size-9 rounded-lg border border-white/12 bg-white/[0.02] hover:bg-white/[0.06] min-h-[36px] md:min-h-[40px]">
                        <ChevronRight className="size-3.5 md:size-4 text-[#C3F53B]" />
                    </button>
                </div>
            </div>

            {/* scene */}
            <motion.div
                key={i}
                initial={reduce ? { opacity: 1 } : { opacity: 0, y: 12, scale: 0.995 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: reduce ? 0 : 0.25 }}
            >
                {SCENES[i].el}
            </motion.div>

            {/* progress */}
            <div className="mx-auto h-1 w-full overflow-hidden rounded-full bg-white/10">
                <motion.div
                    key={`bar-${i}-${playing}-${reduce}`}
                    initial={{ width: 0 }}
                    animate={{ width: playing && !reduce ? "100%" : 0 }}
                    transition={{ duration: playing && !reduce ? interval / 1000 : 0, ease: "linear" }}
                    className="h-full bg-[#C3F53B]"
                    aria-hidden
                />
            </div>
        </div>
    )
}
