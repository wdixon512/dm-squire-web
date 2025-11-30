import * as dotenv from 'dotenv';
import * as path from 'path';
import { cert, getApps, initializeApp } from 'firebase-admin/app';
import type { ServiceAccount } from 'firebase-admin/app';
import { getDatabase } from 'firebase-admin/database';
import { getAuth } from 'firebase-admin/auth';
import { Room } from '../lib/models/dm-helper/Room';

/**
 * Migration script to populate ownerEmail and ownerPhotoURL for all existing rooms
 * Run with: npm run migrate-room-owner-info
 */

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const initializeFirebaseAdmin = () => {
  if (!getApps().length) {
    if (!process.env.SERVICE_ACCOUNT) {
      console.error('Error: SERVICE_ACCOUNT environment variable is required');
      console.error('Make sure your .env file is in the project root and contains SERVICE_ACCOUNT');
      throw new Error('SERVICE_ACCOUNT environment variable is required');
    }

    if (!process.env.NEXT_PUBLIC_FIREBASE_RTDB_URL) {
      console.error('Error: NEXT_PUBLIC_FIREBASE_RTDB_URL environment variable is required');
      throw new Error('NEXT_PUBLIC_FIREBASE_RTDB_URL environment variable is required');
    }

    initializeApp({
      credential: cert(JSON.parse(process.env.SERVICE_ACCOUNT) as ServiceAccount),
      databaseURL: process.env.NEXT_PUBLIC_FIREBASE_RTDB_URL,
    });
  }
};

async function migrateRoomOwnerInfo() {
  try {
    initializeFirebaseAdmin();
    const db = getDatabase();
    const auth = getAuth();

    console.log('Fetching all rooms...');
    const roomsRef = db.ref('rooms');
    const snapshot = await roomsRef.once('value');

    if (!snapshot.exists()) {
      console.log('No rooms found in database.');
      return;
    }

    const rooms = snapshot.val() as Record<string, Room>;
    const roomIds = Object.keys(rooms);
    console.log(`Found ${roomIds.length} rooms to process.`);

    let updatedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (const roomId of roomIds) {
      const room = rooms[roomId];

      // Skip if room already has owner info
      if (room.ownerEmail && room.ownerPhotoURL) {
        console.log(`Skipping room ${roomId}: already has owner info`);
        skippedCount++;
        continue;
      }

      // Skip if no ownerUID
      if (!room.ownerUID) {
        console.log(`Skipping room ${roomId}: no ownerUID`);
        skippedCount++;
        continue;
      }

      try {
        // Get user info from Firebase Auth
        const userRecord = await auth.getUser(room.ownerUID);
        const ownerEmail = userRecord.email || null;
        const ownerPhotoURL = userRecord.photoURL || null;

        // Update room with owner info
        const updates: Partial<Room> = {};
        if (!room.ownerEmail && ownerEmail) {
          updates.ownerEmail = ownerEmail;
        }
        if (!room.ownerPhotoURL && ownerPhotoURL) {
          updates.ownerPhotoURL = ownerPhotoURL;
        }

        if (Object.keys(updates).length > 0) {
          await db.ref(`rooms/${roomId}`).update(updates);
          console.log(`✓ Updated room ${roomId} - Owner: ${ownerEmail || 'no email'}`);
          updatedCount++;
        } else {
          console.log(`Skipping room ${roomId}: no new data to update`);
          skippedCount++;
        }
      } catch (error: any) {
        console.error(`✗ Error processing room ${roomId}:`, error.message);
        errorCount++;
      }
    }

    console.log('\n=== Migration Summary ===');
    console.log(`Total rooms: ${roomIds.length}`);
    console.log(`Updated: ${updatedCount}`);
    console.log(`Skipped: ${skippedCount}`);
    console.log(`Errors: ${errorCount}`);
    console.log('Migration completed!');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
}

// Run migration
migrateRoomOwnerInfo()
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
