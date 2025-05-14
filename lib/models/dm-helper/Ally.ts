import { Entity, EntityType } from './Entity';
import { IProfile } from './IProfile';

export interface Ally extends Entity, IProfile {
  type: EntityType.ALLY;
  mobLibraryId?: string;
}
