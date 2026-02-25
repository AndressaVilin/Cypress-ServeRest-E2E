
    Cypress.Commands.add('UI_cadastrarUsuario', usuario => {
        cy.visit('/admin/cadastrarusuarios')

        cy.get('[data-testid="nome"]').type(usuario.nome) 
        cy.get('[data-testid="email"]').type(usuario.email)
        cy.get('[data-testid="password"]').type(usuario.password)
        cy.get('[data-testid="cadastrarUsuario"]').click()    
    })