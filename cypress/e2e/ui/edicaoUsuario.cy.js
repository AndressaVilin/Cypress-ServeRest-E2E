import { faker } from "@faker-js/faker";

describe('[SR-9] Rditar Usuário', () => {

  let dadosDinamicos;
  let idUsuario;

  const dadosAdmin = {
    nome: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    administrador: "true",
  };

  before(() => {
    cy.API_cadastrarUsuario(dadosAdmin);
  });

    beforeEach(() => {
        dadosDinamicos = {
        nome: "Andressa",
        email: faker.internet.email(),
        password: faker.internet.password(),
      };
    });

    afterEach(() => {
      if (idUsuario) {
        cy.API_excluirUsuario(idUsuario);
      }
    })

    it.only('alterado com sucesso', () => {
      
      const dadosNovos = {
        nome: faker.person.fullName(),
        email: faker.internet.email(),
        password: 'teste'
    }
    const novoNome =  "Laaaaaa"

      cy.API_cadastrarUsuario(dadosDinamicos)
      .then(response => {

        idUsuario = response.body._id
        cy.API_login(dadosAdmin)
        cy.visit('/admin/listarusuarios')
        cy.contains('td', dadosDinamicos.nome, {timeout: 1000}).should('be.visible')


        //cy.API_editarUsuario({...dadosNovos, nome: novoNome}, idUsuario).then(() => {
         // cy.API_login(dadosAdmin)
          
          //cy.visit('/admin/listarusuarios')
         
        //  cy.contains('td', novoNome, {timeout: 1000}).should('be.visible')
       // })
       })
      
      })

    })
