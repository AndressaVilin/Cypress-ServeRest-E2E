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

    Cypress.Commands.add('UI_excluirUsuario', usuario => {
        cy.visit('/admin/listarusuarios')

        cy.contains('tr', usuario.email).within(() => {
            cy.get('.btn-danger')
        .click()
        })   
    })

    Cypress.Commands.add('UI_cadastrarProduto', produto => {
        cy.visit('/admin/cadastrarprodutos')

        cy.get('[data-testid="nome"]').type(produto.nome)
        cy.get('[data-testid="preco"]').type(produto.preco)
        cy.get('[data-testid="nome"]').type(produto.nome)
        cy.get('[data-testid="descricao"]').type(produto.descricao)
        cy.get('[data-testid="quantity"]').type(produto.quantidade)

        cy.get('[data-testid="cadastarProdutos"]').click()

    })

    Cypress.Commands.add('UI_excluirProduto', produto => {
        cy.visit('/admin/listarprodutos')
        cy.contains('tr', produto.nome).within(() => {
            cy.get('.btn-danger')
        .click()
        })  
    })
