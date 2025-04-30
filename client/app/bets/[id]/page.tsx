import Link from "next/link"
import { ArrowLeft, MessageSquare, Shield } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"

export default function BetDetailPage({ params }: { params: { id: string } }) {
  // Mock data for a specific bet
  const bet = {
    id: params.id,
    title: "Bitcoin will hit $100k before the end of 2024",
    description:
      "If the price of Bitcoin (BTC) reaches or exceeds $100,000 USD on any major exchange before December 31, 2024 at 11:59 PM UTC, @alice wins. Otherwise, @bob wins.",
    participants: {
      creator: {
        username: "alice",
        address: "0x1234...5678",
      },
      acceptor: {
        username: "bob",
        address: "0x8765...4321",
      },
    },
    amount: "1.0 ETH",
    totalStaked: "2.0 ETH",
    createdAt: "April 15, 2024",
    status: "In Progress",
    comments: [
      {
        id: "1",
        author: "alice",
        content: "I bet 0.5 ETH that Bitcoin will hit $100k before the end of 2024.",
        timestamp: "April 15, 2024",
      },
      {
        id: "2",
        author: "bob",
        content: "I'll take that bet!",
        timestamp: "April 15, 2024",
      },
      {
        id: "3",
        author: "charlie",
        content: "This is going to be interesting to watch. My money's on Alice!",
        timestamp: "April 16, 2024",
      },
      {
        id: "4",
        author: "alice",
        content: "Looking good so far! BTC just hit $70k today.",
        timestamp: "April 20, 2024",
      },
    ],
  }

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
        <div className="container max-w-4xl">
          <div className="mb-6 flex items-center">
            <Link href="/bets">
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Bets
              </Button>
            </Link>
          </div>

          <Card className="mb-8 overflow-hidden">
            <CardHeader className="bg-muted/50">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">{bet.title}</CardTitle>
                  <CardDescription>Created on {bet.createdAt}</CardDescription>
                </div>
                <div className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                  {bet.status}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="mb-6 space-y-4">
                <div>
                  <h3 className="mb-2 font-semibold">Bet Terms</h3>
                  <p className="text-muted-foreground">{bet.description}</p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg border p-4">
                    <h4 className="mb-2 text-sm font-medium">Participants</h4>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>A</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">@{bet.participants.creator.username}</p>
                          <p className="text-xs text-muted-foreground">{bet.participants.creator.address}</p>
                        </div>
                      </div>
                      <div className="text-sm">Creator</div>
                    </div>
                    <Separator className="my-3" />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>B</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">@{bet.participants.acceptor.username}</p>
                          <p className="text-xs text-muted-foreground">{bet.participants.acceptor.address}</p>
                        </div>
                      </div>
                      <div className="text-sm">Acceptor</div>
                    </div>
                  </div>
                  <div className="rounded-lg border p-4">
                    <h4 className="mb-2 text-sm font-medium">Bet Details</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Individual Stake:</span>
                        <span className="font-medium">{bet.amount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Staked:</span>
                        <span className="font-medium">{bet.totalStaked}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Created:</span>
                        <span>{bet.createdAt}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status:</span>
                        <span className="font-medium">{bet.status}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between gap-2 border-t bg-muted/50 p-6">
              <Button variant="outline" className="w-full">
                Propose "Smol" Settlement
              </Button>
              <Button className="w-full">View on Explorer (No "Bet-ting")</Button>
            </CardFooter>
          </Card>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Comments</h2>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MessageSquare className="h-4 w-4" />
                <span>{bet.comments.length} comments</span>
              </div>
            </div>

            <div className="space-y-4">
              {bet.comments.map((comment) => (
                <div key={comment.id} className="flex gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>{comment.author[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">@{comment.author}</span>
                      <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                    </div>
                    <p>{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <form className="space-y-4">
                <Textarea
                  placeholder='Add a comment... Don&apos;t be "smol" with your thoughts!'
                  className="min-h-[100px]"
                />
                <div className="flex justify-end">
                  <Button>Post Comment</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
            <Shield className="h-6 w-6" />
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
              &copy; {new Date().getFullYear()} Smol Bets. All rights reserved. "Bet-ter" luck next time!
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
