import { Entity, EntityType } from './Entity';
import { IProfile } from './IProfile';

export type Hero = Entity &
  IProfile & {
    type: EntityType.HERO;
  };
