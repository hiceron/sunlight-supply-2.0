# Sunlight Supply Thailand

A modern e-commerce platform for sustainable plastic materials with an integrated admin dashboard.

## Features

### Public Website
- **Homepage**: Modern, responsive landing page with video background
- **Product Catalog**: Browse recycled plastic materials with color variants
- **Shopping Cart**: Real-time cart management with color selection
- **User Authentication**: Secure login/signup with Google or email
- **Order Management**: Track order history and status
- **Contact Form**: Direct communication channel with form submission
- **Newsletter**: Email subscription system
- **Multilingual Support**: Multiple language options

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
git clone https://github.com/yourusername/sunlight-supply-thailand.git
cd sunlight-supply-thailand
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
├── types/            # TypeScript type definitions
└── styles/           # Global styles and themes
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.