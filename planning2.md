# planning2.md — 2025‑04‑23

---

## Section 1 – Original (Key Points from PLANNING.md)

| Topic | Summary |
|-------|---------|
| Objectives | Brand credibility, online ordering, sustainability focus, bilingual EN/TH, SEO & performance goals |
| Tech Stack | Vite + React + TS, Tailwind, Zustand, Firebase (Hosting, Auth, Firestore/Realtime‑DB, Functions), Stripe, Jest/Cypress, GitHub Actions |
| Architecture | SPA with client‑side routing, Firebase backend, i18n with react‑i18next, CI/CD via GitHub Actions → Firebase |
| Performance | Lighthouse ≥ 90, code‑splitting, CDN caching |
| Future Extensions | Multilingual, B2B portal, loyalty, blog, mobile app |

---

## Section 2 – Upgraded Plan (Driven by 2025‑04‑23 Review)

### 2.1 Goals
1. Enhance shopping UX (deep links, rich product pages, faceted search).
2. Improve product presentation (media gallery, color swatches, lazy images).
3. Provide offline/zero‑cost AI FAQ chat support.
4. Maintain Firebase Spark budget & simple hosting.
5. Strengthen CI, testing, and SEO guardrails.

### 2.2 Scope Additions
| Area | New Feature | Deliverables |
|------|-------------|--------------|
| Front‑end | Dedicated **ProductDetail** route (`/product/:id`) | `src/pages/ProductDetail.tsx`, route update, SEO meta tags |
| UI | Color swatch, quantity stepper, comparison table | New components in `src/components/ui/` |
| Search | Client‑side Fuse.js search, sort, pagination | `src/hooks/useProductSearch.ts` |
| Media | Blur‑up lazy images | `ImageLazy.tsx` utility |
| AI Chat | In‑browser FAQ chatbot | `src/components/chat/ChatWidget.tsx`, `src/hooks/useChatStore.ts` |
| PWA | Offline caching | `vite-plugin-pwa` config, `src/manifest.webmanifest` |
| CI/CD | Lighthouse CI, Cypress, Jest | `.github/workflows/ci.yml`, `lhci.yml` |
| Testing | Add tests for new components/hooks | `tests/` mirrored folders |

### 2.3 Updated Architecture Diagram (high‑level)
```
React Router
 ├─ / (Home)
 ├─ /shop (modal opener)
 ├─ /product/:id  <-- NEW PAGE
 └─ /admin/*

Zustand Stores → Firebase Realtime DB
└─ useProducts, useCart, useChatStore

ChatWidget (Fuse.js)  <-- client‑only NLP

CI → GitHub Actions → Firebase Preview/Prod Deploy
          └─ Lighthouse CI, Jest, Cypress, ESLint
```

### 2.4 Dependencies (exact pins)
```jsonc
// package.json – add
"dependencies": {
  "fuse.js": "^6.6.2",
  "react-helmet-async": "^1.3.0",
  "react-lazyload": "^3.2.0",
  "vite-plugin-pwa": "^0.16.4"
},
"devDependencies": {
  "@lhci/cli": "^0.12.0"
}
```

### 2.5 File/Folder Additions
```
src/
├─ pages/
│  └─ ProductDetail.tsx
├─ components/
│  ├─ chat/ChatWidget.tsx
│  ├─ ui/ColorSwatch.tsx
│  └─ ui/ImageLazy.tsx
├─ hooks/
│  └─ useProductSearch.ts
├─ data/faq.json
└─ manifest.webmanifest
```

### 2.6 Implementation Steps
1. **Routing Refactor**
   ```tsx
   // App.tsx inside <Routes>
   <Route path="/product/:id" element={<ProductDetail />} />
   ```
2. **ProductDetail.tsx**
   - Fetch product by id from Zustand store (already synced).
   - Use `Helmet` from `react-helmet-async` for SEO tags.
   - Gallery: main image + thumbnails.
3. **ImageLazy.tsx**
   - Wrapper around `<img loading="lazy" …>` with blur placeholder.
4. **useProductSearch.ts**
   - Build Fuse index on product list; expose `search(query, filters)`.
5. **ChatWidget.tsx**
   - Fuse search over `faq.json`.
   - UI bubbles, history in localStorage.
6. **PWA**
   - Add plugin to `vite.config.ts`:
     ```ts
     import { VitePWA } from 'vite-plugin-pwa';
     export default defineConfig({
       plugins: [VitePWA({ registerType: 'prompt', includeAssets: ['favicon.svg'] })]
     });
     ```
7. **CI/CD**
   - `.github/workflows/ci.yml` runs lint → test → build → lhci.
   - Fail if Lighthouse performance < 90.
8. **Testing**
   - Jest unit tests for ChatWidget (search match, fallback).
   - Cypress E2E for product page load, cart add.
9. **Locales**
   - Add `chat` keys: `chat.ask`, `chat.placeholder`, `chat.noMatch` in EN/TH JSON.
10. **Deployment**
    - Preview channels remain; no Functions added.

### 2.7 Milestones & Timeline
| Week | Milestone |
|------|-----------|
| 1 | Setup deps, routing, ProductDetail stub |
| 2 | ImageLazy, swatch, search hook |
| 3 | ChatWidget, FAQ content |
| 4 | PWA, tests, CI |
| 5 | QA, Lighthouse pass, deploy |

---

## Section 3 – Comparison Notes
- **Routing**: Adds `/product/:id` route and file.
- **Deps**: +4 runtime, +1 dev.
- **Structure**: New `chat`, `pages`, `hooks` modules.
- **CI**: New GitHub Action + lhci.
- **PWA**: Manifest & service worker via plugin.
- **No backend cost**: All features client‑side.

---

## .windsurfrules Upgrade
```diff
- **Use Python** as the primary language.
- **Follow PEP8**, use type hints, and format with `black`.
- **Use `pydantic` for data validation**.
- Use `FastAPI` for APIs and `SQLAlchemy` or `SQLModel` for ORM if applicable.
+ **Use TypeScript/React** as primary language for `src/**`.
+ **Follow ESLint + Prettier rules**, enforced via CI.
+ **Component/Hook file ≤ 300 lines**; split otherwise.
+ **Add Lighthouse CI budget**: performance ≥ 90, a11y ≥ 90.
+ **Block PR merge** if Firebase plan would exceed Spark (check for Functions/Ops). 
```
**Rationale**: Project is TS/React, not Python. We add lint, formatting, Lighthouse, and Firebase budget guardrails to keep costs and quality in check.
