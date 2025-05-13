import { Entity, EntityType } from './Entity';

export type Ally = Entity & {
  type: EntityType.ALLY;
};
