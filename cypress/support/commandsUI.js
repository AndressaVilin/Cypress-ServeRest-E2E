    Cypress.Commands.add('UI_cadastrarUsuario', usuario => {
        cy.visit('/admin/cadastrarusuarios')

        cy.get('[data-testid="nome"]').type(usuario.nome) 
        cy.get('[data-testid="email"]').type(usuario.email)
        cy.get('[data-testid="password"]').type(usuario.password)
        cy.get('[data-testid="cadastrarUsuario"]').click()    
    })

    Cypress.Commands.add('UI_login', usuario => {
            cy.visit('/')
            cy.get('[data-testid="email"]').type(usuario.email)
            cy.get('[data-testid="senha"]').type(usuario.password)
            cy.get('[data-testid="entrar"]').click()
    })

    Cypress.Commands.add('UI_editarUsuario', usuario => {
        cy.visit('/admin/listarusuarios')
        cy.contains('tr', usuario.email).within(() => {
            cy.get('.btn-info')
        .click()
        })   
    })