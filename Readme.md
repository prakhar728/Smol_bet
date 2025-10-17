# 🧠 **Smol Bet — Agentic Betting, Cross-Chain by Design**

**Smol Bet** is an **agentic betting platform** that transforms social posts into on-chain wagers.  
Built using the **Shade Agents Framework**, it enables users to create, join, and resolve bets directly on **X (Twitter)** — without intermediaries, custodians, or centralized systems.  

Funds are securely managed through **NEAR Chain Signatures**, ensuring verifiable multi-chain deposits, while **NEAR AI** automatically verifies outcomes and settles bets transparently.  
Smol Bet brings **trustless, AI-driven, and social-native betting** to the Web3 ecosystem.

> **Verifiable stakes. AI-enforced outcomes. Automated payouts.**

---

## 💡 **The Problem**
Social bets are everywhere — crypto price predictions, sports debates, or friendly dares — but they’re **unenforceable, unverifiable, and easily forgotten**. 

Social and onchain betting today faces several core challenges:

* Centralized platforms require trust in intermediaries or custodians.
* Cross-chain participation is complex and fragmented.
* Manual resolution of bets often leads to disputes and bias.
* Poor UX and slow onboarding prevent mainstream adoption

---

## ⚙️ **How Smol Bet Solves It**
1. **Detects bets on X** using an autonomous **Shade Agent**.  
2. **Parses terms** with an AI-powered `bet_parser`.  
3. **Generates non-custodial deposit addresses** using **NEAR Chain Signatures**.  
4. **Automates resolution** via **NEAR AI**, enforcing payouts trustlessly.  

---

## 🧩 **Core Tech Stack**
- **Shade Agents Framework** — Secure TEEs + NEAR key management for agentic automation.  
- **NEAR Chain Signatures** — Verifiable, multi-chain deposits and fund control.  
- **NEAR AI** — Natural language understanding + web search for autonomous resolution.  
- **Aurora Testnet** + **Base Sepolia** — Active test deployments for escrow contracts.  

---

## 📂 **Documentation**
Full implementation details, architecture diagrams, and phase-wise build notes are in the [`/docs`](./docs) folder.  
- **Phase 1:** Bet Searching & Parsing [->](/docs/phase1.md)  
- **Phase 2:** Escrow Generation & Deposits  [->](/docs/phase2.md)  
- **Phase 3:** AI Resolution & Payouts  [->](/docs/phase3.md)  

---

## 🛠 **Live Contracts**
- [Base Sepolia — Escrow Factory](https://sepolia.basescan.org/address/0xfd5152d481cb46ea91aa317782e5963edc45a609)  
- [Aurora Testnet — Escrow Factory](https://explorer.testnet.aurora.dev/address/0x402BB0aD0B394EB38ebAA0a5c271eE01341e2AF0)

---

## 🗺 **Roadmap (Q4 2025)**
- View the complete [Roadmap here](./Roadmap.md)

---

## 📣 **Get Involved**
- 🧪 **Test** — Try Smol Bet on Aurora/Base testnets.  
- 🧱 **Build** — Contribute to agents, contracts, and flows.  
- 📢 **Follow** — [@smol_bet](https://twitter.com/smol_bet) for live updates.  
