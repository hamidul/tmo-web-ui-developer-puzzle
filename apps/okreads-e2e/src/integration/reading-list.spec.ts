describe('When: I use the reading list feature', () => {
  let count = 0;
  beforeEach(() => {
    cy.startAt('/');
    count = cy.$$('[data-testing="reading-list-item"]').length;
  });

  it('Then: I should see my reading list', () => {
    cy.get('[data-testing="toggle-reading-list"]').click();

    cy.get('[data-testing="reading-list-container"]').should(
      'contain.text',
      'My Reading List'
    );
  });

  it('Then: I should be able to add book and undo added book', () => {

    cy.get('input[type="search"]').type('Liferay In Action');

    cy.get('form').submit();

    cy.get('[data-testing="add-to-reading-list"]:enabled').first().click();

    cy.get('[data-testing="reading-list-item"]').should('have.length', count + 1);

    cy.get('.mat-simple-snackbar-action button').click();

    cy.get('[data-testing="reading-list-item"]').should('have.length', count);

  });

  it('Then: I should be able to remove book and undo removed book', () => {
    cy.get('input[type="search"]').type('Gradle in Action');

    cy.get('form').submit();

    cy.get('[data-testing="add-to-reading-list"]:enabled').first().click();

    cy.get('[data-testing="reading-list-item"]').should('have.length', count + 1);

    cy.get('[data-testing="toggle-reading-list"]').click();

    cy.get('[data-testing="remove-book"]:enabled').first().click();

    cy.get('[data-testing="close-reading-list"]').click();

    cy.get('[data-testing="reading-list-item"]').should('have.length', count);

    //undo remove from reading list
    cy.get('.mat-simple-snackbar-action button').click();

   cy.get('[data-testing="reading-list-item"]', { multiple: true }).should('have.length', count + 1);
  });
});