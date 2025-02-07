import { doc, setDoc } from 'firebase/firestore';
import { db } from './firebase-script-init';
// import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const testMob = {
  name: 'TestMob',
  size: 'Medium',
  type: 'Beast',
  alignment: 'Neutral',
  ac: '15',
  hp: '30',
  speed: '30 ft',
  str: '14',
  dex: '12',
  con: '13',
  int: '2',
  wis: '10',
  cha: '6',
  skill: [],
  senses: 'darkvision 60 ft',
  passive: '12',
  languages: 'none',
  cr: '1',
  trait: [],
  action: [],
  save: [],
  resist: [],
  vulnerable: [],
  immune: [],
  conditionImmune: [],
  spells: [],
  slots: [],
  legendary: [],
  description: [],
  reaction: [],
};

(async () => {
  try {
    await setDoc(doc(db, 'mobs', testMob.name), testMob);
    console.log('✅ Test write successful');
  } catch (error) {
    console.error('❌ Test write failed:', error);
  }
})();
