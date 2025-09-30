# Lean Canvas for Smol Bet

---

## 1. Problem
**Top 3 problems we're solving:**

- **Informal, off-chain peer-to-peer bets lack enforceability or automated resolution.**  
  Many casual wagers—on crypto price moves, sports, or hot takes—are made verbally or over social media, but there’s no reliable way to enforce or settle them once the moment passes.

- **Current prediction markets suffer from thin liquidity and manipulation risk.**  
  Platforms like Polymarket often rely on low-volume speculative bettors, which allows large traders or “whales” to move prices and distort perceived probabilities. This undermines market trust and accuracy.

- **Regulatory ambiguity and geo-blocking limit accessibility and introduce legal uncertainty.**  
  Polymarket was fined $1.4 million by the CFTC in 2022 and required to block U.S. users, yet investigations (including an FBI raid) continued through late 2024–2025. Platforms face inconsistent bans in France, Belgium, Singapore, and Poland.

**Existing alternatives:**

- Verbal or social media bets that are **untracked, unenforceable, and easily forgotten**.
- Centralized betting platforms or traditional dApps (e.g., Omen, Augur, PlotX), which **require users to leave social apps**, handle custody responsibilities, and rely on structured markets without social-native flows.


---

## 2. Customer Segments

**Target customers:**
- **Primary users:** Social media users (especially on X) who casually wager on crypto, sports, or real-world events.
- **Bankr users on X:** Users who already interact with AI wallets like @bankrbot can seamlessly fund Smol Bet wagers **without leaving the platform**, reducing onboarding friction.
- **Token holders:** [placeholder]
- **Validators/Miners:** Not applicable

**Early adopters:**
- Crypto-native users and degens active on X who already place informal bets, engage with meme coins, or participate in prediction content.
- Users familiar with AI agents (e.g., Bankr, Grok) and comfortable using social bots for DeFi actions.

---

## 3. Unique Value Proposition

**Clear, compelling message:**  
Smol Bet turns casual X posts into trustless, onchain wagers — enforced by AI agents, verified by TEE-secured resolution, and backed by MPC escrow. No middlemen. No oracles. Just verifiable stakes, transparent logic, and automated payouts.

**High-level concept:**  
“Venmo for social bets — enforced by AI, secured by TEE, settled onchain.”


---

## 4. Solution

- Solution 1: Create enforceable smart contracts from informal social bets using a trustless, AI-driven flow  
- Solution 2: Use MPC escrow and onchain contract creation to eliminate the need for custodians or intermediaries  
- Solution 3: Enable seamless bet creation and settlement directly through familiar platforms like X

---

## 5. Channels

- **Community building:** Grow and engage crypto-native audiences on X, Farcaster, and Telegram. Use memes, retweets, and community-led bet threads to foster virality.
- **Social media:** Leverage the @funnyorfud bot on X to create, settle, and amplify bets in public threads. Encourage tagging, reposts, and automated replies to boost visibility.
- **DeFi/Web3 platforms:** Integrate with tools like Bankr, Privy, or Base-native dashboards to allow users to fund and track bets directly from their wallets.
- **Partnerships:**  
  Collaborate with aligned protocols and platforms to enhance visibility, user acquisition, and composability:
  - **Bankr**: Users can fund Smol Bets natively via X using Bankr’s AI wallet bot. This reduces friction and keeps flows fully in-platform.
  - **Farcaster**: Enable bet creation and tracking via casts or bots to tap into crypto-native communities that value decentralization and onchain culture.
  - **Prediction ecosystems** (e.g., Polymarket, Clanker): Explore cross-platform visibility, shared liquidity, or embedded market widgets for social-native users.
  - **Base ecosystem dApps**: Leverage ecosystem alignment for shared liquidity, co-marketing, and bot integration on Base-native apps.

- **Influencer marketing:** Partner with CT influencers, meme coin communities, and sports betting influencers to sponsor high-stakes or meme-worthy public bets.


---

## 6. Revenue Streams

**How will you make money?**

- **Protocol fees:** A 1% fee is deducted from the total pool upon bet resolution. This creates protocol revenue at scale without impacting user experience significantly.
  
- **Premium features (planned):** Optional paid features including:
  - **Anonymity mode** (hide usernames or make private bets)
  - **Auto-settlement** via scheduled AI queries
  - **Custom dispute resolution** or second-opinion agents

- **Token economics:**
  If a native token is introduced, revenue-enhancing utilities may include:
  - **Fee discounts:** Users who fund and settle bets using the native token pay a reduced protocol fee (e.g., 0.5% instead of 1%).
  - **Staking-based benefits:** Users can stake tokens to unlock premium features like anonymity, auto-settlement, or dispute insurance.
  - **Governance rights:** Token holders can vote on treasury distribution, feature priorities, and fee structure changes.
  - **Liquidity incentives:** LP rewards or buyback models to stabilize and grow protocol-owned liquidity.


