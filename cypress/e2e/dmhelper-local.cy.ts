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
  clearMobs,
  clearQuickadd,
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

    it('should only show mob numbers when there are multiple mobs with the same name', () => {
      // First verify the current state of goblins
      cy.get('[data-testid="entity-list"]').within(() => {
        // Count how many goblins exist
        cy.get('[data-testid="entity-item"]')
          .filter(':contains("Goblin")')
          .then(($goblins) => {
            const goblinCount = $goblins.length;

            if (goblinCount === 1) {
              // If there's only one goblin, verify it shows without a number
              cy.get('[data-testid="goblin-1-name"]').should('contain', 'Goblin').and('not.contain', '#1');
            } else {
              // If there are multiple goblins, verify they all show with numbers
              for (let i = 1; i <= goblinCount; i++) {
                cy.get(`[data-testid="goblin-${i}-name"]`).should('contain', `Goblin #${i}`);
              }
            }
          });
      });

      // Add a new unique mob to test the single mob case
      cy.get('[data-testid="combat-panel"]').click();
      cy.get('[data-testid="mob-name-input"]').type('Unique Mob');
      cy.get('[data-testid="mob-health-input"]').type('40');
      cy.get('[data-testid="mob-initiative-input"]').type('12');
      cy.get('[data-testid="submit-mob-button"]').click();

      // Verify the unique mob shows without a number
      cy.get('[data-testid="unique-mob-1-name"]').should('contain', 'Unique Mob').and('not.contain', '#1');

      // Add a second unique mob
      cy.get('[data-testid="mob-name-input"]').clear().type('Unique Mob');
      cy.get('[data-testid="mob-health-input"]').clear().type('40');
      cy.get('[data-testid="mob-initiative-input"]').clear().type('12');
      cy.get('[data-testid="submit-mob-button"]').click();

      // Verify both unique mobs now show with numbers
      cy.get('[data-testid="unique-mob-1-name"]').should('contain', 'Unique Mob #1');
      cy.get('[data-testid="unique-mob-2-name"]').should('contain', 'Unique Mob #2');

      // Clean up: Remove both unique mobs
      cy.get('[data-testid="unique-mob-1-kill"]').click();
      cy.get('[data-testid="unique-mob-2-kill"]').click();

      // Verify the unique mobs are gone
      cy.get('[data-testid="unique-mob-1-name"]').should('not.exist');
      cy.get('[data-testid="unique-mob-2-name"]').should('not.exist');
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
      cy.get('[data-testid="warrior-1-edit"]').first().click();
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
          (favorites: Mob[]) => favorites.length === 2 && !favorites.some((m) => m.id === 'goblin-1')
        );
      });
    });

    it('should open modal and confirm to remove all mobs and verify it is removed from the database', () => {
      cy.get('[data-testid="clear-mobs-button"]').click();
      cy.wait(500);

      cy.get('[data-testid="cancel-edit-modal-btn"]').click();
      cy.wait(500);
      cy.get('[data-testid="clear-mobs-modal"]').should('not.exist');

      cy.get('[data-testid="clear-mobs-button"]').click();
      cy.wait(500);

      // Click outside the modal (on the overlay)
      cy.get('body').type('{esc}');
      cy.wait(500);

      // Ensure the modal is closed
      cy.get('[data-testid="clear-mobs-modal"]').should('not.exist');

      cy.get('[data-testid="clear-mobs-button"]').click();
      cy.wait(500);

      clearMobs();

      verifyDbRoom((room) => {
        expect(room).to.exist;
        expect(room.combat).to.exist;

        const mobs = room.combat.entities?.filter((entity) => entity.type === 'mob') || [];
        expect(mobs.length).to.equal(0);
      });
    });

    it('should open modal and confirm to remove all mobs from quick add and verify favorited mobs removed from the database', () => {
      cy.get('[data-testid="quickadd-clear-btn"]').click();
      cy.wait(500);

      cy.get('[data-testid="cancel-edit-modal-btn"]').click();
      cy.wait(500);
      cy.get('[data-testid="clear-quickadd-modal"]').should('not.exist');

      cy.get('[data-testid="quickadd-clear-btn"]').click();
      cy.wait(500);

      // Click outside the modal (on the overlay)
      cy.get('body').type('{esc}');
      cy.wait(500);

      // Ensure the modal is closed
      cy.get('[data-testid="clear-quickadd-modal"]').should('not.exist');

      cy.get('[data-testid="quickadd-clear-btn"]').click();
      cy.wait(500);

      clearQuickadd();

      verifyDbRoom((room) => {
        expect(room).to.exist;
        expect(room.mobFavorites).to.be.undefined;
      });
    });
  });
});
