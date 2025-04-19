# Sunlight Supply Website Planning

## Overview
Sunlight Supply produces plastic pellets from recycled plastic in Thailand. This website showcases company information, sustainability mission, product catalog, and supports online ordering.

## Objectives
- Build brand credibility and highlight sustainability efforts
- Present company history, team, and vision clearly
- Enable online product ordering with secure payment
- Facilitate easy content updates via Firebase
- Optimize for SEO, performance, and accessibility
- Responsive design in English and Thai (EN/TH)

## Scope
- Pages: Home, About, Sustainability, Products, Shop, Clients & Partners, Export, Contact
- Dynamic content storage: Firebase Firestore
- User authentication: Firebase Auth (contact form, admin)
- Payments: Stripe (React Stripe.js) and Thai e-payments via Firebase Functions
- Analytics: Firebase Analytics and Google Analytics
- Hosting & backend: Firebase Hosting and Cloud Functions for APIs

## Tech Stack
- Front-end: Vite + React + TypeScript + Tailwind CSS
- Routing: React Router Dom
- State management: Zustand
- Internationalization: react-i18next (EN/TH)
- Styling utilities: clsx
- Icons: lucide-react
- Date utilities: date-fns
- Data storage & real-time updates: Firebase Firestore
- Authentication: Firebase Auth
- Functions & APIs: Firebase Cloud Functions (TypeScript)
- Analytics: Firebase Analytics
- Payments: Stripe (React Stripe.js) + Omise integrations
- Testing: Jest, React Testing Library, Cypress
- CI/CD: GitHub Actions (build, lint, test) + Firebase CLI deploy
- Code quality: ESLint, Prettier, Husky + lint-staged
- Version control: Git & GitHub

## Asset Structure & Conventions
- All static assets under `/public/`, grouped by type:
  - Icons: `/public/icons/`
  - Videos: `/public/videos/`
  - Images: `/public/images/` (create as needed)
- Logo asset: `/public/icons/logo.png`
- Component files: `src/components/`
- Page components: `src/pages/` or `src/routes/`

## Timeline
| Phase                    | Duration |
|--------------------------|----------|
| Discovery & Planning     | 2 weeks  |
| Development              | 4 weeks  |
| Integration & Testing    | 2 weeks  |
| Deployment & QA          | 1 week   |
| Launch & Support         | Ongoing  |

## Architecture Overview
- SPA built with Vite & React, client-side routing via React Router
- Firebase for hosting, Firestore, Auth, Analytics, and Cloud Functions
- Environment variables & secrets managed via `.env` files and Vite's `import.meta.env`
- Payment processing through secure Cloud Functions endpoints
- i18n support with react-i18next for bilingual content
- CI/CD pipeline with GitHub Actions and Firebase CLI

## Security Considerations
- Enforce HTTPS via Firebase Hosting
- Firebase Security Rules for Firestore and Storage
- Role-based access control for admin interfaces
- Input sanitization to prevent XSS and injection attacks
- CSRF protection via Firebase Auth tokens
- PCI DSS compliance for payment handling
- Regular dependency vulnerability scans and security audits
- Automated backups for critical data
- Ensure .gitignore ignores environment variable files (.env*, .env.local) and service account keys (serviceAccountKey.json)

## Performance Goals
- Achieve Lighthouse score ≥ 90 on desktop and mobile
- First Contentful Paint < 1.5s; Time to Interactive < 3s
- Use code splitting, lazy loading, and image optimization
- Implement CDN and caching strategies via Firebase Hosting
- Monitor performance via Real User Monitoring (RUM)

## Deployment Strategy
- GitHub Actions on PR: run build, lint, and tests
- Preview deploys to Firebase Preview Channels for QA
- Production deploy to Firebase Hosting on merge to main
- Blue/Green deployments using Firebase Hosting channels
- Infrastructure defined declaratively in `firebase.json`

## Future Extensions
- Multilingual support beyond EN/TH (e.g., LA, VN)
- B2B customer portal with order dashboards
- Partner API for product data access
- Loyalty and referral program integration
- Blog/News section powered by Firestore
- Mobile app with React Native

## Risks & Mitigation
- Payment integration delays: prototype early with Stripe
- Translation consistency: integrate i18n workflows and review
- Content readiness: allocate sufficient time for copywriting
- Firebase quota limits: monitor usage and optimize queries

## Stakeholders
Marketing Team, Production Team, IT Department, External Designer

Refer to TASK.md for detailed implementation steps.
