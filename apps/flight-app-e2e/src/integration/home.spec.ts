import { getTop5FlightsTitle, getTop5PassengersTitle } from '../support/home.po';

describe('home page', () => {
  beforeEach(() => cy.visit('/'));

  it('should display top 5 flights title', () => {
    getTop5FlightsTitle().should('have.text', 'Top 5 flights');
  });

  it('should display top 5 passengers title', () => {
    getTop5PassengersTitle().should('have.text', 'Top 5 passengers');
  });
});
