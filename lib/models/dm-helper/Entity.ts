export enum EntityType {
  MOB = 'mob',
  HERO = 'hero',
  ENTITY = 'entity',
}

export type Entity = {
  id: string;
  apiUrl?: string;
  name: string;
  health?: number;
  number?: number;
  initiative?: number | undefined;
  type: EntityType;
  isLibraryMob?: boolean;
};
