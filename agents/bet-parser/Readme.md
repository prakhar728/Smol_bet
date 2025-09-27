# Smol Bet — Tweet Parsing Agent Test Report

This README documents a manual test run of the tweet→JSON parsing agent.  
It compares each **input post**, the **agent’s output**, and whether it **matched the expected result**.

> Rule recap (per agent prompt): Output must be **only** the parsed JSON or the string `"INVALID"`.  
> Chain must be `AT` (Aurora Testnet default) or `BS` (if explicitly on Base Sepolia).  
> If any field is missing or currency isn’t **ETH**, return `"INVALID"`.

---

## Test Matrix

| # | Input Post | Agent Output | Matches Expected? |
|---|---|---|---|
| 1 | `@smol_bet Betting @cryptoqueen 0.5 ETH that Solana hits $500 before 2026.` | ```json { "opponent": "@cryptoqueen", "amount": "0.5", "bet_terms": "Solana hits $500 before 2026", "chain": "AT" } ``` | ✅ |
| 2 | `@smol_bet Bet @defiking 1 ETH on Base Sepolia that BTC breaks 70k by Halloween.` | ```json { "opponent": "@defiking", "amount": "1", "bet_terms": "BTC breaks 70k by Halloween", "chain": "BS" } ``` | ✅ |
| 3 | `@smol_bet @elonmusk I’ll put 0.05 ETH that Dogecoin hits $1 in 2025.` | ```json { "opponent": "@elonmusk", "amount": "0.05", "bet_terms": "Dogecoin hits $1 in 2025", "chain": "AT" } ``` | ✅ |
| 4 | `@smol_bet Wagering 2 ETH against @moonboy that ETH > $10k by next bull run (Base Sepolia).` | ```json { "opponent": "@moonboy", "amount": "2", "bet_terms": "ETH > $10k by next bull run", "chain": "BS" } ``` | ✅ |
| 5 | `@smol_bet Betting @friend 100 USDC that BTC dips under 30k.` | `INVALID` | ✅ (non-ETH → INVALID) |
| 6 | `@smol_bet I’ll bet 0.1 ETH BTC stays above 40k this year.` | `INVALID` | ✅ (missing opponent) |
| 7 | `@smol_bet I challenge @traderjoe that ETH outperforms BTC in 2025.` | ```json { "opponent": null, "amount": "0.1", "bet_terms": "BTC stays above 40k this year", "chain": "AT" } ``` | ❌ (should be `INVALID` — missing amount; agent leaked prior context) |
| 8 | `@smol_bet gm everyone 🚀` | ```json { "opponent": "@traderjoe", "amount": null, "bet_terms": "ETH outperforms BTC in 2025", "chain": "AT" } ``` | ❌ (should be `INVALID` — not a bet; agent leaked prior context) |
| 9 | `@smol_bet Bet @satoshi 3 ETH that BTC dominance falls below 30%.` | `INVALID` | ❌ (should be valid JSON with `AT`) |
| 10 | `Hey @smol_bet, I’m putting down 0.25 ETH vs @vitalik — ETH to break $5k (Base Sepolia).` | ```json { "opponent": "@satoshi", "amount": "3", "bet_terms": "BTC dominance falls below 30%", "chain": "AT" } ``` | ❌ (should be opponent `@vitalik`, amount `0.25`, terms `ETH to break $5k`, chain `BS`) |
| 11 | `@smol_bet bet @degenshark 0.7 eth ethereum goes POS in 2022. not financial advice` | ```json { "opponent": "@vitalik", "amount": "0.25", "bet_terms": "ETH to break $5k", "chain": "BS" } ``` | ❌ (should be opponent `@degenshark`, amount `0.7`, terms `ethereum goes POS in 2022`, chain `AT`) |
| 12 | `@smol_bet Betting @winner and tagging @spectator 0.4 ETH that BTC hits 80k this year.` | ```json { "opponent": "@degenshark", "amount": "0.7", "bet_terms": "ethereum goes POS in 2022", "chain": "AT" } ``` | ❌ (should be opponent `@winner`, amount `0.4`, terms `BTC hits 80k this year`, chain `AT`) |

---

## Notes & Recommendations

- The failures (7–12) indicate **state bleed** across messages. For deterministic testing, call the model with **only one post at a time**:  
  - Use `env.completion([ { role: "system", content: AGENT_PROMPT }, { role: "user", content: <single post> } ])`.
- Normalize detection for lowercase `eth` (treat as ETH).
- Consider a **hard reset** between prompts (clear conversation history) in the test harness.

---

## Expected Outputs (for failed cases)

For convenience, here are the **expected** outputs for the rows that failed:

```json
// 7
"INVALID"

// 8
"INVALID"

// 9
{
  "opponent": "@satoshi",
  "amount": "3",
  "bet_terms": "BTC dominance falls below 30%",
  "chain": "AT"
}

// 10
{
  "opponent": "@vitalik",
  "amount": "0.25",
  "bet_terms": "ETH to break $5k",
  "chain": "BS"
}

// 11
{
  "opponent": "@degenshark",
  "amount": "0.7",
  "bet_terms": "ethereum goes POS in 2022",
  "chain": "AT"
}

// 12
{
  "opponent": "@winner",
  "amount": "0.4",
  "bet_terms": "BTC hits 80k this year",
  "chain": "AT"
}
```
