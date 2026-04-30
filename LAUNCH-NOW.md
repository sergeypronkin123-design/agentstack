# 🚀 LAUNCH NOW — 30 минут от zip-а до live-сайта

Это сжатый чек-лист. Подробная версия в `docs/LAUNCH-CHECKLIST.md`. Здесь — только команды на копи-пейст.

---

## Что нужно для запуска

- **$12** — на домен.
- **GitHub-аккаунт** (бесплатный).
- **Cloudflare-аккаунт** (бесплатный).
- **30 минут** времени.

---

## Шаг 1 — распаковать и собрать (5 мин)

```bash
# 1.1 Распакуйте agentstack-v3.zip в любой каталог
cd path/to/agentstack

# 1.2 Установите зависимости (1-2 мин на современном железе)
npm install

# 1.3 Соберите сайт локально, чтобы убедиться что всё работает
npm run build

# 1.4 Откройте превью на http://localhost:4321
npm run preview
```

Проверьте: сайт открывается, видны страницы tools/, recipes/, compare/. Закройте превью (Ctrl+C).

---

## Шаг 2 — купить домен (5 мин)

1. Откройте [cloudflare.com/products/registrar](https://www.cloudflare.com/products/registrar/).
2. Найдите свободный — рекомендую один из:
   - `agentstack.dev` ★
   - `aitooling.dev`
   - `aicode.tools`
   - `agentdir.io`
3. Купите за ~$10-12. **Не забудьте включить free auto-renew** (домены с просроченной оплатой убивают SEO).

---

## Шаг 3 — обновить домен в коде (1 мин)

Замените `agentstack.dev` на ваш реальный домен:

```bash
# macOS / Linux:
sed -i.bak 's|agentstack\.dev|YOUR-DOMAIN.dev|g' astro.config.mjs public/robots.txt

# Windows PowerShell:
(Get-Content astro.config.mjs) -replace 'agentstack\.dev','YOUR-DOMAIN.dev' | Set-Content astro.config.mjs
(Get-Content public/robots.txt) -replace 'agentstack\.dev','YOUR-DOMAIN.dev' | Set-Content public/robots.txt
```

Проверьте: `grep agentstack astro.config.mjs` ничего не возвращает.

---

## Шаг 4 — GitHub repo (5 мин)

```bash
# 4.1 Если у вас GitHub CLI:
gh auth login
gh repo create agentstack --public --source=. --push

# 4.2 Альтернативно через web:
# - Идите на https://github.com/new
# - Создайте public repo "agentstack"
# - Локально:
git init -b main
git add .
git commit -m "initial commit"
git remote add origin git@github.com:YOUR_USER/agentstack.git
git push -u origin main
```

**Public repo обязательно** — иначе GitHub Actions кончатся через 2000 минут. На public — неограниченно.

---

## Шаг 5 — Cloudflare Pages (5 мин)

1. Идите на [pages.cloudflare.com](https://pages.cloudflare.com/) → **Create project** → **Connect to Git**.
2. Выберите ваш repo `agentstack`.
3. Build settings:
   ```
   Framework preset: Astro
   Build command:    npm run build
   Build output:     dist
   Node version:     20
   ```
4. Save and Deploy. Подождите 2 минуты.
5. Появится preview URL `agentstack-XXX.pages.dev`. Откройте — сайт живой.

---

## Шаг 6 — подключить ваш домен (3 мин)

В Cloudflare Pages:

1. Settings → **Custom domains** → **Set up a custom domain**.
2. Введите `your-domain.dev`.
3. Cloudflare сам создаст CNAME (если домен в их DNS).
4. SSL включится автоматически за 1-2 минуты.

Откройте `https://your-domain.dev` — должно работать. Поздравляю, сайт онлайн.

---

## Шаг 7 — repo secrets для CI (3 мин)

GitHub repo → Settings → Secrets and variables → Actions → **New repository secret**:

1. `CF_API_TOKEN` — на Cloudflare → My Profile → API Tokens → **Create Token** → шаблон **"Edit Cloudflare Pages"** → Continue → Create. Скопируйте значение.
2. `CF_ACCOUNT_ID` — на главной Cloudflare справа в панели увидите Account ID. Скопируйте.

Теперь каждый push в `main` авто-деплоит сайт через `.github/workflows/deploy.yml`.

---

## Шаг 8 — индексация в Google и Bing (3 мин)

1. **[Google Search Console](https://search.google.com/search-console)** → Add property → **Domain** → `your-domain.dev` → verify через DNS-record (Cloudflare сделает сам в 1 клик).
2. **Sitemaps** в Search Console → Add → `https://your-domain.dev/sitemap-index.xml`.
3. **[Bing Webmaster Tools](https://www.bing.com/webmasters)** → Sites → Add → можно импортировать из Search Console одной кнопкой.

---

## Шаг 9 — аналитика (1 мин)

В Cloudflare Pages → Settings → **Web Analytics** → Enable. Бесплатно, privacy-friendly. Без трекинга, но узнаете traffic.

---

## ✅ Готово. Что дальше?

Всё, сайт онлайн и работает автоматически:

- ✅ **Каждый день 04:00 UTC** — health-check всех URL.
- ✅ **Каждый день 06:00 UTC** — refresh GitHub stars.
- ✅ **Каждый понедельник** — pricing-tracker + newsletter draft в GitHub Issues.
- ✅ **Каждую среду** — discovery новых tools.
- ✅ **На каждый push в main** — деплой и SEO-аудит.

**Ваше участие**: открыть `dashboard.html` (запустить `npm run dashboard:open`) раз в день, отреагировать на GitHub Issues, опубликовать 1 рецепт в неделю.

---

## Что делать в первую неделю (Phase 1 из docs/LAUNCH-CHECKLIST.md)

1. **Show HN post** во вторник или среду 09:00 ET. Шаблон в LAUNCH-CHECKLIST §1.1.
2. **Reddit** в r/programming, r/webdev, r/LocalLLaMA. Не копируйте идентично.
3. **Twitter thread** из 7 твитов. Шаблон в LAUNCH-CHECKLIST §1.3.
4. **dev.to crosspost** одного рецепта с canonical URL на ваш сайт.
5. **5 PR в awesome-list** GitHub-ы.

Цель week 1: **1k-3k visitors**. Это база для всего дальнейшего.

---

## Если что-то не работает

- **Build падает** → проверьте Node ≥ 20: `node --version`.
- **Cloudflare Pages не находит build output** → точно укажите `dist` (не `out` или `build`).
- **Custom domain не привязывается** → проверьте, что домен в Cloudflare DNS, а не у другого провайдера.
- **Health-check всё красное** → это OK на момент первого запуска до GitHub Actions; запустится завтра в 04:00 UTC.
- **GitHub Action падает** → проверьте Actions tab, скорее всего secrets не выставлены.

---

## Когда подключать монетизацию

- **Carbon Ads**: при ~5,000 visitors/мес. Apply в [carbonads.net/about](https://www.carbonads.net/about). 3-7 дней одобрение.
- **Affiliate-программы**: можно сразу — Tabnine на impact.com, Copilot через Microsoft Affiliate Network.
- **Sponsored slots**: при ~25,000 visitors/мес. Vendor-ы сами начнут писать.
- **Premium tier**: при ~50,000 visitors/мес.

Подробнее в `docs/MONETIZATION.md`.

---

## Tracking стартовых метрик (week 1)

Заведите простую табличку (можно в дашборде, можно в Notion):

| День | Unique visitors | Email subs | GitHub Issues | RSS |
|---|---|---|---|---|
| 1 (launch) | ? | 0 | 0 | 0 |
| 7 | ? | ? | ? | ? |

Если на день 7 **меньше 200 visitors** — пересмотрите промо-стратегию (мало кто увидел Show HN, или плохо сформулирован).

Если **больше 5000** — вы попали в фронт-страницу HN, готовьтесь к нагрузке (Cloudflare Pages выдержит, но email-сервер newsletter-а может).

---

**Запустили? Дайте знать — следующий шаг будет про удвоение трафика.**
