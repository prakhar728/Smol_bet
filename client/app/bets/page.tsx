import Link from "next/link"
import { ArrowLeft, Shield } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function BetsPage() {
  // Mock data for active bets
  const activeBets = [
    {
      id: "1",
      title: "Bitcoin will hit $100k before the end of 2024",
      participants: {
        creator: "alice",
        acceptor: "bob",
      },
      amount: "1.0 ETH",
      status: "In Progress",
    },
    {
      id: "2",
      title: "Ethereum will flip Bitcoin in market cap by 2025",
      participants: {
        creator: "charlie",
        acceptor: "dave",
      },
      amount: "2.5 ETH",
      status: "In Progress",
    },
    {
      id: "3",
      title: "The S&P 500 will close above 5000 by July 2024",
      participants: {
        creator: "eve",
        acceptor: "frank",
      },
      amount: "0.75 ETH",
      status: "In Progress",
    },
    {
      id: "4",
      title: "Tesla will release a fully autonomous vehicle by end of 2024",
      participants: {
        creator: "grace",
        acceptor: "henry",
      },
      amount: "3.0 ETH",
      status: "Pending",
    },
  ]

  const pendingBets = [
    {
      id: "5",
      title: "Apple will announce AR glasses at WWDC 2024",
      participants: {
        creator: "ivan",
        acceptor: null,
      },
      amount: "1.5 ETH",
      status: "Pending",
    },
    {
      id: "6",
      title: "The next US president will be a Democrat",
      participants: {
        creator: "julia",
        acceptor: null,
      },
      amount: "5.0 ETH",
      status: "Pending",
    },
  ]

  const completedBets = [
    {
      id: "7",
      title: "Bitcoin will break $50k in Q1 2024",
      participants: {
        creator: "kevin",
        acceptor: "laura",
      },
      amount: "2.0 ETH",
      status: "Resolved",
      winner: "kevin",
    },
    {
      id: "8",
      title: "Manchester City will win the Premier League 2023-2024",
      participants: {
        creator: "mike",
        acceptor: "nina",
      },
      amount: "1.0 ETH",
      status: "Resolved",
      winner: "nina",
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
          <div className="flex gap-6 md:gap-10">
            <Link href="/" className="flex items-center space-x-2">
              <Shield className="h-6 w-6" />
              <span className="inline-block font-bold">Smol Bets</span>
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                Connect Wallet
              </Button>
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1 py-6">
        <div className="container">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight">Bets</h1>
              <p className="text-muted-foreground">
                Browse, create, and manage your on-chain bets. Let's get "bet-ter" together!
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
              <Button size="sm">Place Your "Smol" Bet</Button>
            </div>
          </div>

          <Tabs defaultValue="active" className="mt-6">
            <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
            <TabsContent value="active" className="mt-6">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {activeBets.map((bet) => (
                  <Link href={`/bets/${bet.id}`} key={bet.id}>
                    <Card className="h-full overflow-hidden transition-all hover:shadow-md">
                      <CardHeader className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                            {bet.status}
                          </div>
                          <div className="font-medium">{bet.amount}</div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <h3 className="font-semibold">{bet.title}</h3>
                      </CardContent>
                      <CardFooter className="border-t bg-muted/50 p-4">
                        <div className="flex w-full items-center justify-between text-sm">
                          <div className="flex items-center gap-1">
                            <span className="font-medium">@{bet.participants.creator}</span>
                            <span>vs</span>
                            <span className="font-medium">@{bet.participants.acceptor}</span>
                          </div>
                          <div className="text-muted-foreground">View Details →</div>
                        </div>
                      </CardFooter>
                    </Card>
                  </Link>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="pending" className="mt-6">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {pendingBets.map((bet) => (
                  <Link href={`/bets/${bet.id}`} key={bet.id}>
                    <Card className="h-full overflow-hidden transition-all hover:shadow-md">
                      <CardHeader className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
                            {bet.status}
                          </div>
                          <div className="font-medium">{bet.amount}</div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <h3 className="font-semibold">{bet.title}</h3>
                      </CardContent>
                      <CardFooter className="border-t bg-muted/50 p-4">
                        <div className="flex w-full items-center justify-between text-sm">
                          <div className="flex items-center gap-1">
                            <span className="font-medium">@{bet.participants.creator}</span>
                            <span>waiting for opponent</span>
                          </div>
                          <div className="text-muted-foreground">Accept Bet →</div>
                        </div>
                      </CardFooter>
                    </Card>
                  </Link>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="completed" className="mt-6">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {completedBets.map((bet) => (
                  <Link href={`/bets/${bet.id}`} key={bet.id}>
                    <Card className="h-full overflow-hidden transition-all hover:shadow-md">
                      <CardHeader className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-100">
                            {bet.status}
                          </div>
                          <div className="font-medium">{bet.amount}</div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <h3 className="font-semibold">{bet.title}</h3>
                      </CardContent>
                      <CardFooter className="border-t bg-muted/50 p-4">
                        <div className="flex w-full items-center justify-between text-sm">
                          <div className="flex items-center gap-1">
                            <span className="font-medium">@{bet.participants.creator}</span>
                            <span>vs</span>
                            <span className="font-medium">@{bet.participants.acceptor}</span>
                          </div>
                          <div className="text-muted-foreground">Winner: @{bet.winner}</div>
                        </div>
                      </CardFooter>
                    </Card>
                  </Link>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
            <Shield className="h-6 w-6" />
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
              &copy; {new Date().getFullYear()} Smol Bets. All rights reserved. Where "smol" bets lead to big wins.
            </p>
          </div>
          <div className="flex gap-4">
            <Link
              href="#"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Terms
            </Link>
            <Link
              href="#"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
