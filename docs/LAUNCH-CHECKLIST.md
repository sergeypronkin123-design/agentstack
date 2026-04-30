# Launch Checklist — от 0 до первого дохода

Один master-документ. Делаете шаги по порядку, не пропуская. Каждый шаг помечен ⏱ временем и [💰=влияет на доход / 🔧=техническое / 📣=трафик].

Шкала ожиданий по доходу — реалистичная, не маркетинговая:
- День 1-30: **$0**. Вы строите.
- День 30-90: **$0-50/мес**. Возможны первые affiliate-копейки.
- Месяц 3-6: **$50-500/мес** если всё идёт по плану.
- Месяц 6-12: **$200-1500/мес** при еженедельном контенте.
- Месяц 12-24: **$1500-8000/мес** возможно. Половина проектов в нише не доходит.

---

## Phase 0 — TODAY (90 минут, $12 расходов)

Сегодня вы выводите сайт в онлайн. Без трафика, без денег, но в зоне «существует и индексируется Google».

### 0.1 ⏱5 мин · 🔧 · Купить домен

[Cloudflare Registrar](https://www.cloudflare.com/products/registrar/) — at-cost $10-12/год для `.dev`. Альтернативы: Porkbun, Namecheap.

Доступные кандидаты на момент написания (проверьте свежесть):
- `agentstack.dev` ★ рекомендую
- `aitooling.dev`
- `aistack.directory`
- `aicode.tools`
- `agentdir.com`

**Действие**: купите ОДИН, добавьте Cloudflare DNS если ещё не там.

### 0.2 ⏱5 мин · 🔧 · Обновить domain в коде

```bash
# в astro.config.mjs замените site:
sed -i.bak "s|https://agentstack.dev|https://YOUR-DOMAIN.dev|" astro.config.mjs
sed -i.bak "s|https://agentstack.dev|https://YOUR-DOMAIN.dev|" public/robots.txt
```

### 0.3 ⏱10 мин · 🔧 · GitHub repo

```bash
# В директории agentstack/
git init
git add .
git commit -m "initial commit"
gh repo create agentstack --public --source=. --push
# или через web UI на github.com/new
```

Публичный repo важен: `actions/minutes` тогда бесплатные неограниченно.

### 0.4 ⏱20 мин · 🔧 · Cloudflare Pages

1. Идите на [pages.cloudflare.com](https://pages.cloudflare.com/) → Create project → Connect to GitHub → выбрать ваш repo.
2. Build settings:
   - Framework preset: **Astro**
   - Build command: `npm run build`
   - Build output: `dist`
   - Node version: `20`
3. Deploy. Должен появиться preview URL `agentstack-XXX.pages.dev`.
4. Custom domain: Pages → Custom domains → Add → ваш домен. Cloudflare сам добавит CNAME.

После: `https://YOUR-DOMAIN.dev` показывает сайт.

### 0.5 ⏱5 мин · 🔧 · Repo secrets для CI

В GitHub → repo → Settings → Secrets and variables → Actions:

- `CF_API_TOKEN` — создать в Cloudflare → My Profile → API Tokens → Create → template "Edit Cloudflare Pages".
- `CF_ACCOUNT_ID` — Cloudflare home → правая панель → Account ID.

Это нужно для `.github/workflows/deploy.yml` (деплой на каждый push).

### 0.6 ⏱5 мин · 📣 · Google Search Console

1. [search.google.com/search-console](https://search.google.com/search-console)
2. Add property → Domain → введите `your-domain.dev`.
3. Verify через DNS-record (Cloudflare сделает в 1 клик).
4. Submit sitemap: `https://your-domain.dev/sitemap-index.xml`.
5. Bing Webmaster Tools — то же самое (5 мин).

### 0.7 ⏱5 мин · 📣 · Plausible или Cloudflare Analytics

Бесплатные не-tracking варианты:
- **Cloudflare Web Analytics** — 1 клик включить в Pages settings. Точность ниже Plausible но free.
- **Plausible** — $9/мес, но можно self-host.

Без аналитики не узнаете, что работает.

### 0.8 ⏱30 мин · 📣 · Полировка перед первой волной трафика

- [ ] Открыть `dashboard.html` локально, проверить что вкладка SEO зелёная.
- [ ] Перечитать **3 топ-recipes** глазами читателя. Если в Hacker News заплюют — почему? Поправьте.
- [ ] Запустить `npm run auto:health-check` и `npm run auto:seo-audit` — все ✓.
- [ ] Сделать OG image вручную в Figma (1200×630, ваш бренд) и положить в `public/og-default.png`. Без этого ссылки в Twitter выглядят пустыми.

### 0.9 ⏱5 мин · 📣 · Profile на платформах

Создать (или зарезервировать имя):
- [ ] Twitter/X handle `@YourBrand` (даже если не будете писать сразу — кто-то выкупит)
- [ ] dev.to аккаунт
- [ ] Indie Hackers профиль с описанием проекта

**Phase 0 итог**: сайт онлайн, индексируется, готов к промо. Расходов: $12. Времени: 90 мин.

---

## Phase 1 — WEEK 1 (4-6 часов, $0)

Цель: получить первые **1000-3000 уникальных посетителей** за неделю.

### 1.1 ⏱30 мин · 📣 · Show HN post

Напишите пост по этому шаблону. Делать **во вторник или среду 09:00 ET** (это эмпирически лучше для HN).

```
Show HN: AgentStack — independent directory of AI coding agents

Frustrated by sponsored "best AI coding tools" articles, I built a site
that auto-refreshes facts daily from public sources (GitHub API for OSS,
official pricing pages for proprietary).

11 tools indexed, 7 hand-written recipes for stacking them. No pay-for-rank,
no AI slop articles.

Useful pages:
- Cursor vs Claude Code decision tree: ...
- Air-gapped Cline + Ollama setup: ...
- Migrating Copilot → Cursor checklist: ...

Hopefully helpful, feedback welcome.
```

Линк ставьте на самую полезную страницу, не на homepage.

### 1.2 ⏱20 мин · 📣 · Reddit cross-post

- r/programming
- r/webdev
- r/LocalLLaMA (для local-only рецепта)
- r/learnprogramming (для бюджет-гайда)

Не копируйте идентично везде — Reddit банит за это. Перепишите вступление под subreddit.

### 1.3 ⏱30 мин · 📣 · Twitter/X thread

7 твитов max. Шаблон:

```
1/ Spent the weekend benchmarking AI coding tools.
   Notes: 🧵

2/ Cursor's autocomplete is still better than Copilot's despite
   recent updates. But for multi-file refactors, Claude Code wins
   ~70% of the time on my codebase.

3/ Cline + local Qwen 3 Coder 32B is good enough for 80% of tasks
   if you have 64GB+ RAM. Cost: $0/mo + electricity.

4/ The MCP server ecosystem is the actual story of 2026. Linear MCP
   alone saves me 30 min/day.

5/ Aider is criminally underrated. As a pre-commit hook fixing lint
   automatically, it's essentially free leverage.

6/ ...

7/ Wrote everything up: agentstack.dev (no signup wall, no popups)
```

### 1.4 ⏱45 мин · 📣 · dev.to crosspost (с canonical)

Скопируйте ваш лучший recipe (`cursor-vs-claude-code-when.mdx`) на dev.to. **Set canonical URL** на ваш сайт — Google credits ваш домен, не dev.to.

### 1.5 ⏱30 мин · 📣 · Awesome-list PRs

GitHub-ы вроде [awesome-llm-coding-tools](https://github.com/topics/awesome-llm) принимают PR с добавлением вашего сайта. 5 PR за полчаса. Когда их сольют — это quality backlinks для SEO.

### 1.6 ⏱60 мин · 📣 · Submit на directories

- [Product Hunt](https://www.producthunt.com/posts/new) — стандартный launch
- [There's An AI For That](https://theresanaiforthat.com/) — submission form
- [Indie Hackers](https://indiehackers.com) — Show IH post
- [Hacker News /show](https://news.ycombinator.com/show)
- [Founders Network](https://www.foundersnetwork.com/) (если подходите)

### 1.7 ⏱30 мин · 💰 · Email-capture от первого дня

Без списка email-ов вы зависите 100% от Google. Решение: бесплатный beehiiv или Substack.

1. Регистрация на [beehiiv.com](https://www.beehiiv.com/) (free до 2500 subs).
2. Получить embed snippet.
3. Добавить в `src/components/Footer.astro` или новый компонент `NewsletterSignup.astro` — у вас уже есть `auto-newsletter.mjs` который генерит для них контент.

Цель week 1: 50 подписчиков.

### 1.8 ⏱5 мин · 🔧 · Включить все авто-workflow

В GitHub repo → Actions: убедитесь что все 7 workflow зеленые. Они автоматически:
- Daily refresh tools (06:00 UTC)
- Daily health check
- Weekly discovery (среда)
- Weekly pricing (понедельник)
- Weekly newsletter (понедельник)
- Auto-tweet on recipe push (если ключи)
- Deploy on push to main

**Phase 1 итог**: 1k-3k visitors, 50+ email-подписчиков, 5 backlinks.

---

## Phase 2 — MONTH 1-2 (4-6 часов / неделю)

Цель: достичь **5k visitors/мес** для квалификации в Carbon Ads.

### 2.1 ⏱2-3 часа/неделя · 📣 · Контент-cadence

**Неделя**: 1 новый recipe + 1 обновление tool страницы.

Идеи рецептов которые traffic-ят (long-tail SEO):
- "[Tool] config for [framework]" — Cursor for Next.js, Cline for Django, etc.
- "[Tool] vs [Tool] for [use case]" — beyond the basic comparisons
- "Migrating from [old workflow] to [new]"
- "Setting up [Tool] on [OS-specific issue]"
- "How to debug [common error] in [Tool]"

Используйте `npm run gen:comparison <a> <b>` для базы каждого comparison-recipe, потом hand-edit.

### 2.2 ⏱30 мин · 📣 · Добавить 5 tools

Нужно ≥ 15 tool-страниц для serious traffic. Добавьте по шаблону в `src/content/tools/`:
- Codeium / Tabnine
- Sourcegraph Cody
- Replit Agent
- Bolt.new
- v0.app или Lovable

Каждый занимает 30 мин чтобы заполнить честно.

### 2.3 ⏱20 мин · 📣 · Обработать GitHub Issues от автоматизации

Каждую неделю боты открывают issues:
- "Discovery: 3 new candidates" — review, добавьте 1-2 в tools.
- "Pricing changes detected" — verify, обновите JSON.
- "Health check: broken URL" — fix.
- "Newsletter draft" — отредактируйте, paste в beehiiv.

5 минут на каждый, ~5 issues/неделя = 25 минут.

### 2.4 ⏱20 мин · 📣 · Send weekly newsletter

Каждый понедельник:
1. GitHub Issues → ищите свежий newsletter draft.
2. Скопируйте md.
3. Откройте beehiiv → New post → paste.
4. Отредактируйте «Curated reads» — 2-3 внешних статьи которые читали за неделю.
5. Send.

Это 20 мин раз в неделю и держит aудиторию engaged.

### 2.5 ⏱60 мин · 💰 · Apply to Carbon Ads

**Когда**: через ~5k unique visitors/мес (можно проверить в Cloudflare Analytics).

1. Apply at [carbonads.net/about](https://www.carbonads.net/about). Они хотят: site URL, traffic stats, audience description.
2. Pitch: "AgentStack is an independent directory of AI coding tools, audience is professional developers, daily-updated facts, no AI-generated content."
3. Approval 3-7 дней.
4. Получите snippet `<script ... carbon.js?serve=ABC&placement=YOUR>`. Скопируйте `serve` и `placement` IDs.
5. Откройте `src/components/AdSlot.astro`, замените `YOUR_CARBON_KEY` и `AGENTSTACK_PLACEMENT`.
6. В Cloudflare Pages → Settings → Environment variables → add `PUBLIC_ADS_ENABLED=true`.
7. Push → live.

**Доход**: 5k × $35 CPM × 1 ad = ~$175/мес. Растёт с трафиком линейно.

### 2.6 ⏱30 мин · 💰 · Affiliate-links

Применитесь к программам, которые вам реально подходят:

- **Tabnine** — [impact.com](https://impact.com), 20% recurring. Auto-approve.
- **GitHub Copilot** — [Microsoft Affiliate Network](https://affiliate.microsoft.com/), 5-10%. Approval ~2 нед.
- **Codeium / Cursor** — DM команд через Twitter/email.
- **Notion** (для recipes о productivity) — [Notion Affiliate](https://www.notion.so/affiliates), 50% first year.

Когда получите ссылки — заполните `affiliate_url` в соответствующих `src/content/tools/<slug>.json`.

### 2.7 ⏱30 мин · 💰 · Disclosure (требование закона!)

Уже сделано в `src/pages/about.astro` (`#disclosure` section). Проверьте что:
- На каждой странице с affiliate-кнопкой есть микро-надпись "*Affiliate link*".
- В footer есть ссылка на `/about#disclosure`.

Без этого — штрафы FTC (US) или DSA (EU).

**Phase 2 итог**: 5k+ visitors/мес, Carbon Ads активен (~$50-200/мес), 2-3 affiliate программы.

---

## Phase 3 — MONTH 3-6 (2-4 часа / неделю)

Цель: **20k+ visitors/мес**, **$300-1500/мес** доход.

### 3.1 · 📣 · Контент scale

- 1-2 рецепта в неделю + 1 tool в неделю.
- Должно набраться 30-50 страниц к месяцу 6.
- Если автоматизация находит горячие темы (через discovery) — приоритет им.

### 3.2 · 📣 · Backlink campaign

- Pitch гостевые посты на dev-сайты — Smashing Magazine, CSS-Tricks, Dev.to top blogs.
- Coordinated tweets с инфлюенсерами в AI-tooling нише.
- Quote-tweet статьи людей с правильным контекстом — авторы часто ретвитают.

### 3.3 · 💰 · YouTube-companion

Каждый пятый recipe = короткое (5-7 мин) видео. Schema.org `VideoObject` + ссылка с YT в описание ведёт на site. Бесплатный канал traffic.

### 3.4 · 💰 · Premium tier (опционально)

Если есть >1k email-подписчиков и >25k visitors:
- Pro tier $9/мес: change-alerts по выбранным tools, спецификации в csv-export.
- Setup: Stripe + Cloudflare Worker для entitlements. ~1 день работы.

Не делайте раньше времени — слишком много support-burden до достижения масштаба.

### 3.5 · 💰 · Sponsored slots (после ~25k visitors)

Vendor-ы будут писать. Правила:
- Sponsored *чётко помечен* badge-м "Sponsored".
- Не редактируете honest review за деньги. Vendor либо принимает текущий обзор — либо нет.
- $99-499/мес/слот, обычно 3 слота max.

### 3.6 · 💰 · ProductHunt re-launch (для второго пика)

Через 6 месяцев после первого launch-а — relaunch как «AgentStack v2» с major-обновлением (например, "30 tools indexed, 50 recipes"). Получите ещё одну волну.

**Phase 3 итог**: $300-1500 MRR, 20k+ visitors/мес, 3-5 affiliate-партнёрств.

---

## Phase 4 — MONTH 6-12 (1-3 часа / неделю)

Если предыдущие фазы успешны:

### 4.1 · 💰 · Audience-product fit

Какие 5 ваших рецептов получают 50% трафика? Удваивайте на эти темы. Что не работает — заархивируйте, не выбрасывайте.

### 4.2 · 💰 · Newsletter-monетизация

При 1k+ subscribers:
- beehiiv Boost (paid acquisition) — кто-то платит чтобы попасть в ваше письмо.
- Sponsored newsletter slot — $50-200 за upcoming issue.

### 4.3 · 📣 · Annual report

«State of AI Coding Tools 2027» — публикуете в декабре. Если хорошо — earned media (TechCrunch / The Verge / dev.to top). Это разово, но удваивает ваш subscriber base за квартал.

### 4.4 · 💰 · Exit-опции

При $5k+ MRR consistent 6+ месяцев:
- **Hold**: 90%+ маржа, удобно.
- **Sell на [Empire Flippers](https://empireflippers.com/)**: 30-40× monthly revenue. $5k MRR → ~$180k.
- **Acquihire**: vendor в нише покупает за contentS + audience. Реже, но больший multiple.

---

## Чек-лист «делать каждый день / неделю / месяц»

### Каждый день (5 мин утром)
- [ ] Открыть dashboard.html
- [ ] Гляну на «Что нужно сделать сегодня»
- [ ] Если что-то красное — реагирую (5-10 мин)

### Каждую неделю (~2-3 часа)
- [ ] Понедельник: отправить newsletter (GitHub Issue → beehiiv) — 20 мин
- [ ] Среда: review discovered tools — 15 мин
- [ ] Четверг: написать новый recipe — 90-120 мин
- [ ] Пятница: 1 пост в Twitter/X — 15 мин

### Каждый месяц (~30 мин)
- [ ] Cloudflare Analytics: что выросло, что упало
- [ ] Search Console: новые impressions / clicks / queries
- [ ] Carbon Ads dashboard: revenue trend
- [ ] Поправить top-3 страницы где CTR низкий

---

## Реалистичные riski

| Риск | Митигация |
|---|---|
| Google AI-content penalty | Каждый recipe hand-edited, никогда не публикуйте чистую AI-выдачу |
| Конкуренты клонируют | Скорость свежести данных + original benchmarks (Phase 4.3) |
| Tool-рынок резко меняется | Auto-discovery + ваш ритм обновлений ловит |
| Burn-out | Это 12-24 мес проект. Если будете уставать на месяце 2 — лучше сразу slowdown до 1 recipe/2 недели чем бросить |
| Никогда не дойдёт до 5k visitors | ~50% niche-сайтов не дотягивают. План B: продать domain + контент за $1-3k если хотя бы 200 visitors/мес есть |

---

## Минимальный набор «сделал и живёт»

Если просто делать **5 минут утром (dashboard) + 2 часа в субботу (1 новый recipe + 1 промо-пост)**, проект выживает.

Меньше этого — не выживет. Больше — ускорится. Прямой пропорции часы↔доход нет; есть пороговые эффекты (5k visitors для Carbon, 25k для sponsored).

---

## Вопросы которые часто задают (FAQ)

**Q: Можно ли опубликовать сейчас, до Phase 0.8 polish?**
A: Можно. Но поправьте OG image хотя бы — ссылки в Twitter без него выглядят пусто и убивают CTR.

**Q: Почему не использовать Vercel вместо Cloudflare?**
A: Можно. Cloudflare Pages бесплатнее (без bandwidth-лимитов на free tier). Vercel = удобнее DX, но платный после ~100GB/mo.

**Q: Когда начну зарабатывать?**
A: Первый affiliate $: месяц 2-3. Первые ad-доллары: месяц 3-4 после Carbon одобрения. Стабильные $500/мес: месяц 6-12 *если* поддерживаете cadence.

**Q: А если я брошу через месяц?**
A: Сайт умрёт за полгода. Domain reusable, опыт не пропадёт, но MRR будет $0.

**Q: Есть ли способ ускорить?**
A: Платный traffic — Google Ads / Twitter Ads / sponsored newsletters. Но CAC обычно > LTV в этой нише первые 6 месяцев. Не ускоряет, ускоряет burn-rate.

**Q: А за SEO самому идти стоит ли?**
A: Базовое уже сделано (sitemap/schema/canonical/robots). Хочется большего? Прочитайте Backlinko или Ahrefs blog. Не трогайте «SEO-эксперта за $1000/мес» — большинство впустую.
