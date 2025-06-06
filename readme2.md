# readme2.md — 2025‑04‑23

---

## Section 1 – Original Highlights (README.md)
- Vite + React + TS, Tailwind, Zustand, Firebase Realtime DB.
- Features: Catalog, cart, auth, admin dashboard.
- i18n with react-i18next.
- Basic setup instructions, Firebase config, admin creds.

---

## Section 2 – Upgraded README (Complete)

### 🚀 Project Overview
Sunlight Supply 2.1 introduces rich product pages, faceted search, offline PWA, and an AI‑powered FAQ chatbot — all while staying on the Firebase Spark plan.

### 📦 Tech Stack (pinned)
| Layer | Package | Version |
|-------|---------|---------|
| Build | Vite | ^5.0.0 |
| UI | React 18, TypeScript 5 | N/A |
| Styling | Tailwind CSS ^3.4 |
| State | Zustand ^4.4 |
| Search | Fuse.js ^6.6 |
| SEO | react‑helmet‑async ^1.3 |
| Images | react‑lazyload ^3.2 |
| PWA | vite-plugin-pwa ^0.16 |
| Testing | Jest ^29, React Testing Library ^14, Cypress ^13 |
| CI | GitHub Actions, Lighthouse CI ^0.12 |

### 🗂️ Project Structure (excerpt)
```
src/
├─ pages/
│  ├─ ProductDetail.tsx        # new
├─ components/
│  ├─ chat/ChatWidget.tsx      # new
│  ├─ ui/ColorSwatch.tsx       # new
│  └─ ui/ImageLazy.tsx         # new
├─ hooks/
│  └─ useProductSearch.ts      # new
├─ data/faq.json               # new
├─ manifest.webmanifest        # PWA manifest
...
```

### 🔧 Setup Instructions
```bash
# 1. Clone & install
npm install

# 2. Copy env vars
cp .env.example .env
# (fill Firebase keys, see docs)

# 3. Dev server
npm run dev

# 4. Lint & tests
npm run lint && npm test

# 5. E2E
npx cypress open
```

### 🌐 Firebase Setup
Same as previous; no Cloud Functions required. Ensure database structure:
```jsonc
{
  "products": {},
  "orders": {},
  "faq": {} // optional future sync
}
```
Rules stay unchanged.

### 🛠️ Build & Deploy
```bash
# Build
npm run build

# Preview deploy (GitHub PR)
Firebase CLI automatically deploys to channel
```

### 🤖 AI Chatbot
- Works completely client‑side with Fuse.js.
- FAQ content in `src/data/faq.json` (EN/TH keys).
- No external API keys needed.

### 🔍 SEO & PWA
- Meta tags via `react-helmet-async`.
- Service worker & manifest generated by vite-plugin-pwa.

### 👩‍🔬 Testing
- Unit tests: `npm test`
- E2E: `npm run cypress:run`
- Lighthouse CI runs in GitHub Action — budgets in `lhci.yml`.

### 💡 Contribution Workflow
1. `git checkout -b feat/<scope>`
2. Commit following Conventional Commits.
3. Push & open PR — CI must pass (lint, test, Lighthouse).
4. Merge squashes to `main` → auto deploy to prod.

---

## Section 3 – Comparison Notes
- Added PWA, SEO, AI Chat setup instructions.
- Replaced "Realtime DB" emphasis with generic Firebase since no backend change.
- Added version table & new commands.
- Clarified CI requirements & budgets.
