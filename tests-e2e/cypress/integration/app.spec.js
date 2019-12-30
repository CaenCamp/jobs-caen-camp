describe('app', () => {
    it('should see hello message', () => {
        cy.visit('/');
        cy.contains('h1', 'Hello CaenCamp jobBoard!');
    });
});
