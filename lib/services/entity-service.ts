import { Entity, EntityType } from '@lib/models/dm-helper/Entity';
import { Mob } from '@lib/models/dm-helper/Mob';
import { Hero } from '@lib/models/dm-helper/Hero';
import { Ally } from '@lib/models/dm-helper/Ally';
import { getNextEntityNumber, validateMobHealth, validateName } from '@lib/util/dm-helper-utils';
import { toKebabCase } from '@lib/util/js-utils';
import { UseToastOptions, ToastId } from '@chakra-ui/react';

export class EntityService {
  constructor(private toast: (options: UseToastOptions) => ToastId | undefined) {}

  addMob(
    name: string,
    health: number | undefined,
    initiative: number | undefined,
    profilePictureUrl?: string,
    isLibraryMob?: boolean,
    existingEntities: Entity[] = []
  ): Mob | null {
    if (!validateName(name, this.toast) || !validateMobHealth(health, this.toast)) {
      return null;
    }

    return {
      id: `${toKebabCase(name.toLowerCase())}-${getNextEntityNumber(existingEntities, name)}`,
      name,
      health,
      number: getNextEntityNumber(existingEntities, name),
      initiative,
      profilePictureUrl,
      type: EntityType.MOB,
      isLibraryMob,
    };
  }

  addHero(
    name: string,
    health: number | undefined,
    initiative: number | undefined,
    profileUrl: string | undefined,
    existingEntities: Entity[] = []
  ): Hero | null {
    if (!validateName(name, this.toast)) {
      return null;
    }

    return {
      id: `${toKebabCase(name.toLowerCase())}-${getNextEntityNumber(existingEntities, name)}`,
      name,
      health,
      number: getNextEntityNumber(existingEntities, name),
      initiative,
      dndBeyondProfileUrl: profileUrl,
      type: EntityType.HERO,
    };
  }

  addAlly(
    name: string,
    health: number | undefined,
    initiative: number | undefined,
    mobLibraryId?: string,
    profileUrl?: string,
    profilePictureUrl?: string,
    existingEntities: Entity[] = []
  ): Ally | null {
    if (!validateName(name, this.toast)) {
      return null;
    }

    return {
      id: `${toKebabCase(name.toLowerCase())}-${getNextEntityNumber(existingEntities, name)}`,
      name,
      health,
      number: getNextEntityNumber(existingEntities, name),
      initiative,
      dndBeyondProfileUrl: profileUrl,
      profilePictureUrl,
      type: EntityType.ALLY,
      mobLibraryId,
    };
  }

  updateEntity(
    entities: Entity[],
    entity: Entity
  ): {
    updatedEntities: Entity[];
    fieldsUpdated?: string[];
  } {
    let fieldsUpdated: string[] = [];
    const updatedEntities = entities.map((e) => {
      if (e.id === entity.id) {
        // Find all the fields that have changed
        fieldsUpdated = Object.keys(entity).filter((key) => {
          if (key === 'id' || key === 'number') return false; // Skip id and number
          return e[key] !== entity[key];
        });

        return entity;
      }

      return e;
    });
    return { updatedEntities, fieldsUpdated };
  }

  removeEntity(entities: Entity[], entity: Entity): Entity[] {
    return entities.filter((e) => e.id !== entity.id);
  }

  clearMobs(entities: Entity[]): Entity[] {
    return entities.filter((entity) => entity.type !== EntityType.MOB);
  }

  resetCombat(entities: Entity[]): Entity[] {
    return entities.map((entity) =>
      entity.type !== EntityType.MOB ? { ...entity, initiative: undefined, skipInCombat: false } : entity
    );
  }
}
