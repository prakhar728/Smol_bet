# Smol Bet - Product Roadmap (Next 5 weeks)

## October 

### **Week 4** (24th - 31st)
- Complete the Aurora Testnet Flow - end to end.
- Ensure reward distribution is working as expected.
- Ensure X tweet pickups are accurate.

## November

### **Week 1** (1st - 7th)
- Shifting to Near Private AI - Near AI agenthub is sunsetting soon, we'll have to shift to a different deployment platform.
- Release AI resolutors benchmarks - compare results of the bets and terms entered by the users.
- Wrap the whitelisting users + simulation flow.

###  **Week 2** (8th - 15th)
- Release documentation on private storage with Shade Agents and Filecoin/ or a solution by Phala.
- Release leaderboard metrics, and systems. 
- Marketing on X should start here.


### **Week 3** (16th - 23rd)

- Release the whitelisted users campaign. Allow people to create bets, resolve and playaround with the bot.
- Release Dispute Resolution - alpha(Get market feedback for iteration and improvement)

### **Week 4** (24th - 30th)

- Near Intents integration - allow people to deposit through any EVM chain, and using intents bridge it to Aurora to manage funds.
- Later the distribution of rewards can be managed through Near Chain Signatures again.


## 🗓️ Development Roadmap (Aug → Sept 2025)

### **August**
#### **Week 2**
- Re-init the repo with the latest version of **Shade Agents**  
- Create the **NEAR Storage Contract** (basic version, no ACL yet)  

#### **Week 3**
- Shift from **Masa AI** to **X** for data collection and posting  
- Begin **R&D on NEAR AI Agent** for bet resolution  
- Launch **mini public testing campaign** for the AI agent  

#### **Week 4**
- Build **whitelisting platform** to control access to the bot  
- Invite early testers to interact, iterate, and report bugs  

---

### **September** (Refined and Reviewed)
#### **Week 1** 
- Build **whitelisting platform** to control access to the bot (Shifted to this month)
- Invite early testers to interact, iterate, and report bugs  
- Reiterate and improve **fault tolerance** — aim for **zero downtime** in core flow  


#### **Week 2**
- Begin **R&D on NEAR AI Agent** for bet resolution  (Shifted to this month)
- Integrate **MPC escrow contracts** on Base Sepolia  
- Connect bot flow to create, accept, and resolve bets fully onchain  
- Test **TEE + NEAR Shade Agent** end-to-end inside Phala TEE  

#### **Week 3**
- Conduct **closed beta with active X users**  
- Add analytics logging for bet creation, acceptance, and resolution  
- Patch issues from tester feedback, improve error handling  

#### **Week 4**
- Final pre-launch testing on **Base Sepolia** with full bot integration  
- Simulate high-load scenarios to verify uptime and performance  
- Prepare documentation, README, and onboarding guide for public release  

**🎯 Goal:** Fully tested, stable Smol Bet running on **Base Sepolia** by end of September.

## **Q1 2026 (Jan → Mar) — Solana Research & Prototype**  

**Product Goals**  
- 🚀 Begin **research and design** for Smol Bet on **Solana**.  
- Prototype a **basic escrow contract** on Solana testnet.
- Launch a **minimal viable version** of Smol Bet on Solana devnet.  


**Technical Goals**  
- Build a **treasury module** for the 1% protocol fee.  
- Deep dive into **Solana runtime & account structure** for escrow logic.  
- Explore **Anchor framework** for program development.  
- Build an early **bet_parser integration** that outputs Solana-compatible instructions.  
- Research Solana **indexing/observability tools** (Helius, RPC infra).  
- Set up a **local validator + CI pipeline** for Solana program testing.  

---

## **Q2 2026 (Apr → Jun) — MVP Testing, Feedback & Promotion**  

**Product Goals**  
- Run **cross-chain campaigns** on both **Solana devnet** and **Base mainnet** to attract early users.  
- Actively **promote Smol Bet within Solana and Base communities** (CT, Farcaster, Solana ecosystem).  
- Onboard a group of **early testers** and run structured feedback loops.  
- Iterate on UX (bet creation flow, notifications, bet history).  
- Begin **sponsored or community-driven bet campaigns** to test engagement.  

**Technical Goals**  
- Refine **Solana escrow program** based on tester feedback.  
- Enhance **treasury module** for transparent fee accounting.  
- Optimize settlement and payout flows for **speed + reliability**.  
- Improve monitoring + analytics dashboards to track bet volume, success rates, and campaign metrics.  
- Address bugs and improve fault tolerance uncovered during campaigns.  

---

🎯 **End of Q2 milestone:**  
Smol Bet will be actively **tested and promoted on both Solana and Base**, with **real user campaigns, feedback-driven improvements, and stronger UX** — moving from a prototype into a **community-validated cross-chain product**.  
