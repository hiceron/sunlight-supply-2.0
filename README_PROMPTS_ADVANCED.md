# Advanced AI Prompts for Sunlight Supply Thailand Website

A comprehensive guide for recreating the website with advanced features and security considerations.

## 1. Project Configuration

### 1.1 Environment Setup
```
Create a .env file with the following configuration:

# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_DATABASE_URL=your_database_url

# Google Maps Configuration
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key

# Development Configuration
VITE_DEV_MODE=true
VITE_API_URL=http://localhost:5173
VITE_ENABLE_MOCK_DATA=true

# Admin Configuration
VITE_ADMIN_UID=3eEMx7NZj9VVbCXEuGreioOEGHN2
```

### 1.2 Firebase Security Rules
```json
{
  "rules": {
    ".read": "auth != null && auth.uid === '3eEMx7NZj9VVbCXEuGreioOEGHN2'",
    ".write": "auth != null && auth.uid === '3eEMx7NZj9VVbCXEuGreioOEGHN2'",
    "products": {
      ".read": true,
      ".write": "auth != null && auth.uid === '3eEMx7NZj9VVbCXEuGreioOEGHN2'"
    },
    "orders": {
      ".read": "auth != null && auth.uid === '3eEMx7NZj9VVbCXEuGreioOEGHN2'",
      ".write": "auth != null",
      "$uid": {
        ".read": "auth != null && ($uid === auth.uid || auth.uid === '3eEMx7NZj9VVbCXEuGreioOEGHN2')",
        ".write": "auth != null && ($uid === auth.uid || auth.uid === '3eEMx7NZj9VVbCXEuGreioOEGHN2')"
      }
    },
    "contact_submissions": {
      ".read": "auth != null && auth.uid === '3eEMx7NZj9VVbCXEuGreioOEGHN2'",
      ".write": true
    },
    "newsletter": {
      ".read": "auth != null && auth.uid === '3eEMx7NZj9VVbCXEuGreioOEGHN2'",
      ".write": true
    },
    "performance": {
      ".read": "auth != null",
      ".write": "auth != null && auth.uid === '3eEMx7NZj9VVbCXEuGreioOEGHN2'"
    },
    "stats": {
      ".read": "auth != null",
      ".write": "auth != null && auth.uid === '3eEMx7NZj9VVbCXEuGreioOEGHN2'"
    }
  }
}
```

### 1.3 Google Maps Configuration
```javascript
const mapConfig = {
  apiKey: process.env.VITE_GOOGLE_MAPS_API_KEY,
  defaultCenter: {
    lat: 13.130561,
    lng: 100.787855
  },
  defaultZoom: 15,
  styles: [
    {
      featureType: "all",
      elementType: "geometry",
      stylers: [{ color: "#242f3e" }]
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#17263c" }]
    }
  ],
  options: {
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false
  }
};
```

[Rest of the file content remains unchanged from the previous version]