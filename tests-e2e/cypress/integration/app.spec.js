describe('app', () => {
    it('should see hello message', () => {
        cy.visit('/');
        cy.queryByText('Hello CaenCamp jobBoard!').should('exist');
    });
});