- **Data insights / betting analytics:** 
  Monetize aggregated, anonymized data such as:
  - Trending bets and markets
  - Sentiment shifts and predictive confidence
  - Social engagement tied to wagered outcomes (X-based attention)


---

## 7. Cost Structure

**Fixed costs:**

- **Development:**
  - **NEAR AI (bet_resolver):** Currently free
  - **Serpai (NLP API for bet_parser):** $75/month now, expected to increase to $150/month
  - **X API access:** $200/month for testing, expected to upgrade to $5,000/month after 2 months
  - **Bot maintenance & contract development:** Ongoing engineering and agent upkeep

- **Infrastructure:**
  - **Base Sepolia/Mainnet deployments:** Smart contract deployment and test environments
  - **MPC coordination (e.g., Lit Protocol, Turnkey, ZeroDev):** Key generation and escrow address logic

- **Security audits:**
  - **Formal audits** for SideBet contracts and escrow logic (one-time or phased)
  - **Internal testing & bug bounty programs** for whitehat incentive alignment

---

**Variable costs:**

- **Marketing:**
  - Paid X promotions, influencer partnerships (Crypto Twitter), meme bounties
  - Community events, competitions, and high-visibility sponsored bets

- **Gas fees:**
  - Contract deployments and settlements on Base (mainnet gas)
  - Escrow creation, staking, resolution transactions

- **Scaling costs:**
  - AI inference (NEAR AI calls via Serpai API)
  - **X API access** as request volume scales
  - **TEE compute (Phala Cloud)** for secure resolution logic when usage volume justifies deployment

---

## 8. Key Metrics
**Key activities you measure:**
- Daily/Monthly Active Users
- Number of active bets created and settled
- Total ETH volume staked and transacted
- Bot engagement and post mentions on X
- Protocol revenue generated (1% fee)

---

## 9. Unfair Advantage
**Something that can't be easily copied or bought:**
- Proprietary combination of social-bot UX + MPC escrow + AI agents (parser/resolver)
- Social-native growth loop embedded in platforms like X
- First-mover advantage in the “social-to-contract” betting niche

---

## 10. Blockchain/AI Integration

**Why blockchain/AI is necessary:**

- **Decentralization benefits:** Trustless escrow and payouts without third parties
- **Trust mechanisms:** Smart contracts enforce bet outcomes transparently
- **AI capabilities:** Agents parse natural language bets and resolve outcomes from real-world data
- **Data sovereignty:** All wagers, deposits, and AI-generated resolutions are recorded onchain, ensuring full transparency and auditability. Users maintain control — no centralized party can modify or hide outcome logic.


---

## 11. Regulatory Considerations

**Compliance strategy:**

- **Jurisdiction approach:**  
  Smol Bet will initially launch in a limited-access testnet (Base Sepolia), restricting usage to jurisdictions that do not classify peer-to-peer social betting as regulated gambling. A progressive geo-fencing and legal review model will be used to scale into compliant markets (e.g., allowing use in non-restricted regions like Singapore, UAE, select U.S. states if applicable).

- **KYC/AML requirements:**  
  As a peer-to-peer protocol using non-custodial wallets, Smol Bet does not directly handle user funds or custody. However, if fiat ramps or centralized partners (e.g., Bankr or wallet bridges) are introduced, Smol Bet may integrate optional KYC tiers for high-volume players or to unlock premium features, in alignment with FATF Travel Rule guidance.

- **Token classification:**  
  A native token will be designed as a **utility governance token**, not a security. It will enable discounts, access control, and protocol voting — with no revenue-sharing or profit guarantees. Legal counsel will be engaged to assess compliance with the Howey and Hinman tests (U.S.), and MiCA rules (EU).

- **Data privacy compliance:**  
  Smol Bet minimizes personal data collection by design. Only public wallet addresses, social tags (e.g., X handles), and onchain bet data are used. If offchain logs or AI resolution history are stored, GDPR/CCPA-compliant storage and user-access controls will be enforced. No sensitive data or KYC is stored by default.


---

## 12. Tokenomics (in the future that too if things work out)

**Token model:**

- **Token utility:**  
  The native token (e.g., $SMOL) will unlock fee discounts when used for bet creation or settlement (e.g., 0.5% vs 1% standard fee). It may also be required to access premium features like anonymity, group bets, or instant AI resolution.

- **Distribution mechanism:**  
  Initial allocation will be designed for ecosystem growth and decentralization, likely including:
  - Protocol incentives for early users and bet creators
  - Contributor and team allocation (with long-term vesting)
  - DAO treasury and community grants
  - Optional liquidity bootstrapping via LBP or staking rewards (if needed)

- **Vesting schedules:**  
  Long-term linear vesting (12–36 months) for contributors and team. No immediate unlocks. A portion of tokens may be reserved for future contributors or strategic partners.

- **Governance rights:**  
  Token holders will participate in DAO governance to influence:
  - Treasury allocation (from protocol fee revenue)
  - Protocol fee rates or changes
  - Feature prioritization (e.g., what agents to deploy, what features to fund)
  - Dispute or resolution upgrade decisions


---
