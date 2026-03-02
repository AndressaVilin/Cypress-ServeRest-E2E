import { faker } from "@faker-js/faker";

describe("[SR-9] Rditar Usuário", () => {
  let dadosDinamicos;
  let idUsuario;
  let idAdmin;

  const dadosAdmin = {
    nome: faker.person.firstName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    administrador: "true",
  };

  before(() => {
    cy.API_cadastrarUsuario(dadosAdmin).then((response) => {
      idAdmin = response.body._id;
    });
  });

  after(() => {
    if (idAdmin) {
      cy.API_excluirUsuario(idAdmin);
    }
  });

  beforeEach(() => {
    idUsuario = null;
    dadosDinamicos = {
      nome: faker.person.firstName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      administrador: "false",
    };
  });

  afterEach(() => {
    if (idUsuario) {
      cy.API_excluirUsuario(idUsuario);
    }
  });

  it("alterado com sucesso", () => {
    cy.API_login(dadosAdmin);

    const novoNome = faker.person.firstName();

    cy.API_cadastrarUsuario(dadosDinamicos).then((response) => {
      idUsuario = response.body._id;
      expect(response.body).to.have.property("_id");

      cy.API_editarUsuario(
        { ...dadosDinamicos, nome: novoNome },
        idUsuario
      ).then((resPut) => {
        expect(resPut.status).to.eq(200);
        cy.visit("/admin/listarusuarios");
        cy.contains("td", novoNome, { timeout: 2000 }).should("be.visible");
      });
    });
  });
});
