# Sunlight Supply 2.0 - Task Checklist

> **Note:** All completed steps are marked with [x]. Use this checklist to track project progress.

## Admin Panel Feature Roadmap
- [ ] User Management: View, edit, or remove users from the admin panel.
- [ ] Order Management: Manage customer orders (approve, update status, refund, etc.).
- [ ] Product Management: Add, edit, or remove products in your shop.
- [ ] Analytics: View sales, user activity, or other business metrics.
- [ ] Content Moderation: Approve or remove user-generated content (if your site supports it).

### Product Management Enhancements
- [ ] Inventory Alerts: Notify admins when product stock falls below a threshold.
- [ ] Bulk Product Import/Export: Allow admins to upload/download product lists via CSV.

### Order Management Improvements
- [ ] Order Export: Add CSV/Excel export for orders, with filters for date range, status, or customer.
- [ ] Refund Workflow: Integrate a refund process with status tracking and optional notes.
- [ ] Order Timeline: Show a timeline for each order (placed, paid, shipped, delivered, refunded).

### Analytics & Reporting
- [ ] Custom Date Range Analytics: More flexible date pickers and comparison to previous periods.
- [ ] Product Performance Dashboard: Highlight best/worst sellers, low stock, and high-return items.
- [ ] User Segmentation: Analytics by user cohort (new vs. returning, high spenders, etc.).

### General Admin Panel UX Improvements
- [ ] Dark Mode: Add a toggle for dark/light themes.
- [ ] Admin Notifications: In-app notifications for important events (e.g., new orders, low stock, flagged content).
- [ ] Search Across All Data: Global search bar to quickly find users, orders, or products.

## Phase 1: Discovery & Planning
- [x] Gather branding assets (logo, colors, fonts)
- [x] Define sitemap & page hierarchy
- [x] Collect content requirements (text, images, videos)
- [x] Analyze reference site & screenshots
- [x] Create PLANNING.md and document project scope, tech, assets structure

## Phase 2: Environment & Repo Setup
- [x] Create GitHub repository & project board
- [x] Initialize React project with Windsurf and React Router
- [x] Add directory structure for assets (logo, video)
- [x] Add README.md and update with asset conventions
- [x] Scaffold main pages (Home, About, Sustainability, Clients & Partners, Export, Shop, Contact)

## Phase 3: Design & Layout
- [x] Draft wireframes for key pages
- [x] Create UI mockups (desktop & mobile)
- [x] Review designs with stakeholders
- [x] Implement responsive navigation bar (desktop/mobile)
- [x] Set up routing between pages
- [x] Add homepage hero section with slogan and CTA buttons
- [x] Add About Us and Sustainability sections UI
- [x] Design Products and Shop pages UI
- [x] Create Clients & Partners and Export pages UI
- [x] Prepare mobile-first responsive layouts

## Phase 4: Development & Integration
- [x] Scaffold React Router routes for all pages (Home, About, Sustainability, Products, Shop, Clients & Partners, Export, Contact)
- [x] Integrate Firebase Realtime Database data models for page content _(Note: Realtime Database used as primary backend for dynamic content; Firestore not required for current scope)_
- [x] Implement Firebase Auth for admin and user interactions
- [ ] Build Contact form with Firestore storage and email notifications
    - Note: For admin notifications, you can use **Zapier** (to hook messages from Realtime Database without code changes) or **EmailJS** (requires small code update to send emails directly from the frontend). Both options work on the Spark (free) plan.
- [-] Integrate Stripe payments with secure Cloud Functions
    - Paused: Requires Firebase Blaze (paid) plan for backend payment processing with Cloud Functions. Free alternative: Use Stripe Checkout client-only (limited, not recommended for production), or a third-party payment provider with client-only APIs.
- [x] Set up react-i18next for bilingual content (EN/TH)  
    - Includes LanguageSwitcher, translation files, About page refactor, and i18n unit tests.
- [ ] Implement SEO meta tags and dynamic Open Graph tags per page
- [ ] Add analytics tracking (Firebase Analytics + Google Analytics)
- [ ] Develop reusable UI components (buttons, cards, forms)
- [ ] Implement global state management with Zustand

## Phase 5: Testing & QA
- [ ] Write unit tests with Jest and React Testing Library
- [ ] Write end-to-end tests with Cypress covering critical flows (navigation, form submission, checkout)
- [ ] Perform accessibility audit and fix issues (WCAG 2.1 AA)
- [ ] Conduct cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] Conduct responsive testing on various screen sizes

## Phase 6: Deployment & Monitoring

---
### Discovered During Work
- Added `/tests/i18n/about.test.tsx` for i18n unit tests (EN/TH switch, fallback)
- Updated `README.md` with i18n setup, usage, and extension instructions

- [ ] Configure GitHub Actions workflow for build, lint, and tests on PRs
- [ ] Set up Firebase Preview Channels for staging deployments
- [ ] Deploy to Firebase Hosting on main branch merge
- [ ] Implement monitoring alerts via Firebase Crashlytics and Performance Monitoring
- [-] Set up automated backups for Firestore and Storage
    - Paused: Automated scheduled backups require Blaze (paid) plan. Free alternative: Manual backups via Firebase Console or local scripts (not automatic).
- [ ] Document deployment process and rollback procedures
- [ ] Before each GitHub push, verify .gitignore lists .env*, .env.local*, and serviceAccountKey.json to protect sensitive data
- [ ] Verify .gitignore excludes environment variable files (.env*, .env.local) and service account keys (serviceAccountKey.json)

---

## Discovered During Work (2025-04-19)

- Fixed Firebase Realtime Database rules to allow users to write to their own `/users/<uid>` node (required for login/signup to work correctly).
- Updated admin UID in rules to new user.
- Implemented password reset troubleshooting and flow.
- Refactored admin dashboard to add:
  - Messages view (shows all contact submissions from `/contact_submissions`).
  - Newsletter view (shows all newsletter signups from `/newsletter`).
  - Sidebar navigation for Messages and Newsletter.
  - Routing for new admin dashboard sections.
- Cleaned up unused React imports in admin dashboard code.
- Documented troubleshooting steps and best practices for Firebase Auth + Realtime Database integration.
