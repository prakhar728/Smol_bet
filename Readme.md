# 🧃 Smol Bet — Onchain Side Bet Protocol

# STATUS - ON HOLD TO MIGRATE FROM MASA TO X API

Smol Bet is a lightweight, trust-minimized **peer-to-peer betting mechanism** that turns informal wagers into enforceable onchain contracts. Users create bets by tagging friends on Twitter/X, staking ETH(Base Sepolia), and settling outcomes based on real-world events — resolved by NEAR AI + Google.

## No oracles. No middlemen. Just verifiable stakes, AI-enforced outcomes, and automated payouts.

## Live Escrow Contract

The current [escrow factory contract](https://sepolia.basescan.org/address/0xfd5152d481cb46ea91aa317782e5963edc45a609) is deployed on Base Sepolia testnet.

---

## 🔁 Flow Overview

<img src="./public/smol_bet_flow.png" alt="Smol Bet flow" width="400"/>

1. **Create a Bet**  
   A user tags `@funnyorfud` and an opponent in an X post, e.g.  
   `@funnyorfud @opponent I bet you 0.05 ETH that NEAR will be up 10% tomorrow.`

2. **Parse the Bet (via Agent)**  
   The `bet_parser` agent analyzes the post to extract:

   - Creator and opponent handles
   - Stake amount
   - Clear bet terms

3. **Address Resolution**  
   The bot replies asking `@BankrBot` for both users' wallet addresses.

4. **MPC Escrow Generation**  
   Once addresses are confirmed, a **multi-party computation (MPC)** escrow address is generated (on Base Sepolia).  
   The bot replies with:

   - Deposit instructions
   - Required ETH per party

5. **Stake & Lock**  
   When both parties deposit the required ETH:

   - Funds are locked
   - A bet smart contract is created via a factory
   - Bet is marked as **active**

6. **Settlement Request**  
   Either user can later tag the bot again to settle the bet:
   `@funnyorfud settle bet`

7. **Resolution (via Agent)**  
   The `bet_resolver` agent:

   - Understands the bet terms
   - Queries Google for real-world outcome
   - Returns `TRUE` (creator wins) or `FALSE` (opponent wins)

8. **Payout**
   - Winner receives 99% of the total pool
   - 1% protocol fee is taken from the pot

---

# Why this?

Informal bets are everywhere — but they’re hard to enforce.

Whether it’s crypto price predictions, sports hot takes, or playful challenges among friends, most bets today happen offchain, are forgotten, or rely on trust. Smol Bet fixes that by turning these fleeting wagers into onchain, enforceable, social-native contracts — using the platforms people already use and love (like X).

Smol Bet is for people who want skin in the game — without needing a centralized platform or formal agreement.

---

# Revenue Generation

Smol Bet generates protocol revenue through a small 1% fee on winning payouts, taken from the total bet pool. Here's how:

- When a bet is settled and the winner is determined, they receive 99% of the total pool.
- The remaining 1% goes to the protocol treasury.
- Over time, this creates a sustainable revenue stream based on:
  _ Volume of bets
  _ Stake size per bet \* Engagement via bot-triggered settlements

### Optional future revenue layers may include:

1. Sponsorships on high-visibility bets
2. Premium features (e.g., anonymity, auto-settlement, group bets)
3. DAO governance over treasury distribution

---

## 🛠 Components

| Component          | Description                                                                                                                                         |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `bet_parser`       | AI agent that extracts structured bet data from unstructured X posts [Check out](https://app.near.ai/agents/ai-creator.near/bet-parser/latest)      |
| `bet_resolver`     | AI agent that evaluates bet outcomes using NLP and real-time web search [Check out](https://app.near.ai/agents/ai-creator.near/Bet_Resolver/latest) |
| `@BankrBot`        | External bot that returns wallet addresses of X usernames - Temporarily @prakharojha4 works :)                                                      |
| `SideBet Contract` | Deploys individual SideBets                                                                                                                         |
