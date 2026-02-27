import { faker } from "@faker-js/faker";

describe("[SR-7] Editar Usuário", () => {
  let dadosDinamicos;
  let idUsuario;

  beforeEach(() => {
    dadosDinamicos = {
      nome: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      administrador: "true",
    };
  });

  afterEach(() => {
    if (idUsuario) {
      cy.API_excluirUsuario(idUsuario);
    }
  });

  it("alterado com sucesso", () => {
    const usuarioAtualizado = {
      nome: dadosDinamicos.nome,
      email: dadosDinamicos.email,
      password: faker.internet.password(),
      administrador: "true",
    };

    cy.API_cadastrarUsuario(dadosDinamicos).then((response) => {
      expect(response.status).to.eq(201);
      idUsuario = response.body._id;

      cy.API_editarUsuario(usuarioAtualizado, idUsuario).then(
        (responseEdit) => {
          const body = responseEdit.body;
          expect(responseEdit.status).to.eq(200);
          expect(body).to.have.property("message");
          expect(body.message).to.include("alterado com sucesso");
        }
      );
    });
  });
  it.only("email ja cadastrado", () => {
    const usuarioBase = {
      nome: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      administrador: "true",
    };

    const usuarioAtualizado = {
      nome: dadosDinamicos.nome,
      email: usuarioBase.email,
      password: dadosDinamicos.password,
      administrador: "true",
    };

    cy.API_cadastrarUsuario(usuarioBase).then((resBase) => {
      const idBase = resBase.body._id;

      cy.API_cadastrarUsuario(dadosDinamicos).then((response) => {
        expect(response.status).to.eq(201);
        idUsuario = response.body._id;

        cy.API_editarUsuario(usuarioAtualizado, idUsuario).then(
          (responseEdit) => {
            const body = responseEdit.body;

            expect(responseEdit.status).to.eq(400);
            expect(body).to.have.property("message");
            expect(body.message).to.include("email já está sendo usado");
          }
        );
      });

      cy.API_excluirUsuario(idBase);
    });
  });
});
