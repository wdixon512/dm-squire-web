import { NextRequest, NextResponse } from 'next/server';
import { rtdb } from '@services/firebase';
import { ref, get, update } from 'firebase/database';
import { ProfileUpdateRequestBody } from '@lib/models/dtos/ProfileUpdateResponse';
import { BrowserlessScrapeResponse } from '@lib/models/dtos/BrowserlessScrapeResponse';

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

  const blessToken = process.env.BLESS_TOKEN;
  if (!blessToken) {
    console.error('BLESS_TOKEN is not configured. Please set BLESS_TOKEN in your environment variables.');
    return null;
  }

  const browserlessEndpoint = process.env.BROWSERLESS_ENDPOINT || 'https://production-sfo.browserless.io';
  const scrapeUrl = `${browserlessEndpoint}/scrape?token=${blessToken}`;
  const startTime = Date.now();

  try {
    const response = await fetch(scrapeUrl, {
      method: 'POST',
      headers: {
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: url,
        elements: [{ selector: 'img.ddbc-character-avatar__portrait' }],
        waitForSelector: {
          selector: 'img.ddbc-character-avatar__portrait',
          timeout: 10000,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Browserless API error (${response.status}):`, errorText);

      if (response.status === 403) {
        console.error('403 Forbidden: Check that your BLESS_TOKEN is valid and has not expired.');
        console.error('Verify your token at https://www.browserless.io/');
      }

      return null;
    }

    const result = (await response.json()) as BrowserlessScrapeResponse;
    let imgSrc: string | null = null;

    // Extract image src from the structured response
    if (result.data && Array.isArray(result.data)) {
      for (const selectorResult of result.data) {
        if (selectorResult.results && Array.isArray(selectorResult.results)) {
          for (const element of selectorResult.results) {
            // Check for src attribute in the attributes array (for img elements)
            const srcAttribute = element.attributes?.find((attr) => attr.name === 'src');
            if (srcAttribute?.value) {
              imgSrc = srcAttribute.value;
              break;
            }
            // Fallback: check for direct src property
            if (element.src) {
              imgSrc = element.src;
              break;
            }
          }
          if (imgSrc) break;
        }
      }
    }

    console.log('Scraped image URL:', imgSrc);

    if (!imgSrc) {
      console.log('Full API response:', JSON.stringify(result, null, 2));
    }

    const endTime = Date.now();
    const elapsedTime = endTime - startTime;
    console.log(`Scraping took ${elapsedTime} ms`);

    return imgSrc;
  } catch (error: any) {
    console.error(`Error scraping rendered profile picture for ${url}:`, error);
    if (error.message) {
      console.error('Error details:', error.message);
    }
    return null;
  }
}

async function findEntityIndex(roomRef: any, entityId: string): Promise<number> {
  const snapshot = await get(roomRef);
  if (!snapshot.exists()) return -1;

  const entities = snapshot.val();
  return entities.findIndex((entity: any) => entity.id === entityId);
}
