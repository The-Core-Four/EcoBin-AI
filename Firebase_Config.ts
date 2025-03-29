// Firebase Configuration Service
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID
} from '@env';

// Validate required Firebase configuration parameters
const validateFirebaseConfig = (config: Record<string, string>) => {
  const missingKeys = Object.entries(config)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missingKeys.length) {
    throw new Error(`Missing Firebase configuration values for: ${missingKeys.join(', ')}`);
  }
};

// Firebase project configuration from environment variables
const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID
};

// Validate configuration before initialization
validateFirebaseConfig(firebaseConfig);

// Initialize Firebase core service
const firebaseApp = initializeApp(firebaseConfig);

// Initialize Authentication service with persistent storage
let firebaseAuth;
try {
  firebaseAuth = initializeAuth(firebaseApp, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
} catch (error) {
  // Fallback to basic authentication if persistence fails
  const { getAuth } = require('firebase/auth');
  firebaseAuth = getAuth(firebaseApp);
}

// Initialize Cloud Firestore service
const firestoreDb = getFirestore(firebaseApp);

export { firebaseApp, firebaseAuth, firestoreDb };