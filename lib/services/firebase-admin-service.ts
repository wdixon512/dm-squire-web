import { cert, getApps, initializeApp } from 'firebase-admin/app';
import type { ServiceAccount } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

export const getServerFirestoreDb = () => {
  // Initialize Firebase Admin (ensure it runs only once)
  if (!getApps().length) {
    initializeApp({
      credential: cert(JSON.parse(process.env.SERVICE_ACCOUNT!) as ServiceAccount),
    });
  }

  return getFirestore();
};
