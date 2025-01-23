import { dmHelperBeforeEach, dmHelperAfter } from '../helpers/dmhelper-setup';
import { deleteRooms, addMobWithTypeahead, verifyMobInEntityList } from '../helpers/dmhelper-utils';

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

  describe('Typeahead Tests', () => {
    it('should typeahead search for mobs', () => {
      // Typeahead search for a goblin
      cy.get('[data-testid="mob-name-input"]').type('goblin');
      cy.get('[data-testid="typeahead-mob-goblin"]').should('exist');

      // Typeahead search for a kobold
      cy.get('[data-testid="mob-name-input"]').clear().type('kobold');
      cy.get('[data-testid="typeahead-mob-kobold"]').should('exist');
    });

    it('should typeahead search for mobs and select one', () => {
      // Typeahead search for a goblin
      cy.get('[data-testid="mob-name-input"]').type('goblin');
      cy.get('[data-testid="typeahead-mob-goblin"]').click();
      cy.get('[data-testid="selected-mob-typeahead-label"]').should('exist').should('contain', 'Goblin');

      // Test that values were populated into input fields
      cy.get('[data-testid="mob-health-input"]').invoke('val').should('exist');
      cy.get('[data-testid="mob-initiative-input"]').invoke('val').should('exist');

      // Test that reroll buttons exist
      cy.get('[data-testid="reroll-initiative"]').should('exist');
      cy.get('[data-testid="reroll-hitpoints"]').should('exist');
    });

    it('should reroll initiative and hitpoints', () => {
      cy.get('[data-testid="mob-name-input"]').type('goblin');
      cy.get('[data-testid="typeahead-mob-goblin"]').click();

      cy.wait(500);

      // Reroll initiative
      cy.get('[data-testid="reroll-initiative"]').click();
      cy.get('[data-testid="mob-initiative-input"]').invoke('val').should('exist');

      cy.wait(500);

      // Reroll hitpoints
      cy.get('[data-testid="reroll-hitpoints"]').click();
      cy.get('[data-testid="mob-health-input"]').invoke('val').should('exist');
    });

    it('should add mob with typeahead and verify the detail modal exists', () => {
      addMobWithTypeahead('goblin');
      verifyMobInEntityList('Goblin');

      cy.get('[data-testid="view-details-goblin-1"]').click();

      cy.wait(500);
      cy.get(`[data-testid="detail-card-goblin"]`).should('exist');
    });
  });
});
