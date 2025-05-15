import { Entity, EntityType } from './Entity';

export interface Hero extends Entity {
  type: EntityType.HERO;
  dndBeyondProfileUrl?: string;
  profilePictureUrl?: string;
}
