import { Entity } from './Entity';

export enum CombatState {
  NOT_IN_PROGRESS = 0,
  IN_PROGRESS = 1,
}

export type Combat = {
  entities: Entity[];
  combatState: CombatState;
};
