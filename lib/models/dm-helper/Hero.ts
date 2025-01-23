import { Entity, EntityType } from './Entity';

export type Hero = Entity & {
  type: EntityType.HERO;
};
