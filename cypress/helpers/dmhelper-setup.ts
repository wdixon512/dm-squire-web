import { Room } from '@lib/models/dm-helper/Room';

export const dmHelperBeforeEach = () => {
  // Login and visit the page once before all tests
  cy.login();
  cy.visit('/');
  cy.window().then((win) => {
    win.localStorage.setItem('cypressTesting', 'true');
  });
  cy.wait(2000); // Wait for initial load
};

export const dmHelperAfter = () => {
  // Wait to delete so the last step of each test can run
  cy.wait(2000);

  cy.callRtdb('get', 'rooms').then((response) => {
    const rooms = Object.values(response) as Room[];
    const myRoom = rooms.find((room) => {
      return room.ownerUID === Cypress.env('TEST_UID');
    });

    if (!myRoom) {
      return;
    }

    cy.callRtdb('delete', `rooms/${myRoom.id}`);
  });
};
