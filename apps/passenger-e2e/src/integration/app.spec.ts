import { getGreeting } from '../support/app.po';

describe('passenger', () => {
  beforeEach(() => cy.visit('/'));

  it('should display search message', () => {
    // Function helper example, see `../support/app.po.ts` file
    getGreeting().contains('Passenger Search');
  });
});
