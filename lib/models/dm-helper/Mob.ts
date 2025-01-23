import { Entity, EntityType } from './Entity';

export type Mob = Entity & {
  type: EntityType.MOB;
};
