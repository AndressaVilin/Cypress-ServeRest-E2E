import { faker } from "@faker-js/faker";
import usuario from "../../fixtures/usuariosInvalidos.json";

describe("[SR-6] Login - UI", () => {
  let dadosDinamicos;

  afterEach(() => {
    if (dadosDinamicos && dadosDinamicos.email) {
      cy.request({
        method: "GET",
        url: `${Cypress.env("urlApi")}/usuarios`,
      }).then((response) => {
        const user = response.body.usuarios.find(
          (u) => u.email === dadosDinamicos.email
        );
        if (user) {
          cy.API_excluirUsuario(user._id).then((delResponse) => {
            expect(delResponse.status).to.be.eq(200);
          });
        }
      });
    }
  });

  before(() => {
    dadosDinamicos = {
      nome: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      administrador: "true",
    };

    cy.API_cadastrarUsuario(dadosDinamicos);
  });

  it("Deve realizar login com sucesso", () => {
    cy.UI_login(dadosDinamicos);

    cy.get("h1", { timeout: 2000 }).should("contain", "Bem Vindo");
    cy.url().should("include", "/home");
  });

  it("Não deve permitir login com usuario inexistente", () => {
    cy.UI_login(usuario.usuarioInexistente);

    cy.get(".alert", { timeout: 1000 })
      .should("be.visible")
      .and("contain", "Email e/ou senha inválidos");
  });
});
