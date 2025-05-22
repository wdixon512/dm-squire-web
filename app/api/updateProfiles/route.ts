import { NextRequest, NextResponse } from 'next/server';
import { rtdb } from '@services/firebase';
import { ref, get, update } from 'firebase/database';
import puppeteer from 'puppeteer-core';
import { ProfileUpdateRequestBody } from '@lib/models/dtos/ProfileUpdateResponse';

export async function POST(req: NextRequest) {
  try {
    const { roomId, entityId, profileUrl, method } = (await req.json()) as ProfileUpdateRequestBody;

    switch (method) {
      case 'dndbeyond':
        return await updateProfileFromDndBeyond(roomId, entityId, profileUrl);
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

  if (!validateScrapeUrl(profileUrl)) {
    return NextResponse.json(
      {
        error: 'Invalid URL. Please provide a valid D&D Beyond character profile URL.',
      },
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

function validateScrapeUrl(url: string): boolean {
  const allowedDomains = ['dndbeyond.com'];

  if (!allowedDomains.some((domain) => url.includes(domain))) {
    return false;
  }

  return true;
}

async function scrapeProfilePicture(url: string): Promise<string | null> {
  console.log('Scraping profile picture from:', url);
  // keep timer
  const startTime = Date.now();

  const browser = await puppeteer.connect({
    browserWSEndpoint: `wss://chrome.browserless.io?token=${process.env.BLESS_TOKEN}`,
  });

  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 15000 });

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
    const endTime = Date.now();
    const elapsedTime = endTime - startTime;
    console.log(`Scraping took ${elapsedTime} ms`);

    await browser.close();
  }
}

async function findEntityIndex(roomRef: any, entityId: string): Promise<number> {
  const snapshot = await get(roomRef);
  if (!snapshot.exists()) return -1;

  const entities = snapshot.val();
  return entities.findIndex((entity: any) => entity.id === entityId);
}
