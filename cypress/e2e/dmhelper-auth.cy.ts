import { Hero } from './../../lib/models/dm-helper/Hero';
import { Mob } from './../../lib/models/dm-helper/Mob';
import { Entity } from './../../lib/models/dm-helper/Entity';
import { dmHelperAfter, dmHelperBeforeEach } from '../helpers/dmhelper-setup';
import {
  addGoblinAndVerify,
  addHeroAndVerify,
  addKoboldAndVerify,
  createRoom,
  deleteRooms,
  goToInviteOthersPanel,
  dmHelperSignIn,
  dmHelperSignOut,
  verifyDbRoom,
} from '../helpers/dmhelper-utils';

describe('DMHelper User Authorization Tests', () => {
  before(() => {
    deleteRooms();
  });

  beforeEach(() => {
    dmHelperBeforeEach();
  });

  after(() => {
    dmHelperAfter();
  });

  it('should go to the invite others tab while not signed in, and see "sign in" and not "create a room"', () => {
    dmHelperSignOut();
    goToInviteOthersPanel();
    cy.get('[data-testid="invite-others-sign-in-btn"]').should('exist');
    cy.get('[data-testid="create-room-button"]').should('not.exist');
  });

  it('should sign in, add a mob/hero to room without sync, create room entry in DB, then sync current state', () => {
    dmHelperSignOut();
    dmHelperSignIn();
    addGoblinAndVerify();
    addHeroAndVerify('Sava');
    createRoom();

    verifyDbRoom((room) => {
      // Verify the combat
      expect(room).to.exist;
      expect(room.combat.entities).to.exist;
      expect(room.combat.entities).to.satisfy((entities: Entity[]) =>
        entities.some((entity) => {
          return (
            entity.id === 'goblin-1' && entity.name === 'Goblin' && entity.health === 30 && entity.initiative === 15
          );
        })
      );

      // Verify the heroes
      expect(room.heroes).to.exist;
      expect(room.heroes).to.satisfy((heroes: Hero[]) =>
        heroes.some((hero) => {
          return hero.name === 'Sava';
        })
      );

      // Verify the rest of the room
      expect(room.syncWithFirebase).to.be.true;
      expect(room.id).to.exist;
      expect(room.ownerUID).to.equal(Cypress.env('TEST_UID'));
      expect(room.mobFavorites).to.satisfy((favorites: Mob[]) =>
        favorites.some((favorite) => {
          return (
            favorite.id === 'goblin-1' &&
            favorite.name === 'Goblin' &&
            favorite.health === 30 &&
            favorite.initiative === 15
          );
        })
      );

      deleteRooms();
    });
  });

  it('should add a mob/hero to a room without sync, create room entry in DB, then sync current state', () => {
    addGoblinAndVerify();
    addHeroAndVerify('Sava');
    createRoom();

    verifyDbRoom((room) => {
      // Verify the combat
      expect(room).to.exist;
      expect(room.combat.entities).to.exist;
      expect(room.combat.entities).to.satisfy((entities: Entity[]) =>
        entities.some((entity) => {
          return (
            entity.id === 'goblin-1' && entity.name === 'Goblin' && entity.health === 30 && entity.initiative === 15
          );
        })
      );

      // Verify the heroes
      expect(room.heroes).to.exist;
      expect(room.heroes).to.satisfy((heroes: Hero[]) =>
        heroes.some((hero) => {
          return hero.name === 'Sava';
        })
      );

      // Verify the rest of the room
      expect(room.syncWithFirebase).to.be.true;
      expect(room.id).to.exist;
      expect(room.ownerUID).to.equal(Cypress.env('TEST_UID'));
      expect(room.mobFavorites).to.satisfy((favorites: Mob[]) =>
        favorites.some((favorite) => {
          return (
            favorite.id === 'goblin-1' &&
            favorite.name === 'Goblin' &&
            favorite.health === 30 &&
            favorite.initiative === 15
          );
        })
      );
    });
  });

  it('should add a mob/hero to existing room, then sync current state', () => {
    addKoboldAndVerify();
    addHeroAndVerify('Krugen');

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

      expect(room.syncWithFirebase).to.be.true;
      expect(room.id).to.exist;
      expect(room.ownerUID).to.equal(Cypress.env('TEST_UID'));
      expect(room.mobFavorites).to.satisfy((favorites: Mob[]) => {
        return favorites.some((favorite) => {
          return (
            favorite.id === 'goblin-1' &&
            favorite.name === 'Goblin' &&
            favorite.health === 30 &&
            favorite.initiative === 15
          );
        });
      });
    });
  });
});
