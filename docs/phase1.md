# 🧩 **Phase 1 — Bet Searching**

## **Overview**
Phase 1 forms the foundation of **Smol Bet’s autonomous workflow**.  
In this stage, the Shade Agent constantly scans **X (Twitter)** for potential bet related posts, interprets them, and prepares the necessary onchain setup for deposits.

The goal is to transform natural language posts into structured data the protocol can act on automatically, verifiably, and cross chain.

---

## **Continuous Search**
The Shade Agent runs a looped search routine using the **X API**, querying every few minutes for new posts that mention `@smol_bet "bet"` or contain recognizable betting language such as  
> “I bet,” “wager,” “challenge,” etc.

Each discovered post is treated as a potential bet and queued for parsing.

---

## **Parsing Bets**
Detected posts are passed to the **Bet Parser Agent**, a NEAR AI Hub agent fine tuned to extract key bet elements from plain text.  
It returns a clean JSON object containing everything needed to initiate a bet.

Example output:
```json
{
  "creator": "@user1",
  "opponent": "@user2",
  "amount": "0.05",
  "bet_terms": "BTC will hit $70K by Friday",
  "chain": "AT"
}
```

**Bet Parser Agent:** [bet-parser (NEAR AI Hub)](../agents/bet-parser/0.0.3/agent.py)

---

## **Chain Selection**
Each parsed bet includes a preferred chain parameter.  
By default, Smol Bet operates on **Aurora Testnet (AT)**, but can extend to other supported chains such as **Base Sepolia (BS)**.  
This chain choice determines where escrow addresses and funds will be created.

---

## **Deposit Address Generation**
Once a bet is parsed, the Shade Agent uses **NEAR Chain Signatures** to generate unique deposit addresses for both participants.  
These addresses are deterministically derived from the agent’s base key and post metadata:

```
${post.author_username}-${post.id}
${opponent_username}-${post.id}
```

This ensures every bet’s funds are **verifiable, non custodial, and linked directly** to the originating social post.

---

## **Public Reply on X**
After generating the addresses, the agent replies to the original post, tagging both users and providing deposit instructions.  
Example message:
> “I got you! 
@author_username deposit stake_amount ETH to authorDepositAddress 
and @opponent_username deposit stake_amount ETH to opponentDepositAddress”

This closes the **Bet Searching phase** — the wager is now discovered, parsed, and ready for escrow funding in the next stage.

## Next Phase

Continue to [Phase 2 — Escrow Generation & Deposits](./phase2.md)

to see how Smol Bet handles deposit verification and onchain escrow creation.