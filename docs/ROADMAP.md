# Roadmap (after launch)

What to build, in order. Don't skip ahead — each step compounds with traffic from the previous.

## Phase 1: Establish baseline (months 1-3)

- ✅ 10 tools indexed (done at launch)
- ✅ 6 recipes (done at launch)
- ✅ Daily refresh CI (done)
- [ ] +5 tools (week 1)
- [ ] +10 recipes (months 1-3)
- [ ] First Hacker News post
- [ ] First 1k visitors
- [ ] Search Console submitted

## Phase 2: SEO compounding (months 3-6)

- [ ] Cluster recipes by tool — use tag-pages for SEO long-tail.
- [ ] Add `tools/[slug]/setup.mdx` — zero-to-running setup guides per tool.
- [ ] Add `vs/[A]/[B]` slugs for short URLs (current `/compare/A-vs-B` is fine, but shorter ranks better).
- [ ] Implement client-side search (only when ≥30 recipes — before that, browser Cmd-F is fine).
- [ ] OG image generator (one PNG per page, generated at build time via @vercel/og).
- [ ] Schema.org `FAQPage` on tool detail pages — pulls FAQ from common questions.

## Phase 3: Audience capture (months 4-9)

- [ ] **Newsletter** via beehiiv. Weekly digest of tool changes, new recipes, links.
  - First 1k subscribers = ~$0 cost on free tier.
  - 1k subscribers × $1-5 RPM = $50-250/mo from newsletter ads alone.
- [ ] **Twitter/X auto-poster** — when a recipe ships, tweet the TL;DR. Buffer or @posthog/cron.
- [ ] **GitHub stars badge** — vanity but helps community signal.
- [ ] **Discord server** for tool-comparison chat. Risky time-sink — only do this when you have 100+ engaged readers asking.

## Phase 4: Differentiate from copycats (months 6-12)

Every successful niche site gets cloned within ~6 months. Defenses:

- [ ] **Original benchmarks** — pick a benchmark task ("rebuild a CRUD endpoint in Rails") and run it through every tool monthly. Publish results. Nobody else has this data.
- [ ] **Direct vendor relationships** — early access to features, exclusive interviews. The site becomes "the place tools want to be reviewed".
- [ ] **Annual report** — "State of AI Coding Tools 2026". Hard to clone. Earned media.
- [ ] **Community-contributed recipes** — accept PRs, review, give credit. Network effect.

## Phase 5: Premium product (months 9-18, only if Phase 1-4 worked)

- [ ] **AgentStack Pro** ($9/mo) — change alerts, comparison exports, ad-free.
- [ ] **AgentStack Teams** ($29/mo) — internal AI tool spend dashboard for engineering managers.
- [ ] **API access** — sell the data layer to other sites/research/VCs. $99-499/mo enterprise.

## Phase 6: Exit options

If the site is at $5k+ MRR for 6+ consecutive months:

- **Hold**: keep collecting. Margins are 90%+ (only cost = your time + ~$30/mo infra).
- **Sell**: Empire Flippers / Flippa. Niche content sites currently sell at 30-40× monthly revenue. $5k MRR → ~$180k exit.
- **Acquire**: vendor in the space buys you for content + traffic. Higher multiple but rarer.

Don't optimize for exit on day 1. Optimize for actually-useful site. Buyers smell unloved sites instantly and price them low.

## Things you should NOT add (anti-roadmap)

- **Forums / chatrooms** — high maintenance, low SEO value, easy spam-vector.
- **User accounts (early)** — adds support burden before you have audience.
- **Mobile app** — your audience is on desktop coding. Don't.
- **AI chatbot for the site** — clever idea, but every visitor expects accurate answers, hard to police.
- **More AI-related niches at once** — focus until you've nailed this one. The temptation to start "agentstack-for-non-coding-AI" will be strong; resist for first 12 months.

## What "success" looks like at month 12

- 30k+ monthly visitors
- $500-2,000 MRR
- 1-2 hours/week maintenance after content cadence stabilizes
- Optionality: keep, sell, expand to adjacent niches

If you're below 5k visitors at month 12 with consistent content shipping — pivot or kill. Don't sunk-cost-fallacy a struggling site for years.
