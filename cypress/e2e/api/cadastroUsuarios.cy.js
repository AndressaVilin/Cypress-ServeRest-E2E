import { faker } from "@faker-js/faker";
import usuario from "../../fixtures/usuariosInvalidos.json";

describe("[SER-1] Cadastro de Usuários", () => {
  let dadosDinamicos;
  let idUsuario;

  beforeEach(() => {
      dadosDinamicos = {
      nome: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      administrador: "true"
      }
  })

  afterEach(() => {
    if(idUsuario) {
      cy.excluirUsuario(idUsuario)
      idUsuario = null
    }
  })
  it("Deve cadastrar um novo usuário com sucesso", () => {
    cy.cadastrarUsuario(dadosDinamicos).then((response) => {
      const body = response.body;
      idUsuario = response.body._id
      expect(response.status).to.eq(201);
      expect(body).to.have.property("_id");
      expect(body.message).to.include("sucesso");
    });
  });

  it("Não deve permitir cadastro com e-mail já utilizado", () => {
    cy.cadastrarUsuario(dadosDinamicos).then(response => {
      idUsuario = response.body._id;

      cy.cadastrarUsuario(dadosDinamicos).then((response) => {
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
