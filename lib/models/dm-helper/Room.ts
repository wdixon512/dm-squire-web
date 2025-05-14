import { Ally } from './Ally';
import { Combat, CombatState } from './Combat';
import { Hero } from './Hero';
import { Mob } from './Mob';

export type Room = {
  id?: string;
  ownerUID?: string | null;
  combat: Combat;
  mobFavorites?: Mob[];
  heroes?: Hero[];
  allies?: Ally[];
  syncWithFirebase?: boolean;
};

export type RoomResponse = {
  [key: string]: Room;
};

export const DEFAULT_ROOM: Room = {
  ownerUID: null,
  combat: {
    entities: [],
    combatState: CombatState.NOT_IN_PROGRESS,
  },
  mobFavorites: [],
  heroes: [],
  allies: [],
  syncWithFirebase: false,
};
