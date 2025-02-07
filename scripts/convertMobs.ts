import { fetch, Headers, Response } from 'node-fetch';
globalThis.fetch = fetch;
globalThis.Headers = Headers;
globalThis.Response = Response;

import { FirestoreDataConverter, doc, setDoc } from 'firebase/firestore';
import { db, firebaseConfig } from './firebase-script-init';
import * as fs from 'fs';
import * as path from 'path';
import { getApp } from 'firebase/app';

// TODO: run this script using node
// Define classes to represent your data
class DetailedMob {
  constructor(
    public name: string,
    public size: string,
    public type: string,
    public alignment: string,
    public ac: string,
    public hp: string,
    public speed: string,
    public str: string,
    public dex: string,
    public con: string,
    public int: string,
    public wis: string,
    public cha: string,
    public skill: string[],
    public senses: string | string[],
    public passive: string,
    public languages: string,
    public cr: string,
    public trait: { name: string; text: string[]; attack?: string[] }[],
    public action: { name: string; text: string[]; attack?: string[] }[],
    public save: string[],
    public resist: string[],
    public vulnerable: string[],
    public immune: string[],
    public conditionImmune: string[],
    public spells: string[],
    public slots: string[],
    public legendary: { name: string; text: string[] }[],
    public description: string[],
    public reaction: { name: string; text: string[] }[]
  ) {}
}

// Define the converter
const detailedMobConverter = {
  toFirestore(mob: DetailedMob): any {
    return {
      name: mob.name,
      size: mob.size,
      type: mob.type,
      alignment: mob.alignment,
      ac: mob.ac,
      hp: mob.hp,
      speed: mob.speed,
      str: mob.str,
      dex: mob.dex,
      con: mob.con,
      int: mob.int,
      wis: mob.wis,
      cha: mob.cha,
      skill: mob.skill,
      senses: mob.senses,
      passive: mob.passive,
      languages: mob.languages,
      cr: mob.cr,
      trait: mob.trait,
      action: mob.action,
      save: mob.save,
      resist: mob.resist,
      vulnerable: mob.vulnerable,
      immune: mob.immune,
      conditionImmune: mob.conditionImmune,
      spells: mob.spells,
      slots: mob.slots,
      legendary: mob.legendary,
      description: mob.description,
      reaction: mob.reaction,
    };
  },
  fromFirestore(snapshot: any, options: any): DetailedMob {
    const data = snapshot.data(options);
    return new DetailedMob(
      data.name,
      data.size,
      data.type,
      data.alignment,
      data.ac,
      data.hp,
      data.speed,
      data.str,
      data.dex,
      data.con,
      data.int,
      data.wis,
      data.cha,
      data.skill,
      data.senses,
      data.passive,
      data.languages,
      data.cr,
      data.trait,
      data.action,
      data.save,
      data.resist,
      data.vulnerable,
      data.immune,
      data.conditionImmune,
      data.spells,
      data.slots,
      data.legendary,
      data.description,
      data.reaction
    );
  },
};

// Load JSON data
let jsonData: DetailedMob[] = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '../public/data/monsters.json'), 'utf8')
);

// Add type checking and parsing
jsonData = Array.isArray(jsonData) ? jsonData : Object.values(jsonData);

// Convert JSON to DetailedMob objects
const detailedMobs: DetailedMob[] = jsonData.map((mobData) => {
  // More robust error checking
  if (!mobData || !mobData.name) {
    console.error('Invalid mob data:', mobData);
    return null;
  }

  return new DetailedMob(
    mobData.name,
    mobData.size,
    mobData.type,
    mobData.alignment,
    mobData.ac,
    mobData.hp,
    mobData.speed,
    mobData.str,
    mobData.dex,
    mobData.con,
    mobData.int,
    mobData.wis,
    mobData.cha,
    mobData.skill,
    mobData.senses,
    mobData.passive,
    mobData.languages,
    mobData.cr,
    mobData.trait,
    mobData.action,
    mobData.save,
    mobData.resist,
    mobData.vulnerable,
    mobData.immune,
    mobData.conditionImmune,
    mobData.spells,
    mobData.slots,
    mobData.legendary,
    mobData.description,
    mobData.reaction
  );
});

// Store in Firestore
Promise.all(
  detailedMobs
    .filter(Boolean) // Removes null or undefined entries
    .map(async (mob) => {
      try {
        const docRef = doc(db, 'mobs', mob.name).withConverter(detailedMobConverter);
        await setDoc(docRef, mob, { merge: true });
        console.log(`Added mob: ${mob.name}`);
      } catch (error) {
        console.error(`Failed to add mob: ${mob.name}`, error);
      }
    })
)
  .then(() => console.log('✅ All mobs have been processed'))
  .catch((error) => {
    if (error.code === 'permission-denied') {
      console.error('🚫 Security Rules are blocking access to Firestore.');
    } else {
      console.error('Error processing mobs:', error);
    }
  });

console.log(`Connected to project: ${getApp().options.projectId}`);
console.log('config:', firebaseConfig);
