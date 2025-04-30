import Link from "next/link"
import { ArrowRight, CheckCircle, MessageSquare, Shield } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0 mx-auto">
          <div className="flex gap-6 md:gap-10">
            <Link href="/" className="flex items-center space-x-2">
              <Shield className="h-6 w-6" />
              <span className="inline-block font-bold">Smol Bets</span>
            </Link>
            <nav className="hidden gap-6 md:flex">
              <Link
                href="#how-it-works"
                className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                How It Works
              </Link>
              <Link
                href="#examples"
                className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Examples
              </Link>
              <Link
                href="#faq"
                className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                FAQ
              </Link>
            </nav>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="flex items-center space-x-2">
              <Link href="/bets">
                <Button variant="outline" size="sm">
                  View Bets
                </Button>
              </Link>
              <Link href="/bets">
                <Button size="sm">Launch App</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
          <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center mx-auto">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                Bet on Anything. With Anyone. On-Chain.
              </h1>
              <p className="mx-auto max-w-[42rem] text-muted-foreground sm:text-xl">
                Create and settle bets directly from comments. No middlemen, just pure "bet-ter" fun.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/bets">
                <Button className="h-11 px-8">Launch App</Button>
              </Link>
              <Link href="#how-it-works">
                <Button variant="outline" className="h-11 px-8">
                  How It Works
                </Button>
              </Link>
            </div>
            <div className="flex items-center justify-center space-x-4 py-4">
              <div className="rounded-full bg-muted px-4 py-1.5 text-xs font-medium">
                Powered by Shade Protocol Agents
              </div>
              <div className="rounded-full bg-muted px-4 py-1.5 text-xs font-medium">Omni-chain with NEAR Protocol</div>
            </div>
          </div>
        </section>

        <section
          id="how-it-works"
          className="container space-y-6 bg-slate-50 py-8 dark:bg-transparent md:py-12 lg:py-24 mx-auto"
        >
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-5xl">How It Works</h2>
            <p className="max-w-[85%] text-muted-foreground sm:text-lg">
              Create, accept, and settle bets in just a few simple steps.
            </p>
          </div>
          <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
            <div className="relative overflow-hidden rounded-lg border bg-background p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <MessageSquare className="h-6 w-6" />
              </div>
              <div className="mt-3 space-y-2">
                <h3 className="font-bold">1. Create a Bet</h3>
                <p className="text-sm text-muted-foreground">
                  Comment with your bet terms and stake amount. Our protocol automatically detects and formats your bet.
                  It's a "bet-ter" way to wager!
                </p>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-lg border bg-background p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <ArrowRight className="h-6 w-6" />
              </div>
              <div className="mt-3 space-y-2">
                <h3 className="font-bold">2. Accept the Bet</h3>
                <p className="text-sm text-muted-foreground">
                  Another user accepts your bet by replying and staking their ETH. The bet is now locked on-chain.
                  You're "all-in" now!
                </p>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-lg border bg-background p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <CheckCircle className="h-6 w-6" />
              </div>
              <div className="mt-3 space-y-2">
                <h3 className="font-bold">3. Settle the Bet</h3>
                <p className="text-sm text-muted-foreground">
                  When the outcome is clear, either party can initiate settlement. Both parties confirm to release
                  funds. Winner takes "all-in"!
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="examples" className="container space-y-6 py-8 md:py-12 lg:py-24 mx-auto">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-5xl">Example Bet</h2>
            <p className="max-w-[85%] text-muted-foreground sm:text-lg">
              See how easy it is to create and manage bets on our platform.
            </p>
          </div>
          <div className="mx-auto max-w-3xl rounded-xl border bg-background p-6 shadow-md">
            <div className="flex items-start space-x-4">
              <div className="h-10 w-10 rounded-full bg-slate-200"></div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center">
                  <h4 className="font-semibold">@alice</h4>
                  <span className="ml-2 text-xs text-muted-foreground">2 hours ago</span>
                </div>
                <div className="rounded-lg border bg-muted p-4">
                  <p className="font-medium">I bet 0.5 ETH that Bitcoin will hit $100k before the end of 2024.</p>
                  <div className="mt-2 flex items-center text-sm text-muted-foreground">
                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-100">
                      Bet Created
                    </span>
                    <span className="ml-2">0.5 ETH staked</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-start space-x-4 pl-14">
              <div className="h-10 w-10 rounded-full bg-slate-200"></div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center">
                  <h4 className="font-semibold">@bob</h4>
                  <span className="ml-2 text-xs text-muted-foreground">1 hour ago</span>
                </div>
                <div className="rounded-lg border bg-muted p-4">
                  <p className="font-medium">I'll take that bet!</p>
                  <div className="mt-2 flex items-center text-sm text-muted-foreground">
                    <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                      Bet Accepted
                    </span>
                    <span className="ml-2">0.5 ETH staked</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 rounded-lg border bg-slate-50 p-4 dark:bg-slate-900">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Bet Status: Active</h4>
                  <p className="text-sm text-muted-foreground">Total Staked: 1.0 ETH</p>
                </div>
                <Link href="/bets/123">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section id="faq" className="container space-y-6 bg-slate-50 py-8 dark:bg-transparent md:py-12 lg:py-24 mx-auto">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-5xl">Frequently Asked Questions</h2>
          </div>
          <div className="mx-auto grid max-w-3xl gap-6">
            <div className="rounded-lg border bg-background p-6 shadow-sm">
              <h3 className="font-bold">How are disputes resolved?</h3>
              <p className="mt-2 text-muted-foreground">
                Our platform uses a combination of oracle data and community consensus to resolve disputes. If both
                parties disagree, a decentralized arbitration process begins.
              </p>
            </div>
            <div className="rounded-lg border bg-background p-6 shadow-sm">
              <h3 className="font-bold">What cryptocurrencies can I use?</h3>
              <p className="mt-2 text-muted-foreground">
                Currently, we support ETH and NEAR tokens. More cryptocurrencies will be added in future updates.
              </p>
            </div>
            <div className="rounded-lg border bg-background p-6 shadow-sm">
              <h3 className="font-bold">Are there any fees?</h3>
              <p className="mt-2 text-muted-foreground">
                We charge a small 1% fee on successful bet settlements to maintain the platform. Network gas fees also
                apply.
              </p>
            </div>
            <div className="rounded-lg border bg-background p-6 shadow-sm">
              <h3 className="font-bold">Is my money safe?</h3>
              <p className="mt-2 text-muted-foreground">
                All funds are held in smart contracts, not by us. Our contracts have been audited by leading security
                firms.
              </p>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row mx-auto">
          <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
            <Shield className="h-6 w-6" />
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
              &copy; {new Date().getFullYear()} Smol Bets. All rights reserved. Making "smol" bets with big impacts.
            </p>
          </div>
          <div className="flex gap-4">
            <Link
              href="#"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Twitter
            </Link>
            <Link
              href="#"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Discord
            </Link>
            <Link
              href="#"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              GitHub
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
