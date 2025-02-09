import { sanitizeMonsterName } from './../lib/util/mobUtils';
import { db } from '@lib/services/firebase';
import { collection, doc, writeBatch } from '@firebase/firestore';
import { DetailedMob } from '@lib/models/dnd5eapi/DetailedMob';
import * as fs from 'fs';
import * as path from 'path';

type MonsterDTO = {
  monsters: DetailedMob[];
};

let jsonData: MonsterDTO = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../public/data/monsters.json'), 'utf8'));

console.log('Total Monsters to Upload: ', jsonData.monsters.length);

async function uploadMonsters() {
  const batch = writeBatch(db);
  const collectionRef = collection(db, 'monsters');

  try {
    jsonData.monsters.forEach((mob) => {
      const safeDocId = sanitizeMonsterName(mob.name);

      const docRef = doc(collectionRef, safeDocId); // Use the monster name as the document ID
      batch.set(docRef, mob);
    });

    await batch.commit();
    console.log('All monsters uploaded successfully!');
  } catch (e) {
    console.error('Error uploading monsters:', e);
  }
}

// Execute upload function
uploadMonsters()
  .catch(console.error)
  .finally(() => process.exit());
