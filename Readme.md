# 🧃 Smol Bet — Onchain Side Bet Protocol

Smol Bet is a lightweight, trust-minimized **peer-to-peer betting mechanism** that turns informal wagers into enforceable onchain contracts. Users create bets by tagging friends on Twitter/X, staking ETH, and settling outcomes based on real-world events — resolved by AI + Google.

---

## 🔁 Flow Overview

1. **Create a Bet**  
   A user tags `@SmolBetBot` and an opponent in an X post, e.g.  
   `@SmolBetBot @opponent I bet you 0.05 ETH that NEAR will be up 10% tomorrow.`

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
   `@SmolBetBot settle the NEAR bet`

7. **Resolution (via Agent)**  
   The `bet_resolver` agent:
   - Understands the bet terms
   - Queries Google for real-world outcome
   - Returns `TRUE` (creator wins) or `FALSE` (opponent wins)

8. **Payout**  
   - Winner receives 99% of the total pool
   - 1% protocol fee is taken from the pot

---

## 🛠 Components

| Component         | Description                                                                 |
|------------------|-----------------------------------------------------------------------------|
| `bet_parser`      | AI agent that extracts structured bet data from unstructured X posts        |
| `bet_resolver`    | AI agent that evaluates bet outcomes using NLP and real-time web search     |
| `@BankrBot`       | External bot that returns wallet addresses of X usernames                   |
| `Factory Contract`| Deploys individual `SideBet` contracts per match                            |
| `SideBet Contract`|
