import { useClientCache } from '@lib/components/contexts/CacheContext';
import { RollType, RollTypeMethods } from '@lib/models/dm-helper/RollType';
import { AllMonstersResponse } from '@lib/models/dnd5eapi/AllMonstersResponse';
import { DetailedMob, SummaryMob } from '@lib/models/dnd5eapi/DetailedMob';

const BASE_URL = `/api/monsters`;

// Define the types for the API responses
interface UseDndApiHook {
  getAllMobsAsync: () => Promise<SummaryMob[]>;
  getMobByName: (mobName: string) => Promise<DetailedMob | null>;
  getMobHitPoints: (mob: DetailedMob) => number;
  rollDice: (mob: DetailedMob, rollType: RollType) => number;
}

// Custom hook to interact with the D&D 5e API
export const useDndApi = (): UseDndApiHook => {
  const { cacheLoadAsync } = useClientCache();

  const getAllMobsAsync = async (): Promise<SummaryMob[]> => {
    return cacheLoadAsync('allMonsters', async () => {
      try {
        const response = await fetch(BASE_URL);
        if (!response.ok) {
          throw new Error('Failed to fetch monsters');
        }
        const responseJson = await response.json();
        return responseJson as SummaryMob[];
      } catch (error) {
        console.error('Failed to fetch monsters:', error);
      }

      return [];
    });
  };

  // Fetch details of a specific monster by its index
  const getMobByName = async (mobName: string): Promise<DetailedMob | null> => {
    const cacheKey = mobName.replace(' ', '_').toLowerCase();

    return cacheLoadAsync(cacheKey, async () => {
      try {
        const response = await fetch(`${BASE_URL}/${mobName.replace(' ', '_').toLowerCase()}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch monster details for \"${mobName}\"`);
        }
        return (await response.json()) as DetailedMob;
      } catch (error) {
        console.warn('Failed to fetch monster details:', error);
        return null;
      }
    });
  };

  const getMobHitPoints = (mob: DetailedMob): number => {
    return parseInt(mob.hp.split('(')[0], 10);
  };

  const rollDice = (mob: DetailedMob, rollType: RollType): number => {
    const diceString = RollTypeMethods[rollType].getDice(mob);

    // parse the dice string to get the number of dice and the dice type
    const [numDice, diceType] = diceString.split('d').map((num) => parseInt(num, 10));
    const [_, modifier] = diceString.split('+').map((num) => parseInt(num, 10));

    // Simulate rolling by choosing a random number between 1 and 20
    let roll = Math.floor(Math.random() * (numDice * diceType)) + 1;

    if (modifier) {
      roll += modifier;
    }

    return roll;
  };

  // Return the list of monsters and the method to fetch detailed monster data
  return {
    getAllMobsAsync,
    getMobByName,
    rollDice,
    getMobHitPoints,
  };
};

export default useDndApi;
