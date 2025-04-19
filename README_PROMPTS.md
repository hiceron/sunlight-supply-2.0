# AI Assistant Prompts for Sunlight Supply Thailand Website

This document contains structured prompts to help recreate the website using AI assistance. Follow these prompts in order.

## 1. Initial Setup

```
Create a modern e-commerce website for Sunlight Supply Thailand using:
- React with TypeScript
- Tailwind CSS
- Firebase for authentication and database
- Vite as the build tool

Environment Setup (.env):
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_DATABASE_URL=your_database_url
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key

Firebase Security Rules:
{
  "rules": {
    ".read": "auth != null && auth.uid === '3eEMx7NZj9VVbCXEuGreioOEGHN2'",
    ".write": "auth != null && auth.uid === '3eEMx7NZj9VVbCXEuGreioOEGHN2'",
    "products": {
      ".read": true,
      ".write": "auth != null && auth.uid === '3eEMx7NZj9VVbCXEuGreioOEGHN2'"
    },
    "contact_submissions": {
      ".read": "auth != null && auth.uid === '3eEMx7NZj9VVbCXEuGreioOEGHN2'",
      ".write": true
    },
    "newsletter": {
      ".read": "auth != null && auth.uid === '3eEMx7NZj9VVbCXEuGreioOEGHN2'",
      ".write": true
    }
  }
}

Admin Configuration:
- Admin UID: 3eEMx7NZj9VVbCXEuGreioOEGHN2
```

## 2. Authentication System

```
Set up Firebase authentication with:
- Email/password login
- Google sign-in
- Admin user support (UID: 3eEMx7NZj9VVbCXEuGreioOEGHN2)
- Protected routes
```

## 3. Homepage Components

```
Create a responsive homepage with:
- Full-screen hero section with video background
- About section
- Statistics display
- Sustainability section
- Client testimonials
- Export information
- Contact form with Google Maps integration
- Newsletter subscription
- Footer
```

## 4. Shopping System

```
Implement a shopping system with:
- Product catalog display
- Color variant selection
- Cart management
- Quantity controls
- Product comparison feature
- Checkout process
- Order history
```

## 5. Admin Dashboard

```
Create an admin dashboard with:
- Overview page with statistics
- Order management system
- Inventory control
- Real-time updates
- Filtering and search capabilities
- Status management for orders
- Close button to return to main site
```

## 6. Database Structure

```
Set up Firebase Realtime Database with:
{
  "admins": {
    "admin1": {
      "UID": "3eEMx7NZj9VVbCXEuGreioOEGHN2"
    }
  },
  "orders": {},
  "products": {},
  "contact_submissions": {},
  "newsletter": {}
}
```

## 7. State Management

```
Implement state management using Zustand for:
- Shopping cart
- User authentication
- Admin dashboard
- Theme preferences
- Language selection
```

## 8. Multilingual Support

```
Add multilingual support with:
- Language selection
- Translation system
- RTL support where needed
- Persistent language preferences
```

## 9. Performance Optimization

```
Optimize the application with:
- Code splitting
- Lazy loading
- Image optimization
- Caching strategies
- Performance monitoring
```

## 10. Testing Setup

```
Set up testing infrastructure with:
- Unit tests for components
- Integration tests for features
- E2E tests for critical paths
- Test coverage reporting
```

## Google Maps Integration

```javascript
// Google Maps configuration
const mapConfig = {
  apiKey: process.env.VITE_GOOGLE_MAPS_API_KEY,
  center: { lat: 13.130561, lng: 100.787855 },
  zoom: 15,
  styles: [
    {
      featureType: "all",
      elementType: "geometry",
      stylers: [{ color: "#242f3e" }]
    }
  ]
};
```

## Tips for Using These Prompts

1. Execute prompts sequentially
2. Provide context from previous implementations
3. Request specific code examples when needed
4. Ask for explanations of complex logic
5. Request modifications for specific requirements

## Common Follow-up Prompts

- "Can you explain how [feature] works?"
- "How can I modify [component] to include [functionality]?"
- "What's the best way to test [feature]?"
- "How can I improve the performance of [component]?"
- "Can you help debug this error in [component]?"

## Best Practices

1. Review and understand generated code before implementation
2. Test features thoroughly after implementation
3. Keep documentation updated
4. Follow consistent coding standards
5. Maintain security best practices
6. Regular backups of critical data
7. Monitor performance metrics