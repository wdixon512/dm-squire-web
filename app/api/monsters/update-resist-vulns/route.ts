import { DetailedMob } from '@lib/models/dnd5eapi/DetailedMob';
import { MonsterDTO } from '@lib/models/dnd5eapi/DTOs';
import { getServerFirestoreDb } from '@lib/services/firebase-admin-service';
import fetch from 'node-fetch';

export async function POST() {
  return new Response('Method Not Allowed', { status: 405 });

  const db = getServerFirestoreDb();

  try {
    const monstersSnap = await db.collection('monsters').get();

    if (monstersSnap.empty) {
      return new Response('Could not find any monster data.', { status: 404 });
    }

    let updatedCount = 0;
    const totalCount = monstersSnap.size;

    for (const doc of monstersSnap.docs) {
      const monster = doc.data();
      const monsterName = monster.name;
      const slug = monsterName.toLowerCase().replace(/\s+/g, '-');

      try {
        const res = await fetch(`https://www.dnd5eapi.co/api/2014/monsters/${slug}`);
        if (!res.ok) {
          console.warn(`DND5E API: No data for monster '${monsterName}' (status ${res.status})`);
          continue;
        }

        const data = (await res.json()) as MonsterDTO;

        await doc.ref.update({
          vulnerable: data.damage_vulnerabilities || [],
          resist: data.damage_resistances || [],
          immune: data.damage_immunities || [],
          conditionImmune: data.condition_immunities.map((ci) => ci.name) || [],
        } as Partial<DetailedMob>);

        updatedCount++;
      } catch (fetchError) {
        console.error(`Failed to fetch or update for monster '${monsterName}':`, fetchError);
      }
    }

    return Response.json({
      message: `Updated ${updatedCount} out of ${totalCount} monsters with damage/immunity data.`,
      updatedCount,
      totalCount,
    });
  } catch (error) {
    console.error('Error in updating monsters:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
