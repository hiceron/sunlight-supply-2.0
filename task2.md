# task2.md — 2025‑04‑23

---

## Section 1 – Original TASK.md (Key Incomplete Items)
- Build contact form + email notifications.
- Implement SEO meta tags.
- Add analytics tracking.
- Reusable UI components & Zustand global state.
- Jest/Cypress tests.
- GitHub Actions workflow.

---

## Section 2 – Upgraded Task Checklist (Actionable)

### Phase A – Product UX Enhancements
- [ ] **/product/:id page**
  - Path: `src/pages/ProductDetail.tsx`
  - Accepts `id` param, fetch from `useProducts`.
  - Helmet meta tags (`title`, OG image).
- [ ] **ColorSwatch & QuantityStepper components** in `src/components/ui/`.
- [ ] **ImageLazy.tsx** wrapper with blur placeholders.

### Phase B – Search & Filters
- [ ] Create `useProductSearch.ts` (Fuse.js) with params: `query`, `filters`, `sort`.
- [ ] Update Shop modal & new detail page to call search hook.
- [ ] Pagination (pageSize = 12).

### Phase C – AI Chatbot
- [ ] Add `src/data/faq.json` starter (10 Q&A pairs EN/TH).
- [ ] Build `ChatWidget.tsx` + `useChatStore`.
- [ ] Insert widget in `App.tsx` (outside <Router>). Toggle via floating button.

### Phase D – PWA & SEO
- [ ] Install `vite-plugin-pwa`; add to `vite.config.ts`.
- [ ] Create `manifest.webmanifest`, icons 512/192 px.
- [ ] Add Lighthouse budgets in `lhci.yml`.

### Phase E – CI / Testing
- [ ] `.github/workflows/ci.yml`
  - Jobs: install, lint (`eslint .`), unit tests (`jest --coverage`), build, Lighthouse CI, Cypress run (on PR label `e2e`).
  - Required status to merge.
- [ ] Add unit tests:
  - Chat search returns expected hit
  - ProductDetail renders product
- [ ] Cypress tests:
  - Visit `/product/:id`, add to cart, checkout auth gate.

### Phase F – Docs & Locales
- [ ] Update translation files with `chat.*` keys.
- [ ] Fill `planning2.md` and `readme2.md` into repo root.

### Phase G – Validation & Deploy
- [ ] Run `npm run lint && npm test && npm run build` locally.
- [ ] Lighthouse score ≥ 90.
- [ ] Merge to `main` → Firebase Hosting deploy.

---

## Section 3 – Comparison Notes
- New phases A‑G add ~15 tasks replacing generic TODOs with concrete component/file names.
- Emphasises pass/fail budgets & CI enforcement.
