import { Hero } from '../../lib/models/dm-helper/Hero';
import { Mob } from '../../lib/models/dm-helper/Mob';
import { Entity, EntityType } from '../../lib/models/dm-helper/Entity';
import { CombatState } from '../../lib/models/dm-helper/Combat';
import { dmHelperBeforeEach, dmHelperAfter } from '../helpers/dmhelper-setup';
import {
  addGoblinAndVerify,
  addHeroAndVerify,
  createRoom,
  verifyDbRoom,
  deleteRooms,
  startCombat,
  updateMobAndVerify,
  updateMobHealthInlineAndVerify,
  updateHeroAndVerify,
  addOrcAndVerify,
  quickAddById,
  endCombat,
  removeHeroAndVerify,
  killMobAndVerify,
  removeQuickAddByIdAndVerify,
  goToInviteOthersPanel,
  copyJoinRoomLink,
  dmHelperSignOut,
} from '../helpers/dmhelper-utils';

describe('DMHelper E2E Tests', () => {
  before(() => {
    deleteRooms();
  });

  beforeEach(() => {
    dmHelperBeforeEach();
  });

  after(() => {
    dmHelperAfter();
  });

  describe('Room and Entity Management', () => {
    it('should create a room, add a mob, and verify it in the database', () => {
      createRoom();
      addGoblinAndVerify();

      // Wait for the mob to be added to the database
      cy.wait(2000);

      verifyDbRoom((room) => {
        expect(room).to.exist;
        expect(room.combat.entities).to.exist;
        expect(room.combat.entities).to.satisfy((entities: Entity[]) =>
          entities.some((entity) => {
            return (
              entity.id === 'goblin-1' && entity.name === 'Goblin' && entity.health === 30 && entity.initiative === 15
            );
          })
        );
      });
    });

    it('should add a hero and verify it in the database', () => {
      addHeroAndVerify('Warrior');

      // Wait for the hero to be added to the database
      cy.wait(2000);

      verifyDbRoom((room) => {
        expect(room).to.exist;
        expect(room.heroes).to.satisfy((heroes: Hero[]) => {
          return heroes.some((hero) => hero.id === 'warrior-1' && hero.name === 'Warrior');
        });
      });
    });
  });

  describe('Room Invite', () => {
    it('should sign out and join a room where combat has not started', () => {
      goToInviteOthersPanel();
      copyJoinRoomLink();
      dmHelperSignOut();

      cy.window()
        .then((win) => {
          return win.navigator.clipboard.readText(); // Return the promise from readText()
        })
        .then((clipboardText) => {
          cy.visit(clipboardText);
          cy.wait(2000);

          // Verify that the page has loaded by checking for an expected element
          cy.get('[data-testid="combat-ended-heading"]', { timeout: 10000 }).should('exist');
        });
    });
  });

  describe('Combat Management', () => {
    it('should start combat, enter initiative and verify the combat state in the database', () => {
      startCombat();
      cy.get('[data-testid="initiative-input"]').type('21{enter}');

      // Wait for the combat state to be updated in the database
      cy.wait(2000);

      cy.get('[data-testid="entity-list"]').should('contain', 'Warrior').should('contain', 'Goblin');

      verifyDbRoom((room) => {
        expect(room).to.exist;
        expect(room.combat.combatState).to.equal(CombatState.IN_PROGRESS);
        expect(room.combat.entities).to.satisfy((entities: Entity[]) => {
          return (
            entities.some(
              (entity) => entity.initiative === 21 && entity.id === 'warrior-1' && entity.type === EntityType.HERO
            ) &&
            entities.some(
              (entity) => entity.initiative === 15 && entity.id === 'goblin-1' && entity.type === EntityType.MOB
            )
          );
        });
      });
    });

    it('should update a mob entirely and verify it in the database', () => {
      // Interact with the UI to update the mob
      updateMobAndVerify('goblin-1', 50, 10);

      // Wait for the mob to be updated in the database
      cy.wait(2000);

      updateMobHealthInlineAndVerify('goblin-1', 25);

      verifyDbRoom((room) => {
        expect(room).to.exist;
        expect(room.combat.entities).to.exist;
        expect(room.combat.entities).to.satisfy((entities: Entity[]) => {
          return entities.some((entity) => {
            return (
              entity.id === 'goblin-1' && entity.name === 'Goblin' && entity.health === 25 && entity.initiative === 10
            );
          });
        });
      });

      // Test inline health editor
      cy.get('[data-testid="goblin-1-health"]').clear().type('25');

      // Wait for the mob to be updated in the database
      cy.wait(2000);

      verifyDbRoom((room) => {
        expect(room).to.exist;
        expect(room.combat.entities).to.exist;
        expect(room.combat.entities).to.satisfy((entities: Entity[]) => {
          return entities.some((entity) => {
            return entity.id === 'goblin-1' && entity.health === 25;
          });
        });
      });

      cy.get('[data-testid="goblin-1-health"]').clear().type('50');
    });

    it('should update a hero initiative and verify it in the database', () => {
      // Interact with the UI to update the hero initiative
      cy.get('[data-testid="warrior-1-edit"]').click();
      cy.get('[data-testid="initiative-edit-modal-input"]').clear().type('25');
      cy.get('[data-testid="done-edit-modal-btn"]').click();

      updateHeroAndVerify('warrior-1', 25);

      // Wait for the hero initiative to be updated in the database
      cy.wait(2000);

      verifyDbRoom((room) => {
        expect(room).to.exist;
        expect(room.combat.entities).to.exist;
        expect(room.combat.entities).to.satisfy((entities: Entity[]) => {
          return entities.some((entity) => {
            return entity.id === 'warrior-1' && entity.name === 'Warrior' && entity.initiative === 25;
          });
        });
      });
    });

    it('should add quick add mobs and verify them in the database', () => {
      addOrcAndVerify();

      // Add 2 Goblins and 2 Orcs
      quickAddById('goblin-1');
      quickAddById('goblin-1');
      quickAddById('orc-1');
      quickAddById('orc-1');

      // Verify UI of multiple entities
      cy.get('[data-testid="entity-list"]').within(() => {
        cy.get('[data-testid="entity-item"]').should('have.length', 7);
        cy.get('[data-testid="entity-item"]').filter(':contains("Goblin")').should('have.length', 3);
        cy.get('[data-testid="entity-item"]').filter(':contains("Orc")').should('have.length', 3);
        cy.get('[data-testid="entity-item"]').filter(':contains("Warrior")').should('have.length', 1);
      });

      // Wait for the mobs to be added to the database
      cy.wait(2000);

      verifyDbRoom((room) => {
        expect(room).to.exist;
        expect(room.combat.entities).to.exist;

        // Define expected entities for clarity
        const expectedEntities = [
          { name: 'Goblin', health: 30, initiative: 15, count: 2 },
          { name: 'Goblin', health: 50, initiative: 10, count: 1 },
          { name: 'Orc', health: 50, initiative: 10, count: 3 },
        ];

        // Validate each expected entity in the database
        expectedEntities.forEach(({ name, health, initiative, count }) => {
          const matchingEntities = room.combat.entities.filter(
            (entity) => entity.name === name && entity.health === health && entity.initiative === initiative
          );
          expect(matchingEntities.length).to.equal(count);
        });
      });
    });

    it('should sign out and join a room where combat has not started', () => {
      goToInviteOthersPanel();
      copyJoinRoomLink();
      dmHelperSignOut();

      cy.window()
        .then((win) => {
          return win.navigator.clipboard.readText(); // Return the promise from readText()
        })
        .then((clipboardText) => {
          cy.visit(clipboardText);
          cy.wait(2000);

          cy.get('[data-testid="combat-ended-heading"]', { timeout: 10000 }).should('not.exist');
          cy.get('[data-testid="combat-started-heading"]').should('exist');

          cy.get('[data-testid="entity-list"]').should('contain', 'Warrior').should('contain', 'Goblin');
        });
    });

    it('should end combat and verify the combat state in the database', () => {
      endCombat(false);
      endCombat(true);

      // Wait for the combat state to be updated in the database
      cy.wait(2000);

      verifyDbRoom((room) => {
        expect(room).to.exist;
        expect(room.combat.combatState).to.equal(CombatState.NOT_IN_PROGRESS);
      });
    });
  });

  describe('Removal', () => {
    it('should remove a hero and verify it is removed from the database', () => {
      removeHeroAndVerify('warrior-1');

      // Wait for the hero to be removed from the database
      cy.wait(2000);

      verifyDbRoom((room) => {
        expect(room).to.exist;
        expect(room.heroes).to.be.undefined;
      });
    });

    it('should remove a mob and verify it is removed from the database', () => {
      killMobAndVerify('goblin-1');

      // Wait for the mob to be removed from the database
      cy.wait(2000);

      verifyDbRoom((room) => {
        expect(room).to.exist;
        expect(room.combat.entities).to.exist;
        expect(room.combat.entities).to.satisfy((entities: Entity[]) => entities.length === 5);
      });
    });

    it('should remove a quickadded mob and verify it is removed from the database', () => {
      removeQuickAddByIdAndVerify('goblin-1');

      // Wait for the mob to be removed from the database
      cy.wait(2000);

      verifyDbRoom((room) => {
        expect(room).to.exist;
        expect(room.mobFavorites).to.exist;
        expect(room.mobFavorites).to.satisfy(
          (favorites: Mob[]) => favorites.length === 1 && !favorites.some((m) => m.id === 'goblin-1')
        );
      });
    });
  });
});
