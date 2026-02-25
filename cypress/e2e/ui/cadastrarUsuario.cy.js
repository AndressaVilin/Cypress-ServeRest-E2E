import {faker} from '@faker-js/faker'
import usuarios from '../../fixtures/usuariosInvalidos.json'

describe('[SER-2] Cadastro de Usuários', () => {

    let dadosDinamicos;

    const dadosAdmin = {
            nome: faker.person.fullName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
            administrador: "true"
    }

    before(() => {
        cy.cadastrarUsuario(dadosAdmin)
    })
    

    beforeEach(() => {
        dadosDinamicos = {
            nome: faker.person.fullName(),
            email: faker.internet.email(),
            password: faker.internet.password()
        }
    })

    afterEach(() => {
        if(dadosDinamicos && dadosDinamicos.email){
            cy.request({
                method: 'GET',
                url: `${Cypress.env('urlApi')}/usuarios`
        }).then( response => {
            const user = response.body.usuarios.find(u => u.email === dadosDinamicos.email)
            if(user){
                cy.excluirUsuario(user._id).then((delResponse) => {
                    expect(delResponse.status).to.be.eq(200)})
            }
        })
        }
        
})

    it('Deve cadastrar um novo usuário com sucesso', () => {
        cy.login(dadosAdmin)
        cy.UI_cadastrarUsuario(dadosDinamicos)

       cy.url().should('include', '/admin/listarusuarios')
        
    cy.get('.jumbotron')
     .should('be.visible')
      .and('contain',dadosDinamicos.nome)
      .and('contain',dadosDinamicos.email)
    })

    it('Não deve permitir cadastro com e-mail já utilizado', ()=> {
        cy.login(dadosAdmin)
        cy.UI_cadastrarUsuario(dadosDinamicos)
        cy.url().should('include', '/admin/listarusuarios')

        cy.UI_cadastrarUsuario(dadosDinamicos)
        cy.get('.alert', {timeout: 2000})
        .should('be.visible')
        .and('contain','Este email já está sendo usado')
    })

    it('Deve validar que o e-mail não pode estar vazio', () => {
        cy.login(dadosAdmin)
        cy.UI_cadastrarUsuario(usuarios.usuarioSemEmail)

        cy.get('.alert', {timeout: 1000})
        .should('be.visible')
        .and('contain', 'Email é obrigatório')
    })   
})