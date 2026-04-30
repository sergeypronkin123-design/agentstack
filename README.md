# AgentStack

Independent directory and recipe book for AI coding tools. Built to be the most-current, least-sponsored source on Cursor / Claude Code / Cline / Aider / Continue / Windsurf / Zed AI / Copilot / Roo / Kilo / OpenCode.

## What you get

- **10 tool review pages**, daily-refreshed via GitHub Action.
- **6 starter recipes** (multi-tool workflows).
- **45 auto-generated comparison pages** (every pairing).
- Full SEO: sitemap, RSS, schema.org, OG meta.
- Cloudflare Pages deploy config.
- Carbon Ads slot ready (set `PUBLIC_ADS_ENABLED=true` after approval).

## Quick start

```bash
npm install
npm run dev
# → http://localhost:4321
```

Build:

```bash
npm run build         # outputs to dist/
npm run preview       # serve locally
```

## Customize

1. **Domain**: edit `astro.config.mjs` → `site:` field.
2. **Brand**: edit `src/components/Header.astro` and `public/favicon.svg`.
3. **GitHub repo for issues**: edit `src/pages/about.astro`.
4. **Affiliate links**: in each `src/content/tools/*.json`, set `affiliate_url` if you have a deal with the vendor.

## Deploy

The included GitHub Action deploys to Cloudflare Pages on every push to `main`.
You'll need:
- A Cloudflare account (free tier works).
- Two repo secrets: `CF_API_TOKEN` and `CF_ACCOUNT_ID` (see Cloudflare → My Profile → API Tokens).
- Push to `main` → auto-deploy.

Alternative: works on Vercel, Netlify, GitHub Pages without changes (it's static).

## Daily refresh

`.github/workflows/daily-refresh.yml` runs at 06:00 UTC. It calls GitHub API for each OSS tool's stars/last-push and updates `last_verified` to today. If anything changed, it commits.

To run manually:

```bash
npm run refresh                 # all tools
npm run refresh -- claude-code  # one tool
```

## Where the actual value lives

→ Read `docs/PLAYBOOK.md` — week-by-week launch plan.
→ Read `docs/MONETIZATION.md` — exact steps to turn traffic into income.
→ Read `docs/ROADMAP.md` — what to add next once you have data.

## License

Code: MIT. Content: CC BY-SA 4.0 (so others can fork the model but must credit).
