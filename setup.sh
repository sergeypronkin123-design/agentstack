#!/usr/bin/env bash
# AgentStack — interactive setup helper.
# Не магически развёртывает всё, но валидирует окружение и подсказывает следующие шаги.

set -e

echo "════════════════════════════════════════════════════"
echo "    AgentStack setup helper"
echo "════════════════════════════════════════════════════"
echo ""

# 1. Node.js version
if ! command -v node >/dev/null 2>&1; then
  echo "✗ Node.js не найден. Установите Node 20+: https://nodejs.org"
  exit 1
fi
NODE_VER=$(node -v | sed 's/v//' | cut -d. -f1)
if [ "$NODE_VER" -lt 20 ]; then
  echo "⚠ Node $NODE_VER слишком старый. Нужен 20+. Установите через nvm."
  exit 1
fi
echo "✓ Node.js $(node -v)"

# 2. npm install
if [ ! -d "node_modules" ]; then
  echo ""
  echo "→ Устанавливаю зависимости (npm install)…"
  npm install
fi
echo "✓ Dependencies installed"

# 3. Try a build
echo ""
echo "→ Пробую `npm run build`…"
if npm run build 2>&1 | tail -5; then
  echo "✓ Build OK"
else
  echo "✗ Build failed. Проверьте лог выше."
  exit 1
fi

# 4. Generate dashboard
echo ""
echo "→ Генерирую dashboard.html…"
npm run dashboard

# 5. Health check (no-fail mode)
echo ""
echo "→ Health-check всех URL…"
node scripts/auto-health-check.mjs || echo "  (some issues — см. .automation/state.json)"

# 6. Suggested next steps
echo ""
echo "════════════════════════════════════════════════════"
echo "    Следующие шаги"
echo "════════════════════════════════════════════════════"
echo ""
echo "1. Открыть локально:           npm run dev      → http://localhost:4321"
echo "2. Открыть control-panel:      npm run dashboard:open"
echo ""
echo "3. Чтобы выйти в production:"
echo "   a) Купить домен (Cloudflare Registrar — at-cost)"
echo "   b) Заменить домен в astro.config.mjs (поле site)"
echo "   c) git push — на любой git-host"
echo "   d) Создать Cloudflare Pages project с этим repo"
echo "   e) Submit sitemap в Google Search Console"
echo ""
echo "Полный гайд: docs/LAUNCH-CHECKLIST.md"
echo ""
echo "Удачи."
