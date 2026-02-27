import { faker } from "@faker-js/faker";
import usuario from "../../fixtures/usuariosInvalidos.json";

describe("[SR-4] Login", () => {
  let idUsuario;

  beforeEach(() => {
    idUsuario = null;
  });

  afterEach(() => {
    if (idUsuario) {
      cy.API_excluirUsuario(idUsuario);
    }
  });
  it("Deve realizar login com sucesso", () => {
     const dadosUsuario = {
      nome: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      administrador: "true",
    };

    cy.API_cadastrarUsuario(dadosUsuario).then((response) => {
      idUsuario = response.body._id;
    });

    cy.API_login(dadosUsuario).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property("message");
      expect(response.body.message).to.include("sucesso");

      expect(response.body).to.have.property("authorization");
    });
  });

  it("Não deve permitir login com usuario inexistente", () => {
    cy.API_login(usuario.usuarioInexistente).then((response) => {
      expect(response.status).to.eq(401);
      expect(response.body).to.have.property("message");
      expect(response.body.message).to.include("Email e/ou senha inválidos");
    });
  });
});
