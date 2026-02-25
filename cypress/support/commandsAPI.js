Cypress.Commands.add('cadastrarUsuario', usuario => {
    return cy.request({
        method: 'POST',
        url: `${Cypress.env('urlApi')}/usuarios`,
        body: usuario,
        failOnStatusCode: false
    })
})

Cypress.Commands.add('login', usuario => {
    return cy.request({
        method: 'POST',
        url: `${Cypress.env('urlApi')}/login`,
        body: {
            email: usuario.email,
            password: usuario.password
    }}).then(response => {
        expect(response.status).to.eq(200)
        const token = response.body.authorization;

    
         window.localStorage.setItem('serverest/userToken', token);
    

    })
})

Cypress.Commands.add('excluirUsuario', id => {
    return cy.request({
        method: 'DELETE',
        url: `${Cypress.env('urlApi')}/usuarios/${id}`,
        failOnStatusCode: false
    })
})