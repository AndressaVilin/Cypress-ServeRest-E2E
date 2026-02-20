Cypress.Commands.add('cadastrarUsuario', usuario => {
    return cy.request({
        method: 'POST',
        url: '/usuarios',
        body: usuario,
        failOnStatusCode: false
    })
})