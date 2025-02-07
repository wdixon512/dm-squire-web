// scripts/firebase-script-init.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Correct path to the root directory's .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_RTDB_URL,
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Debugging: Confirm connection
console.log(`✅ Connected to project: ${app.options.projectId}`);
