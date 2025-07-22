/**
 * Firestore Database Setup Instructions
 * 
 * This file contains the instructions and rules needed to set up your Firestore database
 * for the Hifdh Tracker application.
 */

// FIRESTORE SECURITY RULES
// Copy and paste these rules in your Firebase Console > Firestore Database > Rules

/*
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to hifdh-progress for all users (for public viewing)
    match /hifdh-progress/{document} {
      allow read: if true;
      
      // Only allow write access to authenticated users for their own document
      // or if they are the admin user
      allow write: if request.auth != null && 
        (request.auth.token.email == resource.id || 
         request.auth.token.email == 'bediruna@gmail.com');
    }
  }
}
*/

// COLLECTION STRUCTURE
/*
Collection: hifdh-progress
Document ID: {user-email} (e.g., "bediruna@gmail.com")

Document Structure:
{
  userId: string,
  surahs: {
    1: "strong-memorization",
    2: "in-progress", 
    3: "weak-memorization",
    4: "needs-revision",
    5: "not-started",
    // ... for all 114 surahs
  },
  lastUpdated: timestamp
}
*/

// INITIALIZATION STEPS:
/*
1. Go to Firebase Console (https://console.firebase.google.com)
2. Select your project: hifdh-tracker-ayl2c
3. Navigate to Firestore Database
4. If not created yet, click "Create database"
5. Choose "Start in test mode" (we'll set proper rules later)
6. Select a location (choose closest to your users)
7. Once created, go to "Rules" tab
8. Replace the default rules with the rules provided above
9. Click "Publish"

The app will automatically create the initial data when you first sign in as admin.
*/

export const SETUP_COMPLETE = true;
