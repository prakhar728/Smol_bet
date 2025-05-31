import Link from "next/link";
import { ArrowRight, CheckCircle, MessageSquare } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/navbar";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 text-zinc-50">
      <Navbar />

      <main className="flex-1">
        <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
          <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center mx-auto">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl bg-gradient-to-r from-purple-400 to-indigo-400 text-transparent bg-clip-text">
                Bet on Anything. With Anyone. On-Chain.
              </h1>
              <p className="mx-auto max-w-[42rem] text-zinc-400 sm:text-xl">
                Create and settle bets directly from comments. No middlemen,
                just pure "bet-ter" fun.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/bets">
                <Button className="h-11 px-8 bg-purple-600 hover:bg-purple-700">
                  Launch App
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button
                  variant="outline"
                  className="h-11 px-8 border-zinc-700 text-zinc-800 hover:bg-zinc-800 hover:text-zinc-50"
                >
                  How It Works
                </Button>
              </Link>
            </div>
            <div className="flex items-center justify-center space-x-4 py-4">
              <div className="rounded-full bg-zinc-900 px-4 py-1.5 text-xs font-medium text-purple-400 border border-zinc-800">
                Powered by Shade Protocol Agents
              </div>
              <div className="rounded-full bg-zinc-900 px-4 py-1.5 text-xs font-medium text-purple-400 border border-zinc-800">
                Omni-chain with NEAR Protocol
              </div>
            </div>
          </div>
        </section>

        <section
          id="how-it-works"
          className="container space-y-6 bg-zinc-900 py-8 md:py-12 lg:py-24 mx-auto rounded-xl"
        >
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-5xl bg-gradient-to-r from-purple-400 to-indigo-400 text-transparent bg-clip-text">
              How It Works
            </h2>
            <p className="max-w-[85%] text-zinc-400 sm:text-lg">
              Create, accept, and settle bets in just a few simple steps.
            </p>
          </div>
          <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
            <div className="relative overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950 p-6 shadow-sm transition-shadow hover:shadow-md hover:shadow-purple-900/20">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-900/30 text-purple-400">
                <MessageSquare className="h-6 w-6" />
              </div>
              <div className="mt-3 space-y-2">
                <h3 className="font-bold text-zinc-50">1. Create a Bet</h3>
                <p className="text-sm text-zinc-400">
                  Comment with your bet terms and stake amount. Our protocol
                  automatically detects and formats your bet. It's a "bet-ter"
                  way to wager!
                </p>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950 p-6 shadow-sm transition-shadow hover:shadow-md hover:shadow-purple-900/20">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-900/30 text-purple-400">
                <ArrowRight className="h-6 w-6" />
              </div>
              <div className="mt-3 space-y-2">
                <h3 className="font-bold text-zinc-50">2. Accept the Bet</h3>
                <p className="text-sm text-zinc-400">
                  Another user accepts your bet by replying and staking their
                  ETH. The bet is now locked on-chain. You're "all-in" now!
                </p>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950 p-6 shadow-sm transition-shadow hover:shadow-md hover:shadow-purple-900/20">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-900/30 text-purple-400">
                <CheckCircle className="h-6 w-6" />
              </div>
              <div className="mt-3 space-y-2">
                <h3 className="font-bold text-zinc-50">3. Settle the Bet</h3>
                <p className="text-sm text-zinc-400">
                  When the outcome is clear, either party can initiate
                  settlement. The Near Shade Agent resoolves the bet using a
                  deployed Agent with no bias!
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          id="examples"
          className="container space-y-6 py-8 md:py-12 lg:py-24 mx-auto"
        >
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-5xl bg-gradient-to-r from-purple-400 to-indigo-400 text-transparent bg-clip-text">
              Example Bet
            </h2>
            <p className="max-w-[85%] text-zinc-400 sm:text-lg">
              See how easy it is to create and manage bets on our platform.
            </p>
          </div>
          <div className="mx-auto max-w-3xl rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-md">
            <div className="flex items-start space-x-4">
              <div className="h-10 w-10 rounded-full bg-zinc-800"></div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center">
                  <h4 className="font-semibold text-purple-400">@pivortex</h4>
                  <span className="ml-2 text-xs text-zinc-500">
                    2 hours ago
                  </span>
                </div>
                <div className="rounded-lg border border-zinc-700 bg-zinc-800 p-4">
                  <p className="font-medium text-zinc-100">
                    @funnyorfud @fiatisabubble I bet you 0.05 ETH that NEAR will
                    be up 10% tomorrow.
                  </p>
                  <div className="mt-2 flex items-center text-sm text-zinc-400">
                    <span className="rounded-full bg-green-900/40 px-2 py-0.5 text-xs font-medium text-green-400 border border-green-800/50">
                      Bet Created
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-start space-x-4 pl-14">
              <div className="h-10 w-10 rounded-full bg-zinc-800"></div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center">
                  <h4 className="font-semibold text-purple-400">@funnyorfud</h4>
                  <span className="ml-2 text-xs text-zinc-500">1 hour ago</span>
                </div>
                <div className="rounded-lg border border-zinc-700 bg-zinc-800 p-4">
                  <p className="font-medium text-zinc-100">
                    @bankrbot what are the addresses for @pivortex and
                    @fiatisabubble?
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-start space-x-4 pl-14">
              <div className="h-10 w-10 rounded-full bg-zinc-800"></div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center">
                  <h4 className="font-semibold text-purple-400">@bankrbot</h4>
                  <span className="ml-2 text-xs text-zinc-500">
                    55 minutes ago
                  </span>
                </div>
                <div className="rounded-lg border border-zinc-700 bg-zinc-800 p-4">
                  <p className="font-medium text-zinc-100">
                    @pivortex: 0x742...a3c1
                    <br />
                    @fiatisabubble: 0x891...f4e5
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-start space-x-4 pl-14">
              <div className="h-10 w-10 rounded-full bg-zinc-800"></div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center">
                  <h4 className="font-semibold text-purple-400">@funnyorfud</h4>
                  <span className="ml-2 text-xs text-zinc-500">
                    50 minutes ago
                  </span>
                </div>
                <div className="rounded-lg border border-zinc-700 bg-zinc-800 p-4">
                  <p className="font-medium text-zinc-100">
                    @pivortex @fiatisabubble Please send 0.05 ETH each to escrow
                    address 0x123...789f to confirm your bet.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-start space-x-4 pl-14">
              <div className="h-10 w-10 rounded-full bg-zinc-800"></div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center">
                  <h4 className="font-semibold text-purple-400">@funnyorfud</h4>
                  <span className="ml-2 text-xs text-zinc-500">
                    30 minutes ago
                  </span>
                </div>
                <div className="rounded-lg border border-zinc-700 bg-zinc-800 p-4">
                  <p className="font-medium text-zinc-100">
                    Both deposits received! Bet is now ACTIVE. Escrow contract:
                    0x123...789f. Total staked: 0.1 ETH.
                  </p>
                  <div className="mt-2 flex items-center text-sm text-zinc-400">
                    <span className="rounded-full bg-blue-900/40 px-2 py-0.5 text-xs font-medium text-blue-400 border border-blue-800/50">
                      Bet Active
                    </span>
                    <span className="ml-2">0.1 ETH locked in contract</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-start space-x-4 pl-14">
              <div className="h-10 w-10 rounded-full bg-zinc-800"></div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center">
                  <h4 className="font-semibold text-purple-400">@pivortex</h4>
                  <span className="ml-2 text-xs text-zinc-500">Just now</span>
                </div>
                <div className="rounded-lg border border-zinc-700 bg-zinc-800 p-4">
                  <p className="font-medium text-zinc-100">
                    @funnyorfud settle bet
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-4 rounded-lg border border-zinc-700 bg-zinc-800 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-zinc-100">
                    Bet Status: Settling
                  </h4>
                  <p className="text-sm text-zinc-400">
                    The NEAR Shade Agent is checking the results...
                  </p>
                </div>
                <Link href="/bets/123">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-zinc-700 text-zinc-800 hover:bg-zinc-800 hover:text-zinc-50"
                  >
                    View Details
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section
          id="faq"
          className="container space-y-6 bg-zinc-900 py-8 md:py-12 lg:py-24 mx-auto rounded-xl"
        >
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-5xl bg-gradient-to-r from-purple-400 to-indigo-400 text-transparent bg-clip-text">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="mx-auto max-w-3xl">
            <div className="space-y-4">
              <div className="rounded-lg border border-zinc-800 bg-zinc-950 transition-all">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1" className="border-b-0">
                    <AccordionTrigger className="px-6 py-4 text-zinc-50 hover:text-purple-400 hover:no-underline">
                      <h3 className="font-bold text-left">
                        How are disputes resolved?
                      </h3>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4 text-zinc-400">
                      <p>
                        Our platform uses NEAR AI agents to analyze the bet
                        terms and resolve outcomes by querying trusted sources
                        like Google. The agent acts as an impartial judge to
                        determine the winner based on real-world events. In rare
                        cases of complex disputes, a decentralized arbitration
                        process can be initiated where community members vote on
                        the outcome.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>

              <div className="rounded-lg border border-zinc-800 bg-zinc-950 transition-all">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-2" className="border-b-0">
                    <AccordionTrigger className="px-6 py-4 text-zinc-50 hover:text-purple-400 hover:no-underline">
                      <h3 className="font-bold text-left">
                        What cryptocurrencies can I use?
                      </h3>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4 text-zinc-400">
                      <p>
                        Currently, we support ETH on Base Sepolia testnet. More
                        cryptocurrencies and networks will be added in future
                        updates as we expand cross-chain functionality through
                        NEAR Protocol integration.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>

              <div className="rounded-lg border border-zinc-800 bg-zinc-950 transition-all">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-3" className="border-b-0">
                    <AccordionTrigger className="px-6 py-4 text-zinc-50 hover:text-purple-400 hover:no-underline">
                      <h3 className="font-bold text-left">
                        Are there any fees?
                      </h3>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4 text-zinc-400">
                      <p>
                        We charge a small 1% fee on successful bet settlements
                        to maintain the platform. This fee is taken from the
                        total bet pool when the winner is paid out. Standard
                        network gas fees also apply for blockchain transactions.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>

              <div className="rounded-lg border border-zinc-800 bg-zinc-950 transition-all">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-4" className="border-b-0">
                    <AccordionTrigger className="px-6 py-4 text-zinc-50 hover:text-purple-400 hover:no-underline">
                      <h3 className="font-bold text-left">Is my money safe?</h3>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4 text-zinc-400">
                      <p>
                        All funds are held in secure smart contracts, not by us.
                        Once both parties deposit their stake, the funds are
                        locked in an MPC escrow address until the bet is
                        settled. Our contracts have been developed with security
                        best practices and will undergo formal audits as we move
                        beyond the testnet phase.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>

              <div className="rounded-lg border border-zinc-800 bg-zinc-950 transition-all">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-5" className="border-b-0">
                    <AccordionTrigger className="px-6 py-4 text-zinc-50 hover:text-purple-400 hover:no-underline">
                      <h3 className="font-bold text-left">
                        How do I create a bet?
                      </h3>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4 text-zinc-400">
                      <p>
                        Simply tag @funnyorfud and your opponent in a post with
                        your bet terms and stake amount (e.g., "@funnyorfud
                        @opponent I bet you 0.05 ETH that NEAR will be up 10%
                        tomorrow"). Our AI agent will parse your bet, and the
                        bot will guide you through the process of wallet
                        verification and fund deposits.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t border-zinc-800 py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row mx-auto">
          <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
            <img
              src="/Logo-transparent.png"
              alt="Smol Bets Logo"
              className="h-12 w-12"
            />

            <p className="text-center text-sm leading-loose text-zinc-400 md:text-left">
              &copy; {new Date().getFullYear()} Smol Bets. All rights reserved.
              Making "smol" bets with big impacts.
            </p>
          </div>
          <div className="flex gap-4">
            <Link
              href="https://x.com/funnyorfud"
              className="text-sm font-medium text-zinc-400 transition-colors hover:text-zinc-50"
            >
              Twitter
            </Link>
            {/* <Link
              href="#"
              className="text-sm font-medium text-zinc-400 transition-colors hover:text-zinc-50"
            >
              Discord
            </Link> */}
            <Link
              href="https://github.com/prakhar728/Smol_bet"
              className="text-sm font-medium text-zinc-400 transition-colors hover:text-zinc-50"
            >
              GitHub
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
