import { getServerFirestoreDb } from '@lib/services/firebase-admin-service';
import { getLibraryProfilePictureUrl } from '@lib/util/dm-helper-utils';
import { DetailedMob } from '@lib/models/dnd5eapi/DetailedMob';

export async function POST() {
  return new Response('Method Not Allowed', { status: 405 });

  const db = getServerFirestoreDb();

  try {
    // Fetch all documents in the "monsters" collection
    const monstersColl = await db.collection('monsters').get();

    if (monstersColl.empty) {
      return new Response('Could not find any monster data.', { status: 404 });
    }

    // Create a batch to update all documents
    const batch = db.batch();
    let updateCount = 0;

    // Update each monster document with its profile picture URL
    monstersColl.docs.forEach((doc) => {
      const monster = doc.data() as DetailedMob;
      const profilePictureUrl = getLibraryProfilePictureUrl(monster.name);

      batch.update(doc.ref, { profilePictureUrl });
      updateCount++;
    });

    // Commit the batch update
    await batch.commit();

    return Response.json({
      message: `Successfully updated ${updateCount} monsters with profile picture URLs`,
      count: updateCount,
    });
  } catch (error) {
    console.error('Error updating monster profile pictures:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
