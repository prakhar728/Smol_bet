# **Phase 2 — Escrow Generation & Deposits**

## **Overview**
Phase 2 handles **deposit verification and escrow creation**.  
The agent pulls pending bets from state, verifies that both parties have deposited the required stake, and then safely moves funds into an **onchain escrow** on **Aurora Testnet**. This stage ensures funds are non‑custodial, traceable, and protected before a bet becomes *active*.

---

## **State Intake**
- The agent reads from the **State queue** the set of bets that are awaiting deposit verification.  
- Each bet record includes: participant handles, stake amount, generated deposit addresses, chain selection, and parsing metadata.

---

## ⏱**Deposit Check Policy**
- **Rate:** up to **12 balance checks per minute** per bet (to avoid spamming providers).  
- Each bet maintains a **depositAttemptCount**; if it reaches the cap, checks pause until the next cycle.  
- This policy is idempotent and prevents accidental over-querying.

---

## **Balance Verification**
For each bet:
1. Query the **deposit address** of **creator** and **opponent** on the configured chain (default **Aurora Testnet**).  
2. If **both balances ≥ stake**, the bet qualifies for escrow creation.  
3. If one or both balances are insufficient, the bet remains in the queue for the next cycle.

---

## **Resolver Account (Temporary Hold)**
- The **resolver account** is a deterministic account derived by **NEAR Chain Signatures** on Aurora Testnet.  
- **Base key:** the agent’s NEAR account.  
- **Derivation path:** `ethereum-1`.  
- Purpose: **temporary custody** long enough to atomically create the escrow bet and forward funds into the escrow contract (so users don’t risk funds stuck at deposit addresses).

> Note: Although funds pass through the resolver, control is **non‑custodial and verifiable** via Chain Signatures; the resolver exists to orchestrate atomic creation + deposit into escrow.

---

## **Escrow Creation on Aurora**
1. Call the **SideBet Escrow Factory** on Aurora Testnet to create a new **bet contract** (parameters: participants, stake, description/terms).  
2. On success, the **resolver** transfers the combined stake (**2 × amount**) into the newly created escrow contract.  
3. The bet status transitions to **active** once escrow funding is confirmed on-chain.

---

## **Activation Reply on X**
After successful escrow creation and funding, the agent posts a reply under the original thread to inform participants and provide traceability:

```text
Bet is now active!

Total stake: ${evm.formatBalance(bet.stake * 2n)} ETH

Description: "${bet.description}"

Tx: ${aLinkToExplorerFor(betResult)}

Either party can trigger settlement by tagging @${BOT_NAME} with "settle bet"
```

(Implementations often interpolate an explorer URL such as Aurora, Base, or the configured chain.)

---

## 🔄 **Failure & Retry Notes**
- If escrow creation TX fails but deposits are present, the resolver **does not** keep funds; it retries or returns funds back to the original deposit addresses according to policy.  
- All transitions are **idempotent** (reprocessing the same state does not duplicate contracts or transfer funds twice).  
- Errors and hashes are logged for auditability.

---

## 🔗 **Next Phase**
Continue to [**Phase 3 — AI Resolution & Payouts**](./phase3.md)  
to see how outcomes are determined and winnings are distributed.
