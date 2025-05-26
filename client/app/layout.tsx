import type { Metadata } from "next";
import "./globals.css";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Smol Bet | Onchain Peer-to-Peer Betting Protocol",
  description:
    "Create and settle peer-to-peer bets directly on-chain with no middlemen. Turn informal wagers into enforceable smart contracts with AI-powered resolution.",
  generator: "Next.js",
  keywords: [
    "blockchain",
    "betting",
    "crypto",
    "smart contracts",
    "peer-to-peer",
    "web3",
    "NEAR",
    "ethereum",
  ],
  authors: [{ name: "Smol Bet Team" }],
  creator: "Smol Bet",
  publisher: "Smol Bet",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://smolbet.xyz",
    title: "Smol Bet | Onchain Peer-to-Peer Betting Protocol",
    description:
      "Create and settle peer-to-peer bets directly on-chain with no middlemen. Turn informal wagers into enforceable smart contracts with AI-powered resolution.",
    siteName: "Smol Bet",
    images: [
      {
        url: "/Logo.png", // Use your logo here for social sharing
        width: 1200,
        height: 630,
        alt: "Smol Bet - Onchain Side Bet Protocol",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Smol Bet | Onchain Peer-to-Peer Betting Protocol",
    description:
      "Create and settle peer-to-peer bets directly on-chain with no middlemen. Turn informal wagers into enforceable smart contracts with AI-powered resolution.",
    creator: "@funnyorfud",
    images: ["/Logo.png"], // Use your logo here for Twitter
  },
  icons: {
    icon: [
      { url: "/Logo.png" }, // Use your logo as favicon
      { url: "/Logo.png", sizes: "16x16", type: "image/png" },
      { url: "/Logo.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/Logo.png" }, // Use your logo as Apple touch icon
    ],
  },
  manifest: "/site.webmanifest",
  themeColor: "#4B0082",
  appleWebApp: {
    title: "Smol Bet",
    statusBarStyle: "black-translucent",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* You can add custom head elements here that aren't covered by metadata */}
        <link rel="icon" href="/Logo.png" /> {/* Fallback favicon */}
      </head>
      <body>{children}</body>
    </html>
  );
}
