# Sunlight Supply Thailand - Advanced Implementation Guide (Bolt Version)

## Project Setup

### 1. Environment Configuration

```env
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

### 2. Firebase Security Rules

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

### 3. Database Structure

```json
{
  "admins": {
    "admin1": {
      "UID": "3eEMx7NZj9VVbCXEuGreioOEGHN2"
    }
  },
  "orders": {
    "$uid": {
      "items": [],
      "total": 0,
      "status": "pending",
      "customerInfo": {},
      "date": ""
    }
  },
  "products": {
    "$pid": {
      "name": "",
      "price": 0,
      "availableQuantity": 0,
      "availableColors": [],
      "image": ""
    }
  },
  "contact_submissions": {
    "$sid": {
      "name": "",
      "email": "",
      "subject": "",
      "message": "",
      "timestamp": "",
      "status": "new"
    }
  }
}
```

[Rest of the file content remains unchanged from the previous version]