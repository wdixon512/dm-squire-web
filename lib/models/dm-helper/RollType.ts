import { DetailedMob } from '@lib/models/dnd5eapi/DetailedMob';

// Define the RollType enum
export const enum RollType {
  DexteritySavingThrow = 'DexteritySavingThrow',
  Initiative = 'Initiative',
  HitPoints = 'HitPoints',
  //   AttackRoll = 'AttackRoll',
}

// Helper to calculate ability modifiers
const calculateModifier = (abilityScore: number): number => {
  return Math.floor((abilityScore - 10) / 2);
};

// Define a mapping for roll logic
export const RollTypeMethods: {
  [key in RollType]: {
    getDice: (mob: DetailedMob) => string;
    description: string;
  };
} = {
  [RollType.DexteritySavingThrow]: {
    description: "Roll a dexterity saving throw based on the mob's dexterity modifier.",
    getDice: (mob) => `1d20+${calculateModifier(parseInt(mob.dex, 10)) || 0}`,
  },
  [RollType.Initiative]: {
    description: "Roll for initiative using the mob's dexterity modifier.",
    getDice: (mob) => `1d20+${calculateModifier(parseInt(mob.dex, 10)) || 0}`,
  },
  [RollType.HitPoints]: {
    description: "Roll for the mob's hit points based on its hit dice.",
    getDice: (mob) => mob.hp.split('(')[1].replace(')', '') || '0d0',
  },
  //   [RollType.AttackRoll]: {
  //     description: "Roll to hit using the mob's attack modifier.",
  //     getDice: (mob) => `1d20+${mob. || 0}`,
  //   },
};
