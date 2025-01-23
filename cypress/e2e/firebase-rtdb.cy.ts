import { Room } from './../../lib/models/dm-helper/Room';

describe('DMHelper User Authorization Tests', () => {
  beforeEach(() => {
    cy.login();
  });

  after(() => {});

  it('get firebase rtdb and log the rooms', () => {
    cy.callRtdb('get', 'rooms/-OBN6XgjNDyZAa_imC7w').then((rooms) => {
      console.log('rooms', rooms);
    });
  });
});
