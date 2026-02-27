import { faker } from "@faker-js/faker";
import usuarios from "../../fixtures/usuariosInvalidos.json";

describe("[SR-5] Cadastro de Usuários", () => {
  let dadosDinamicos;

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
      nome: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };
  });

  afterEach(() => {
    if (dadosDinamicos && dadosDinamicos.email) {
      cy.API_listarUsuarios().then((response) => {
        const user = response.body.usuarios.find(
          (u) => u.email === dadosDinamicos.email
        );
        if (user) {
          cy.API_excluirUsuario(user._id)
        }
      });
    }
  });

  it("Deve cadastrar um novo usuário com sucesso", () => {
    cy.API_login(dadosAdmin);
    cy.UI_cadastrarUsuario(dadosDinamicos);

    cy.url().should("include", "/admin/listarusuarios");

    cy.get(".jumbotron")
      .should("be.visible")
      .and("contain", dadosDinamicos.nome)
      .and("contain", dadosDinamicos.email);
  });

  it("Não deve permitir cadastro com e-mail já utilizado", () => {
    cy.API_login(dadosAdmin);
    cy.UI_cadastrarUsuario(dadosDinamicos);
    cy.url().should("include", "/admin/listarusuarios");

    cy.UI_cadastrarUsuario(dadosDinamicos);
    cy.get(".alert", { timeout: 2000 })
      .should("be.visible")
      .and("contain", "Este email já está sendo usado");
  });

  it("Deve validar que o e-mail não pode estar vazio", () => {
    cy.API_login(dadosAdmin);
    cy.UI_cadastrarUsuario(usuarios.usuarioSemEmail);

    cy.get(".alert", { timeout: 2000 })
      .should("be.visible")
      .and("contain", "Email é obrigatório");
  });
});
