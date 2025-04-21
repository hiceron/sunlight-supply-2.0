# Sunlight Supply Thailand v2.0

[![GitHub Repo](https://img.shields.io/github/repo-size/hiceron/sunlight-supply-2.0?style=flat-square)](https://github.com/hiceron/sunlight-supply-2.0)
[![MIT License](https://img.shields.io/github/license/hiceron/sunlight-supply-2.0?style=flat-square)](LICENSE)

A modern e-commerce platform for sustainable plastic materials with an integrated admin dashboard.

---
**Repository:** [github.com/hiceron/sunlight-supply-2.0](https://github.com/hiceron/sunlight-supply-2.0)
---

## Features

### Public Website

---

## 🌐 Internationalization (i18n) Implementation

This project uses **react-i18next** for all user-facing text in both the public website and admin dashboard. English and Thai translations are stored in `/src/locales/en/translation.json` and `/src/locales/th/translation.json`.

### How it works
- All display text in React components is referenced using translation keys (e.g. `t('shop.productCard.addToCart')`).
- The `useTranslation` hook from `react-i18next` is used in every component that renders text.
- Translation files are structured by feature/module for maintainability (e.g. `shop.productCard`, `shop.cartModal`).
- Language can be switched at runtime; the UI updates instantly.

### Developer Tips & Warnings
- **Never hardcode user-facing strings.** Always use translation keys and the `t()` function.
- **Keep translation keys unique** and avoid duplicates. Structure keys by feature/component for clarity.
- **Update both `en` and `th` files** for every new string. Missing keys will fall back to the default language.
- **Test language switching** in the UI to catch missing or untranslated text.
- If you add new features, mirror the translation key structure in both languages.
- **Translation files must be valid JSON**. Lint errors or duplicate keys will break the build or cause runtime errors.

---


- **Homepage**: Modern, responsive landing page with video background
- **Product Catalog**: Browse recycled plastic materials with color variants
- **Shopping Cart**: Real-time cart management with color selection
- **User Authentication**: Secure login/signup with Google or email
- **Order Management**: Track order history and status
- **Contact Form**: Direct communication channel with form submission
- **Newsletter**: Email subscription system
- **Multilingual Support**: Multiple language options (EN/TH powered by react-i18next)

### Admin Dashboard
- **Overview**: Real-time statistics and metrics
  - Total Orders
  - Revenue
  - Active Customers
  - Growth Rate
  - Recent Activity Feed
- **Order Management**
  - View all orders
  - Update order status (pending/completed)
  - Filter and search orders
- **Inventory Control**
  - Product management
  - Stock level tracking
  - Add/Edit products
  - Color variant management

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom theming
- **State Management**: Zustand
- **Authentication**: Firebase Auth
- **Database**: Firebase Realtime Database
- **Animation**: Framer Motion
- **Routing**: React Router v6
- **UI Components**: Custom components with shadcn/ui style system

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Firebase account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/hiceron/sunlight-supply-2.0.git
cd sunlight-supply-2.0
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
Create a `.env` file with your Firebase configuration:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_DATABASE_URL=your_database_url
```

4. Start the development server:
```bash
npm run dev
```

### Firebase Setup

1. Create a new Firebase project
2. Enable Authentication (Email/Password and Google)
3. Set up Realtime Database with the following structure:
```
{
  "admins": {
    "admin1": {
      "UID": "your_admin_uid"
    }
  },
  "orders": {},
  "contact_submissions": {},
  "newsletter": {}
}
```

4. Set up database rules (see `database.rules.json`)

### Admin Access

Default admin credentials:
- Email: admin@sunlightsupply.com
- Password: admin123

## Project Structure

```
src/
├── components/
│   ├── admin/         # Admin dashboard components
│   ├── shop/          # Shopping components
│   ├── ui/            # Reusable UI components
│   └── ...           # Other components
├── hooks/             # Custom React hooks
├── lib/              # Utilities and configurations
├── locales/          # i18n translation files (en, th, ...)
├── types/            # TypeScript type definitions
└── styles/           # Global styles and themes
```

---

## Internationalization (i18n)

This project uses **react-i18next** for bilingual support (English/Thai).

### Adding/Editing Translations

- Translation files are located in `src/locales/{lang}/translation.json`.
- To add a new language:
  1. Create a folder: `src/locales/{your-lang}`
  2. Add a `translation.json` file with your translations.
  3. Update `src/i18n.ts` to import and register the new language.

### Using Translations in Components

Use the `useTranslation` hook from `react-i18next`:

```tsx
import { useTranslation } from 'react-i18next';

const { t } = useTranslation();

return <h2>{t('about.title')}</h2>;
```

### Switching Languages

Use the `LanguageSwitcher` component or call `i18n.changeLanguage('en')` / `i18n.changeLanguage('th')` programmatically.

### Testing i18n

Unit tests for translation and language switching are in `tests/i18n/`.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## CI/CD with GitHub Actions

This project uses **GitHub Actions** for Continuous Integration (CI) and Continuous Deployment (CD):
- **CI:** Automatically runs tests and checks code quality on every push and pull request.
- **CD:** Can be configured to deploy the app automatically when changes are merged to the main branch.

GitHub Actions workflows are defined in the `.github/workflows/` directory. You can customize these workflows to run tests, build the project, or deploy to your preferred platform.

Learn more: [GitHub Actions Documentation](https://docs.github.com/en/actions)