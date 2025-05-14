import { Entity, EntityType } from './Entity';

export interface Ally extends Entity {
  type: EntityType.ALLY;
  characterSheetId?: string;
}
