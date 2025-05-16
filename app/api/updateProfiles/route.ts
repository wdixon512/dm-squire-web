import { NextRequest, NextResponse } from 'next/server';
import { rtdb } from '@services/firebase';
import { ref, get, update } from 'firebase/database';
import puppeteer from 'puppeteer';
import { ProfileUpdateRequestBody } from '@lib/models/dtos/ProfileUpdateResponse';
import { getServerFirestoreDb } from '@lib/services/firebase-admin-service';
import { sanitizeMonsterName } from '@lib/util/mobUtils';
import { DetailedMob } from '@lib/models/dnd5eapi/DetailedMob';
import { getLibraryProfilePictureUrl } from '@lib/util/dm-helper-utils';

export async function POST(req: NextRequest) {
  try {
    const { roomId, entityId, entityName, profileUrl, method } = (await req.json()) as ProfileUpdateRequestBody;

    switch (method) {
      case 'dndbeyond':
        return await updateProfileFromDndBeyond(roomId, entityId, profileUrl);
      case 'library':
        return await updateProfileFromLibrary(roomId, entityId, entityName);
      default:
        return NextResponse.json(
          { error: 'Invalid method. Only "dndbeyond" and "library" are supported.' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error updating profile picture:', error);
    return NextResponse.json({ error: 'Failed to update profile picture' }, { status: 500 });
  }
}

async function updateProfileFromDndBeyond(
  roomId: string,
  entityId: string,
  profileUrl: string | undefined
): Promise<NextResponse> {
  if (!roomId || !entityId || !profileUrl) {
    return NextResponse.json(
      { error: 'Missing required fields: roomId, entityId, and profileUrl are required' },
      { status: 400 }
    );
  }

  const profilePic = await scrapeProfilePicture(profileUrl);
  if (!profilePic) {
    return NextResponse.json({ error: 'Failed to scrape profile picture' }, { status: 404 });
  }

  // Get the room's entities
  const roomRef = ref(rtdb, `rooms/${roomId}/combat/entities`);
  const heroIndex = await findEntityIndex(roomRef, entityId);

  if (heroIndex === -1) {
    return NextResponse.json({ error: 'Hero not found in room' }, { status: 404 });
  }

  // Update the hero's profile picture URL
  await update(roomRef, {
    [`${heroIndex}/profilePictureUrl`]: profilePic,
  });

  return NextResponse.json({
    message: 'Profile picture updated successfully',
    profilePictureUrl: profilePic,
  });
}

async function updateProfileFromLibrary(roomId: string, entityId: string, entityName: string | undefined) {
  if (!roomId || !entityId || !entityName) {
    return NextResponse.json(
      { error: 'Missing required fields: roomId, entityId, and entityName are required' },
      { status: 400 }
    );
  }

  // Get the room's entities
  const roomRef = ref(rtdb, `rooms/${roomId}/combat/entities`);
  const entityIndex = await findEntityIndex(roomRef, entityId);

  if (entityIndex === -1) {
    return NextResponse.json({ error: 'Entity not found in room' }, { status: 404 });
  }

  const db = getServerFirestoreDb();

  // Query Firestore for the monster by sanitized name
  const docRef = db.collection('monsters').doc(sanitizeMonsterName(entityName));
  const snapshot = await docRef.get();

  if (!snapshot.exists) {
    return new Response(`Monster ${entityName} not found.`, { status: 404 });
  }

  const monster = snapshot.data() as DetailedMob;
  const profilePictureUrl = getLibraryProfilePictureUrl(monster.name);
  // Update the hero's profile picture URL
  await update(roomRef, {
    [`${entityIndex}/profilePictureUrl`]: profilePictureUrl,
  });

  return NextResponse.json({
    message: 'Profile picture updated successfully',
    profilePictureUrl: profilePictureUrl,
  });
}

async function scrapeProfilePicture(url: string): Promise<string | null> {
  console.log('scraping information from:', url);
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: 'networkidle2' });

    // First, try to get the portrait by class
    let imgSrc = await page
      .$eval('img.ddbc-character-avatar__portrait', (img: HTMLImageElement) => img.src)
      .catch(() => null);

    console.log('main image:', imgSrc);

    // Fallback: use alt text
    if (!imgSrc) {
      imgSrc = await page.$eval('img[alt="Character portrait"]', (img: HTMLImageElement) => img.src).catch(() => null);
    }

    console.log('fallback image:', imgSrc);

    return imgSrc ?? null;
  } catch (error) {
    console.error(`Error scraping rendered profile picture for ${url}:`, error);
    return null;
  } finally {
    await browser.close();
  }
}

async function findEntityIndex(roomRef: any, entityId: string): Promise<number> {
  const snapshot = await get(roomRef);
  if (!snapshot.exists()) return -1;

  const entities = snapshot.val();
  return entities.findIndex((entity: any) => entity.id === entityId);
}
