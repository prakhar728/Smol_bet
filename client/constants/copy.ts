export const copy = {
  hero: {
    title: "SMOL BET",
    subtitle:
      "Turning tweets into trustless wagers — no middlemen, just TEE + verifiable AI.",
  },

  values: [
    {
      title: "Start on X",
      desc: "Make and settle bets right on your timeline. No new app.",
    },
    {
      title: "Trustless Escrow",
      desc: "Funds locked in code. No custody, no favors.",
    },
    {
      title: "Verifiable AI + TEE",
      desc: "Decisions computed in secure enclaves and verifiable on-chain.",
    },
    {
      title: "Chain-Agnostic",
      desc: "NEAR MPC + Chain Signatures — launching first on Base.",
    },
  ],

  how: {
    title: "How it works",
    subtitle:
      "SMOL BET turns X posts into on-chain contracts. Here’s the flow.",
  },

  flow: {
    create: {
      title: "Create",
      desc:
        "Post the bet on X: tag your opponent, state terms, stake, and source. The bot parses intent.",
      diagram: [
        "User posts bet on X",
        "Bot parses (NEAR AI/Serpai)",
        "Save metadata",
      ],
      steps: [
        { label: "User posts on X" },
        { label: "Bot parses with NEAR AI/Serpai" },
        {
          label: "Metadata saved to NEAR Storage",
          code: `{
  "betId": "tweet:177...abc",
  "creator": "@PrakahrOjha4",
  "counterparty": "@FiatIsABubble",
  "terms": "BTC > $64k by Friday 23:59 UTC",
  "amount": "10 NEAR each",
  "source": "Coinbase daily close",
  "deadline": "2025-12-31T23:59:59Z"
}`,
        },
      ],
    },

    lock: {
      title: "Lock",
      desc:
        "Bot replies with a deposit address. Both parties fund escrow; TEE coordinates signatures.",
      diagram: [
        "Bot replies with deposit address",
        "Escrow live on Base (Sepolia for demo)",
        "Both parties deposit",
      ],
      steps: [
        { label: "TEE (Phala) triggers Chain Signature", status: "initiated" },
        { label: "Escrow on Base Sepolia", status: "funded" },
        { label: "Both parties deposit", status: "active" },
      ],
    },

    resolve: {
      title: "Resolve",
      desc:
        'When the event ends, reply "Settle". NearAI agent gathers data, TEE computes the decision.',
      diagram: [
        'Reply "Settle" on the thread',
        "NearAI agent checks sources",
        "TEE computes & signs result",
      ],
      steps: [
        { label: "Agent checks public sources" },
        { label: "TEE computes decision", choice: true },
        { label: "Writes result" },
      ],
    },

    payout: {
      title: "Payout",
      desc:
        "Bot posts the outcome and sends funds: 99% to the winner, 1% protocol fee.",
      diagram: [
        "Bot posts result + payout",
        "Winner 99% + 1% fee (on-chain event)",
      ],
      steps: [
        { label: "Winner 99% + 1% protocol fee" },
        { label: "On-chain event emitted", hash: "0x3b0f...cafe" },
      ],
    },
  },
} as const
