import { Room } from '@lib/models/dm-helper/Room';
import { Entity } from '@lib/models/dm-helper/Entity';
import { Mob } from '@lib/models/dm-helper/Mob';
import { Hero } from '@lib/models/dm-helper/Hero';
import { Ally } from '@lib/models/dm-helper/Ally';

export interface DMHelperContextType {
  room: Room;
  setRoom: React.Dispatch<React.SetStateAction<Room | null>>;
  createRoom: () => Promise<string | undefined | null>;
  joinRoom: (roomId: string) => Promise<void>;
  leaveRoom: () => Promise<void>;
  joinRoomLink: string | undefined;
  entities: Entity[];
  updateEntity: (entity: Entity) => void;
  updateEntities: React.Dispatch<React.SetStateAction<Entity[]>>;
  removeEntity: (entity: Entity) => void;
  addMob: (name: string, health: number | undefined, initiative: number | undefined, isLibraryMob?: boolean) => boolean;
  addHero: (
    name: string,
    health: number | undefined,
    initiative: number | undefined,
    profileUrl: string | undefined
  ) => boolean;
  addAlly: (
    name: string,
    health: number | undefined,
    initiative: number | undefined,
    characterSheetId?: string
  ) => boolean;
  resetCombat: () => void;
  mobFavorites: Mob[];
  updateMobFavorites: (mobs: Mob[]) => void;
  isClient: boolean;
  heroes: Hero[];
  allies: Ally[];
  combatStarted: boolean;
  updateCombatStarted: (started: boolean) => void;
  clearMobs: () => void;
  clearMobFavorites: () => void;
  loadingFirebaseRoom: boolean;
  readOnlyRoom: boolean;
}
