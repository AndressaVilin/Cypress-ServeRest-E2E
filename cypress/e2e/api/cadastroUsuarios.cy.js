import { faker } from "@faker-js/faker";
import usuario from "../../fixtures/usuariosInvalidos.json";

describe("[SER-1] Cadastro de Usuários", () => {
  const novoUsuario = {
    nome: faker.person.firstName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    administrador: "true",
  };

  it("Deve cadastrar um novo usuário com sucesso", () => {
    cy.cadastrarUsuario(novoUsuario).then((response) => {
      const body = response.body;
      expect(response.status).to.eq(201);
      expect(body).to.have.property("_id");
      expect(body.message).to.include("sucesso");
    });
  });

  it("Não deve permitir cadastro com e-mail já utilizado", () => {
    cy.cadastrarUsuario(novoUsuario).then(() => {
      cy.cadastrarUsuario(novoUsuario).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body.message).to.include("usado");
      });
    });
  });

  it("Deve validar que o e-mail não pode estar em branco", () => {
    cy.cadastrarUsuario(usuario.usuarioEmailVazio).then((response) => {
      const body = response.body;
      expect(response.status).to.eq(400);
      expect(body.email).to.include("branco");
    });
  });

  it("Deve validar que a senha não pode estar em branco", () => {
    cy.cadastrarUsuario(usuario.usuarioSenhaVazia).then((response) => {
      const body = response.body;
      expect(response.status).to.eq(400);
      expect(body.password).to.include("branco");
    });
  });
});
