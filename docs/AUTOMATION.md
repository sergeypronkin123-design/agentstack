# Automation Reference

8 автоматизационных скриптов + 5 GitHub Actions workflow + 1 Control Center дашборд. Полный конвейер «контент-фабрика» с минимальным участием.

## TL;DR — что происходит автоматически

| Когда | Что | Кем |
|---|---|---|
| Каждый день 04:00 UTC | Health-check всех URL → если broken, открывает GH Issue | `daily-health.yml` |
| Каждый день 06:00 UTC | Refresh stars/last-push → коммит | `daily-refresh.yml` |
| Каждый понедельник 08:00 UTC | Pricing diff → если найдены, GH Issue | `weekly-pricing.yml` |
| Каждый понедельник 10:00 UTC | Newsletter draft → GH Issue с готовым md | `weekly-newsletter.yml` |
| Каждую среду 09:00 UTC | HN/Reddit scan → новые candidate tools → GH Issue | `weekly-discover.yml` |
| Push в `main` (recipe) | Tweet (если ключи) | `on-recipe-publish.yml` |
| Push в `main` | Build + Cloudflare Pages deploy + SEO audit | `deploy.yml` |

Ваше участие: открыть дашборд раз в день, отреагировать на GH Issues которые накопились, опубликовать 1 рецепт в неделю.

## Дашборд (Control Center)

```bash
npm run dashboard:open       # сгенерирует и откроет в браузере
# или
npm run dashboard            # просто пересобрать dashboard.html
```

8 вкладок:
- **Обзор** — KPI + что нужно сделать сегодня (вычисляется на лету) + последние запуски автоматизации.
- **Инструменты** — таблица 11 tools с свежестью, GH stars, refresh-кнопкой.
- **Рецепты** — карточки опубликованного.
- **Pipeline** — очередь идей, драфты на ревью, авто-обнаруженные кандидаты + UI генератора A-vs-B.
- **Автоматизация** — статус каждого из 8 скриптов с last-run и cron.
- **SEO** — чек-лист всех seo-фич.
- **Доход** — статус каждого из 4 потоков (Carbon Ads / Affiliate / Sponsored / Premium).
- **Задачи** — checkbox-список недели.

Каждая кнопка `📋` копирует команду в буфер. Запускаете в терминале — выполняется.

## 8 автоматизационных скриптов

### `npm run refresh` (или `-- <slug>` для одного)
GitHub API → stars, last_push, license. Обновляет `last_verified` на сегодня.
Уже есть в проекте с предыдущей итерации.

### `npm run auto:discover`
Сканирует HN front-page (top-100) + r/programming + r/LocalLLaMA. Ищет упоминания AI-coding tool-keywords + извлекает имена через regex `Show HN: ToolName`. Сохраняет кандидаты в `.automation/state.json` под `discovered_tools`.

Новые кандидаты появляются на дашборде в **Pipeline → Автообнаруженные tools**. GH Action открывает issue.

### `npm run auto:pricing-check`
Скачивает homepage/docs каждого инструмента, regex-ом ловит `$XX/mo`, сравнивает с stored ценой в JSON. При расхождении ≥ $1 — записывает в `pricing_changes` + GH Issue.

Это не парсер DOM. Возможны false-negatives при перевёрстке. Лучше пропустить, чем ложно сигналить.

### `npm run auto:health-check`
HEAD-запрос на homepage / docs / repo / affiliate каждого инструмента. Все non-2xx и timeout — в `health_issues` + GH Issue. Падает CI с exit-1 на наличие issues.

### `npm run gen:comparison <a> <b>`
Генерирует MDX-draft `<a>-vs-<b>-deep-dive.mdx` в `src/content/recipes/`. Заполняет: TL;DR, side-by-side таблицу, pros/cons обеих сторон, decision tree, FAQ-stub.

Это **draft, не финал** — разделы помечены TODO для ваших правок. После hand-edit и commit → деплой.

### `npm run auto:newsletter`
Собирает recipes за последние 7 дней + pricing-changes + tool-snapshot. Записывает md в `.automation/newsletter/<YYYY-WNN>.md`. Hand-edit «Curated reads» секцию, потом paste в beehiiv/Substack.

### `npm run auto:tweet [<recipe-slug>]`
Без аргумента — постит все recipes за последние 7 дней. С аргументом — конкретный.
В DRY-RUN режиме без X-API ключей просто печатает что бы запостило.

Real posting требует:
1. `npm i twitter-api-v2`
2. Раскомментировать блок в скрипте.
3. Set секреты `X_API_KEY`, `X_API_SECRET`, `X_ACCESS_TOKEN`, `X_ACCESS_SECRET`.
4. В repo settings → Variables → set `AUTO_TWEET_ENABLED=true`.

### `npm run auto:seo-audit`
После `npm run build` — обходит `dist/`, проверяет каждую html: title-длина, description-длина, один h1, canonical, OG meta. Отчёт в `.automation/seo-report.md`. Падает CI на любые issues.

### `npm run all:weekly`
Прогоняет всю автоматизацию подряд. Использовать когда хочется обновить всё разом.

## State storage

Все скрипты пишут в `.automation/state.json`:

```json
{
  "last_runs": { "discover": { "iso": "2026-04-30T..." }, ... },
  "discovered_tools": [{ "name": "X", "url": "...", "source": "HN" }],
  "pricing_changes": [{ "tool": "X", "old": 19, "new": 25 }],
  "health_issues": [],
  "pipeline": { "drafts": [], "queued_ideas": [] }
}
```

Этот файл коммитится в репо (так workflow-ы шарят состояние). Не git-ignor-ьте.

## Как отключить отдельный workflow

Откройте `.github/workflows/<имя>.yml`, закомментируйте `on.schedule` блок. Или удалите файл.

## Расходы

Все автоматизации работают на бесплатном тире GitHub Actions:
- Free: 2000 минут/мес для приватных репо, неограниченно для публичных.
- Текущий конвейер тратит ~15 минут/мес.

Twitter API — бесплатный тир v2 даёт 500 постов/мес, нам нужно ~10.

Cloudflare Pages — бесплатный тир: 500 builds/мес, мы делаем ~3.

**Итого инфра: $0/мес.**

## Расширения (когда захотите)

- `auto-product-hunt.mjs` — сабмиттер на Product Hunt при достижении milestones.
- `auto-google-discover.mjs` — pings Search Console после деплоя для re-index.
- `auto-broken-link.mjs` — ходит по сайту и тестит все internal-links.
- `auto-og-image.mjs` — генерирует OG-PNG для каждой страницы через @vercel/og.
- `auto-pr-review.mjs` — Claude Code agent для review PR-ов.

Подсказка: добавление каждого нового скрипта = ~30 строк копипаста с изменением логики. Pattern уже устоялся.
