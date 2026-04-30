# Launch Playbook (90 days)

This is the difference between a code-shipped-and-forgotten site and one that earns. Follow this if you actually want traffic and revenue.

## Day 0 — before publishing

- [ ] Buy domain. Recommended: `agentstack.dev` ($12/yr at Cloudflare Registrar — at-cost). Alternative TLDs that signal dev-trust: `.dev`, `.io`, `.tools`.
- [ ] Update `astro.config.mjs` with your domain.
- [ ] Replace `your-org/agentstack` GitHub link in `about.astro`.
- [ ] Generate proper `og-default.png` (1200×630). Use Figma + your branding. Test with [opengraph.dev](https://www.opengraph.dev/).
- [ ] Set up Cloudflare account, create Pages project linked to GitHub repo.
- [ ] Set `CF_API_TOKEN` and `CF_ACCOUNT_ID` secrets in repo.
- [ ] Push to `main` — verify deploy works.
- [ ] Submit `https://yourdomain/sitemap-index.xml` to Google Search Console.
- [ ] Submit to Bing Webmaster Tools.

## Week 1 — content audit

You launched with 10 tools and 6 recipes. That's enough for indexing but not for traffic. Fix:

- [ ] Add 5 more tools you actually use. Pick from: **Codeium**, **Tabnine**, **Sourcegraph Cody**, **Amazon Q Developer**, **JetBrains AI**, **PearAI**, **Bolt.new**, **v0.app**, **Lovable**, **Replit Agent**. Each takes 30 min in `src/content/tools/`.
- [ ] Write 4 more recipes — focus on real pain points. Topics that traffic well:
  - "Setting up [Tool] with [Common Stack]"
  - "[Tool] vs [Tool] for [Specific Use Case]"
  - "Migrating from [Old Tool] to [New Tool]"
  - "[Tool] config for [Industry]"
- [ ] Each recipe must have ≥1 unique insight. No "10 tips" listicles — Google penalizes them since 2024.

## Week 2 — first traffic

These five posts move the needle:

- [ ] **Hacker News (Show HN)** — frame as "I built X because Y was annoying". Don't link to homepage; link to the most useful single page (a comparison or a recipe). Do this on Tue/Wed morning ET.
- [ ] **r/programming** post — same framing. Be ready for harsh critique.
- [ ] **Twitter/X thread** — 7 tweets max. Each tweet is one fact from your data. Last tweet is the URL.
- [ ] **dev.to crosspost** — copy your best recipe with canonical URL set to your site (so Google credits your domain).
- [ ] **Indie Hackers** — share in "Show IH" with revenue model section honest.

Goal week 2: 1000-3000 visitors. Conversion to anything = 0% (this is fine, you're building authority).

## Week 3-4 — SEO foundation

- [ ] Internal linking: every tool page should link to ≥2 recipes that use it (already done by template).
- [ ] Add **canonical** tags everywhere (already in BaseLayout).
- [ ] Hand-write meta descriptions for top-10 expected landing pages — don't rely on auto-generated ones for those.
- [ ] Run Lighthouse on 3 pages — fix any score below 95.
- [ ] Get listed in:
  - [awesome-llm-coding-tools](https://github.com/searches?q=awesome+llm+coding) GitHub awesome lists (PR yourself in)
  - [There's An AI For That](https://theresanaiforthat.com)
  - Free tier of Product Hunt.

## Month 2 — monetization gate

When you hit roughly:
- ✅ 5,000 monthly visitors
- ✅ 30+ pages
- ✅ Real RSS subscribers (≥50)

Then apply for:
- [ ] **Carbon Ads** ([carbonads.net](https://www.carbonads.net/)). Expect ~3-5 day approval. They pay $30-50 CPM for dev traffic.
- [ ] Affiliate programs:
  - **Cursor** — DM their growth team via Twitter (no formal program last I checked)
  - **GitHub Copilot** — through Microsoft Affiliate Network
  - **Codeium** — DM team
  - **Anthropic Claude** — no affiliate program publicly, but you can get sponsorships
  - Use your tool detail pages' `affiliate_url` field once you have links.

After approval, set `PUBLIC_ADS_ENABLED=true` in Cloudflare Pages env vars.

## Month 3 — scale content

- [ ] Add **20+ more recipes**. The more long-tail recipes, the more long-tail traffic.
- [ ] Add **pricing-changed** notifications via newsletter. Free tier on Substack/beehiiv.
- [ ] Consider **YouTube companion** — turn top-3 recipes into 5-min videos. YouTube traffic flows to your site.

## Realistic income trajectory

| Month | Visitors/mo | Revenue range |
|---|---|---|
| 1 | 0-500 | $0 |
| 2 | 1k-5k | $0-50 |
| 3 | 3k-15k | $50-300 |
| 6 | 10k-50k | $200-1500 |
| 12 | 30k-150k | $500-5000 |
| 24 | 100k-500k | $1500-15000 |

**This trajectory assumes you keep adding content monthly.** A site abandoned after launch typically dies inside 6 months.

## Failure modes to watch

- **Google AI-content penalty**: don't post AI slop. Hand-edit everything.
- **Single point of failure**: don't rely solely on Google. Build email list from day 1.
- **Tool obsolescence**: AI coding tools market changes monthly. Set a calendar reminder to re-verify each tool quarterly.
- **Burnout**: this is a 12-24 month project. If you can't commit, monetize less aggressively but don't try to shortcut.

## Time investment honest estimate

- Setup (already done): 0 hours (this codebase).
- Pre-launch (week 1): 8-12 hours.
- Launch (week 2): 6 hours of writing posts, replying.
- Ongoing: 4-8 hours/week to add 1-2 recipes + 1 tool refresh.

For 4-8 hours/week you build an asset that, if it works, sells for 30-40× monthly revenue on Empire Flippers when you're ready to exit.
