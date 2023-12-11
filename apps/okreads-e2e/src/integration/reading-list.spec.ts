describe('When: I use the reading list feature', () => {
  beforeEach(() => {
    cy.startAt('/');
  });

  it('Then: I should see my reading list', () => {
    cy.get('[data-testing="toggle-reading-list"]').click();

    cy.get('[data-testing="reading-list-container"]').should(
      'contain.text',
      'My Reading List'
    );
  });


  it('Then: I should be able to mark the book as finished', () => {
    cy.get('input[type="search"]').type('Harry Potter');
    cy.get('form').submit();
    cy.get('[ data-testing="add-book-item"]:enabled').first().click();
    cy.get('[data-testing="toggle-reading-list"]').click();
    cy.get('[data-testing="finish-read-book-btn"]:enabled').first().click();
    cy.get('[data-testing="finished-reading-date"]').first().should('contain.text', 'Finished On');
    cy.get('[data-testing="remove-book-btn"]:enabled').last().should('exist').click();
    cy.get('[data-testing="close-list"]').click();
    cy.get('[data-testing="add-book-item"]:enabled').first().should('exist').click();
    cy.get('[data-testing="toggle-reading-list"]').click();
    cy.get('.reading-list-item').last().find('.finish-read-button-icon').should('exist');
    cy.get('[data-testing="remove-book-btn"]:enabled').last().should('exist').click();
  });
});