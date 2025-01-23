import { Room } from './../../lib/models/dm-helper/Room';

describe('DMHelper User Authorization Tests', () => {
  beforeEach(() => {
    cy.login();
  });

  after(() => {});

  it('get firestore and log the rooms', () => {
    cy.callFirestore('get', 'rooms').then((rooms: Room[]) => {
      console.log('rooms', rooms);
    });
  });
});
