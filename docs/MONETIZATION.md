# Monetization Setup

The site has 4 revenue streams pre-wired. Activate them in this order — each one is unlocked by the previous one's traffic.

## Stream 1: Carbon Ads (primary, after 5k visitors/mo)

Why first: Carbon pays the highest CPM for dev traffic ($30-50) of any major network. Dead simple integration.

### Setup (15 min)

1. Hit ~5,000 monthly visitors (verify in Cloudflare Pages analytics or Plausible).
2. Apply at [carbonads.net](https://www.carbonads.net/about). They want: site URL, traffic stats, audience description.
3. Approval typically 3-7 days for clean dev sites.
4. They send you a snippet like:
   ```html
   <script async type="text/javascript" src="//cdn.carbonads.com/carbon.js?serve=ABC123&placement=YOURSITE" id="_carbonads_js"></script>
   ```
5. Update `src/components/AdSlot.astro` with your real `serve` and `placement` IDs.
6. In Cloudflare Pages env vars, set `PUBLIC_ADS_ENABLED=true`.
7. Push → ad shows up.

### Where ads display

`AdSlot.astro` is reusable. Paste it on:
- Tool detail page sidebar (already in `[slug].astro`)
- Recipe page footer
- Compare page footer

**Don't** put more than 1 ad per page initially. Carbon's network is opinionated about UX — too many ads → they drop you.

### Revenue expectation

- 5k monthly visitors × $35 CPM × 1 ad slot = **~$175/mo**
- 30k monthly visitors → **~$1,000/mo**
- 100k monthly visitors → **~$3,500/mo**

These are realistic numbers for tech-niche audiences. General audience would be 4-10× lower CPM.

## Stream 2: Affiliate links (passive, anytime)

Some of the indexed tools have affiliate programs. When a user clicks through and buys, you get 10-30% recurring or one-time.

### How to add an affiliate link

In `src/content/tools/<tool>.json`:

```json
{
  ...
  "affiliate_url": "https://your-affiliate-link-here"
}
```

The build will use `affiliate_url` in place of `homepage` for the "Visit homepage" button on detail pages, but only when you set this field. Show a 1-line disclosure note above the button (already templated for you in `[slug].astro`).

### Programs worth applying to (verified active 2026)

| Tool | Program | Commission | Notes |
|---|---|---|---|
| Cursor | DM growth team | varies | No public program; reach out |
| GitHub Copilot | MS Partner Network | 5-10% | Approval ~2 weeks |
| Sourcegraph Cody | Direct | varies | Email partnerships@ |
| Codeium | DM team | varies | Smaller but responsive |
| Tabnine | impact.com | 20% recurring | Auto-approve |
| Notion (loose fit) | Notion Affiliate | 50% first year | Easy approval |

For Stripe-based tools without programs, sometimes a simple "founder DM with traffic stats" gets you a custom deal at 15-25%.

### Disclosure (legal requirement!)

You **must** disclose affiliate relationships. Already done in `about.astro` (`#disclosure` section). Add a 1-line "*Affiliate link*" badge next to affiliated buttons — don't hide it.

US FTC, EU under DSA, and most jurisdictions require this. Hiding it = fines and platform bans.

## Stream 3: Sponsored listings (after 25k visitors/mo)

When you have meaningful traffic (~25k/mo), vendors will reach out asking for "featured" placements. Don't sell ranking. Do sell:

- **"Sponsored" badge** in tool listings — clearly marked, $99-499/mo per slot.
- **Sponsored newsletter spot** — if you start a newsletter (via beehiiv) and have ≥1k subscribers.
- **Sponsored recipe** — vendor pays you to write a recipe USING their tool. Mark "Sponsored content" at top of post.

### Hard rules to keep credibility

- Sponsored spots stay clearly marked.
- Editorial reviews stay editorial. A vendor cannot pay to remove cons or change ranking.
- Reject sponsorships from tools you wouldn't recommend regardless.

If you compromise on these, you lose the "honest review site" position that's the whole moat.

## Stream 4: Premium tier (after 50k visitors/mo)

If/when traffic justifies it:

- **$9/mo Pro** — alerts when a tracked tool changes pricing/launches feature, weekly digest, comparison spreadsheet export.
- **$29/mo Team** — usage analytics, prompt-library sharing, internal team page hosting.

Implementation: Stripe Checkout + a tiny FastAPI/Cloudflare Worker for entitlements. Keep server-side simple — don't build CMS or community.

This is realistic only after 50k+ visitors. Below that, conversion to paid will be < 0.5% and the maintenance won't pay off.

## Income mix at scale (rough model, year 2 if successful)

| Stream | Share | Why |
|---|---|---|
| Carbon Ads | 40-55% | Steady, automatic |
| Affiliate | 25-40% | High variance, big upside |
| Sponsorships | 10-20% | Lumpy, requires negotiation |
| Premium | 5-15% | Slow but sticky |

## Tax / legal note

Consult a local accountant. In most jurisdictions you'll need a small business registration once you cross $600/year. Carbon Ads / affiliate networks issue 1099-NEC (US) or equivalent.

If you're outside the US, check whether Stripe Atlas / Mercury or local equivalent makes sense for international payouts.
