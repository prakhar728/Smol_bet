import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800 bg-zinc-950/95 backdrop-blur supports-[backdrop-filter]:bg-zinc-950/60">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0 mx-auto">
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <img
              src="/Logo-transparent.png"
              alt="Smol Bets Logo"
              className="h-12 w-12"
            />
            <span className="inline-block font-bold text-purple-400">
              Smol Bets
            </span>
          </Link>
          <nav className="hidden gap-6 md:flex">
            <Link
              href="#how-it-works"
              className="flex items-center text-sm font-medium text-zinc-400 transition-colors hover:text-zinc-50"
            >
              How It Works
            </Link>
            <Link
              href="#examples"
              className="flex items-center text-sm font-medium text-zinc-400 transition-colors hover:text-zinc-50"
            >
              Flow
            </Link>
            <Link
              href="#faq"
              className="flex items-center text-sm font-medium text-zinc-400 transition-colors hover:text-zinc-50"
            >
              FAQ
            </Link>
            <Link
              href="/examples"
              className="flex items-center text-sm font-medium text-zinc-400 transition-colors hover:text-zinc-50"
            >
              Example
            </Link>
          </nav>
        </div>
        {/* <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <Link href="/bets">
              <Button
                variant="outline"
                size="sm"
                className="border-zinc-700 text-zinc-800 hover:bg-zinc-800 hover:text-zinc-50"
              >
                View Bets
              </Button>
            </Link>
            <Link href="/bets">
              <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                Launch App
              </Button>
            </Link>
          </nav>
        </div> */}
      </div>
    </header>
  );
}