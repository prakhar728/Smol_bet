# **Phase 3 — AI Resolution & Settlement**

## **Overview**
Once a bet’s escrow is funded and the contract is created (Phase 2), the bet is marked **created** and can be settled any time in the future by either participant.  
Phase 3 listens for settlement intents on **X (Twitter)**, verifies authorization, invokes the **NEAR AI bet resolver**, and finalizes on‑chain payouts.

---

## **Settlement Trigger (X Post)**
The agent monitors replies containing the keyword:
```
@${BOT_NAME} "settle"
```
When detected, the agent fetches the **conversation_id** of the original bet thread to identify the target bet.

---

## **Authorization Check**
Only the **original author** or the **opponent** of the bet can trigger settlement.  
If the caller is neither, the request is ignored (or a polite denial reply is posted).

---

## **Resolution via NEAR AI (Bet Resolver)**
The bet’s natural‑language terms are sent to the **bet resolver agent** on NEAR AI together with curated web results.

**What the resolver code does (in two lines):**
- It first converts the bet terms into a **high‑precision Google search query** (prompt `BET_TO_QUERY_PROMPT`), then fetches results via **SerpAPI**.  
- It then evaluates those results against the bet terms and returns **only `TRUE` or `FALSE`** (prompt `QUERY_TO_BET_RESOLUTION`), enabling deterministic settlement.

**Bet Resolver Agent:** https://app.near.ai/agents/ai-creator.near/Bet_Resolver/latest

> Implementation note: The provided code composes system prompts, generates the query, retrieves SerpAPI results, and makes a second completion that must return a strict boolean string (`TRUE`/`FALSE`).

---

## **On‑Chain Settlement & Distribution**
- The protocol determines the winner from the resolver’s `TRUE`/`FALSE` output.  
- **Fund distribution is handled by the escrow contract itself**: winner receives **99%** of the total pot; **1%** is taken as the protocol fee (treasury).  
- The transaction hash / explorer link is recorded for traceability.

---

## **Public Settlement Reply on X**
After settlement, the agent posts a confirmation reply in the original thread:
```text
Bet settled! 🎉

@${winnerUsername} won ${evm.formatBalance((bet.stake * 2n * 99n) / 100n)} ETH

Reason: ${settlementReason}

Tx: ${result.explorerLink}
```

This completes the lifecycle from social post → escrowed wager → AI‑verified outcome → automated payout.

---

## **Back to Previous Phases**
- [Phase 1 — Bet Searching](./Phase1.md)  
- [Phase 2 — Escrow Generation & Deposits](./Phase2.md)
