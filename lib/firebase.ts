// lib/firebase.ts
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  initializeAuth,
  getAuth,
  getReactNativePersistence,
  Auth,
  GoogleAuthProvider
} from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Importing a React Native Store
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const firebaseConfig = {
  apiKey: Constants.expoConfig?.extra?.firebaseApiKey,
  authDomain: Constants.expoConfig?.extra?.firebaseAuthDomain,
  projectId: Constants.expoConfig?.extra?.firebaseProjectId,
  storageBucket: Constants.expoConfig?.extra?.firebaseStorageBucket,
  messagingSenderId: Constants.expoConfig?.extra?.firebaseMessagingSenderId,
  appId: Constants.expoConfig?.extra?.firebaseAppId,
};

// Explicitly specifying variable types for TypeScript
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

// Check if the application has already been initialized
if (getApps().length === 0) {
  // --- FIRST INITIALIZATION ---
  console.log('Firebase: Initializing app for the first time with Async Storage persistence');
  app = initializeApp(firebaseConfig);

  // Initialize Auth by explicitly specifying the storage.
  // This is what makes the session persist across application restarts.
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  });

  db = getFirestore(app);
} else {
  // --- REUSE ---
  console.log('Firebase: App already initialized, getting existing instances');
  app = getApp();

  // Get an existing, configured Auth instance.
  // It remembers the persistence settings from the first block.
  auth = getAuth(app);

  db = getFirestore(app);
}

const googleProvider = new GoogleAuthProvider();

// Export ready-to-use instances
export { app, auth, db, googleProvider };

export const storage = getStorage(app);

// Exporting keys for Google Sign-In
export const googleWebClientId = Constants.expoConfig?.extra?.googleWebClientId;
export const googleIosClientId = Constants.expoConfig?.extra?.googleIosClientId;
