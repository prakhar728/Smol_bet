# SMOL BET (Frontend)

Production-ready Next.js App Router frontend for Smol Bet.

Stack:
- Next.js (App Router), TypeScript, Tailwind CSS, Framer Motion
- shadcn/ui (Button, Card, Dialog, Tabs, Tooltip, Accordion, Separator, Badge, Alert)
- Icons: lucide-react
- Mobile-first, responsive up to XL
- Accessibility-first (focus-visible rings, labels, reduced motion)

Routes:
- / — Landing (Hero, Value Grid, Social Proof, How it works preview)
- /how-it-works — Interactive flow with Tabs and Dialogs
- /legal — Placeholder (terms & disclaimers)

Quick start:
- pnpm dev (or npm/yarn) to start
- Edit copy in constants/copy.ts
- Edit theme colors/shadows in tailwind.config.ts
- Deploy on Vercel

Notes:
- SEO metadata + OG tags are implemented in app/page.tsx.
- Animations respect prefers-reduced-motion.
- Buttons and interactive elements use focus-visible neon lime outline.

Architecture:
- components/brand/LogoMark.tsx — text mark logo
- components/ui/GlowButton.tsx — primary neon lime button with glow
- components/hero.tsx — full-bleed hero with neon background treatment
- components/value-grid.tsx — value cards with icons
- components/social-proof.tsx — partner badges
- components/timeline.tsx — 4-step preview with “View Flow” dialogs
- components/step-dialog.tsx — reusable dialog for step-by-step content
- components/section.tsx — scroll-reveal section wrapper
- components/site-header.tsx, components/site-footer.tsx — global layout

A11y:
- Screen-reader labels on key links/buttons.
- Focus-visible rings (lime) for keyboard navigation.
- Color contrast verified for charcoal/off colorway.

Where to customize:
- Colors/shadows: tailwind.config.ts
- Copy: constants/copy.ts
- External links: Header/Footer components

Client vs Server:
- Pages default to Server Components for performance; interactive components include 'use client' and handle animations/events [^1][^vercel_knowledge_base].
