import { SummaryMob } from '@lib/models/dnd5eapi/DetailedMob';
import { getServerFirestoreDb } from '@lib/services/firebase-admin-service';

export const dynamic = 'force-static';

export async function GET(request: Request) {
  const db = getServerFirestoreDb();

  try {
    // Fetch all documents in the "monsters" collection
    const monstersColl = await db.collection('monsters').get();

    if (monstersColl.empty) {
      return new Response('Could not find any monster data.', { status: 404 });
    }

    const monsterData = monstersColl.docs.map((doc) => doc.data()) as SummaryMob[];

    return Response.json(monsterData);
  } catch (error) {
    console.error('Error fetching monsters:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
