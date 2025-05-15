import { isAuthorizedRequest } from '@lib/util/auth-utils';
import { NextRequest, NextResponse } from 'next/server';
import { rtdb } from '@services/firebase';
import { ref, get, update } from 'firebase/database';
import { Room } from '@lib/models/dm-helper/Room';
import { Hero } from '@lib/models/dm-helper/Hero';
import { EntityType } from '@lib/models/dm-helper/Entity';
import puppeteer from 'puppeteer';

export async function GET(req: NextRequest) {
  try {
    // Get all rooms
    const roomsRef = ref(rtdb, 'rooms');
    const snapshot = await get(roomsRef);

    if (!snapshot.exists()) {
      return NextResponse.json({ message: 'No rooms found' });
    }

    const rooms = snapshot.val() as { [key: string]: Room };
    const updateResults = await Promise.all(Object.values(rooms).map(updateHeroProfilePictures));

    const totalProfilesUpdated = updateResults.reduce((sum, result) => sum + result.profilesUpdated, 0);
    const roomsWithUpdates = updateResults.filter((result) => result.profilesUpdated > 0);

    return NextResponse.json({
      message: 'Profile pictures updated successfully',
      roomsProcessed: Object.keys(rooms).length,
      totalProfilesUpdated,
      roomsWithUpdates: roomsWithUpdates.map((result) => ({
        roomId: result.roomId,
        profilesUpdated: result.profilesUpdated,
      })),
    });
  } catch (error) {
    console.error('Error updating profile pictures:', error);
    return NextResponse.json({ error: 'Failed to update profile pictures' }, { status: 500 });
  }
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

async function updateHeroProfilePictures(room: Room): Promise<{ roomId: string; profilesUpdated: number }> {
  if (!room.combat?.entities) return { roomId: room.id!, profilesUpdated: 0 };

  const heroes = room.combat.entities.filter(
    (entity) => entity.type === EntityType.HERO && !!(entity as Hero).dndBeyondProfileUrl
  ) as Hero[];

  if (heroes.length === 0) return { roomId: room.id!, profilesUpdated: 0 };

  const updates: { [key: string]: any } = {};
  const roomRef = ref(rtdb, `rooms/${room.id}/combat/entities`);
  let profilesUpdated = 0;

  for (const hero of heroes) {
    const profilePic = await scrapeProfilePicture(hero.dndBeyondProfileUrl!);
    if (profilePic) {
      // Find the hero's index in the entities array
      const heroIndex = room.combat.entities.findIndex((e) => e.id === hero.id);
      if (heroIndex !== -1) {
        updates[`${heroIndex}/profilePictureUrl`] = profilePic;
        profilesUpdated++;
      }
    }
  }

  if (Object.keys(updates).length > 0) {
    await update(roomRef, updates);
  }

  return { roomId: room.id!, profilesUpdated };
}
