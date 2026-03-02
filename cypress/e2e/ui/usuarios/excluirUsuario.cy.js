import { faker } from "@faker-js/faker";

describe("[SR-21] Excluir Usuário", () => {
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

  it("excluir usuario com sucesso", () => {
    cy.API_login(dadosAdmin);

    cy.API_cadastrarUsuario(dadosDinamicos).then((response) => {
      expect(response.status).to.eq(201);
      cy.visit("/admin/listarusuarios");
      cy.contains("td", dadosDinamicos.email, { timeout: 1000 }).should(
        "be.visible"
      );

      cy.UI_excluirUsuario(dadosDinamicos).then(() => {
        cy.contains("td", dadosDinamicos.email, { timeout: 5000 }).should(
          "not.exist"
        );
      });
    });
  });

  // FAZER EXCLUSAO DE USUARIO COM CARRINHO
});
