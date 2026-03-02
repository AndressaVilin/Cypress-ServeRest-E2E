import { faker } from "@faker-js/faker";
import usuario from "../../fixtures/usuariosInvalidos.json";

describe("[SR-4] Usuários", () => {
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
      idUsuario = null;
    }
  });

  it("Deve realizar login com sucesso", () => {
    cy.API_cadastrarUsuario(dadosDinamicos).then((response) => {
      idUsuario = response.body._id;

      cy.API_login(dadosDinamicos).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property("message");
        expect(response.body.message).to.include("sucesso");

        expect(response.body).to.have.property("authorization");
      });
    });
  });

  it("Não deve permitir login com usuario inexistente", () => {
    cy.API_login(usuario.usuarioInexistente).then((response) => {
      expect(response.status).to.eq(401);
      expect(response.body).to.have.property("message");
      expect(response.body.message).to.include("Email e/ou senha inválidos");
    });
  });
  it("Deve cadastrar um novo usuário com sucesso", () => {
    cy.API_cadastrarUsuario(dadosDinamicos).then((response) => {
      const body = response.body;
      idUsuario = response.body._id;
      expect(response.status).to.eq(201);
      expect(body).to.have.property("_id");
      expect(body.message).to.include("sucesso");
    });
  });

  it("Não deve permitir cadastro com e-mail já utilizado", () => {
    cy.API_cadastrarUsuario(dadosDinamicos).then((response) => {
      idUsuario = response.body._id;

      cy.API_cadastrarUsuario(dadosDinamicos).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body.message).to.include("usado");
      });
    });
  });

  it("Deve validar que o e-mail não pode estar em branco", () => {
    cy.API_cadastrarUsuario(usuario.usuarioEmailVazio).then((response) => {
      const body = response.body;
      expect(response.status).to.eq(400);
      expect(body.email).to.include("branco");
    });
  });

  it("Deve validar que a senha não pode estar em branco", () => {
    cy.API_cadastrarUsuario(usuario.usuarioSenhaVazia).then((response) => {
      const body = response.body;
      expect(response.status).to.eq(400);
      expect(body.password).to.include("branco");
    });
  });

  it("Deve retornar lista dos usuários", () => {
    cy.API_listarUsuarios().then((response) => {
      expect(response.status).to.eq(200);
    });
  });

  it("Deve retornar usuário com id existente com sucesso", () => {
    cy.API_cadastrarUsuario(dadosDinamicos).then((response) => {
      idUsuario = response.body._id;
      expect(response.status).to.eq(201);

      cy.API_procurarUsuario(idUsuario).then((res) => {
        expect(res.status).to.eq(200);
      });
    });
  });

  it("Deve retornar erro 400 ao procurar usuário com id inexistente", () => {
    const id = "0000000000000000";

    cy.API_procurarUsuario(id).then((response) => {
      const body = response.body;

      expect(response.status).to.eq(400);
      expect(body).to.have.property("message");
      expect(body.message).to.include("Usuário não encontrado");
    });
  });
  it("Deve excluir usuário com sucesso", () => {
    cy.API_cadastrarUsuario(dadosDinamicos).then((response) => {
      expect(response.status).to.eq(201);
      idUsuario = response.body._id;

      cy.API_excluirUsuario(idUsuario).then((resDel) => {
        expect(resDel.status).to.eq(200);
        expect(resDel.body).to.have.property("message");
        expect(resDel.body.message).to.include("Registro excluído com sucesso");
      });
    });
  });

  it("Não deve excluir usuário com carrinho ativo", () => {
    const produto = {
      nome: faker.commerce.productName(),
      preco: faker.number.int({ min: 10, max: 1000 }),
      descricao: faker.commerce.productDescription(),
      quantidade: 5,
    };

    cy.API_cadastrarUsuario(dadosDinamicos).then((response) => {
      idUsuario = response.body._id;

      cy.API_login(dadosDinamicos).then((resLog) => {
        const token = resLog.body.authorization;

        cy.API_cadastrarProduto(token, produto).then((resProd) => {
          const idProduto = resProd.body._id;
          const carrinho = {
            produtos: [
              {
                idProduto: idProduto,
                quantidade: 1,
              },
            ],
          };

          cy.API_cadastrarCarrinho(token, carrinho).then(() => {
            cy.API_excluirUsuario(idUsuario).then((resCar) => {
              const body = resCar.body;
              expect(resCar.status).to.eq(400);
              expect(body).to.have.property("message");
              expect(body).to.have.property("idCarrinho");
              expect(body.message).to.include(
                "Não é permitido excluir usuário com carrinho cadastrado"
              );

              cy.API_cancelarCarrinho(token).then(() => {
                cy.API_excluirProduto(token, idProduto);
              });
            });
          });
        });
      });
    });
  });

  it("Deve editar usuário com sucesso", () => {
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

  it("Não deve permitir editar usuário usando um email ja cadastrado", () => {
    const usuarioBase = {
      nome: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      administrador: "true",
    };

    cy.API_cadastrarUsuario(usuarioBase).then((resBase) => {
      const idBase = resBase.body._id;

      cy.API_cadastrarUsuario(dadosDinamicos).then((response) => {
        expect(response.status).to.eq(201);
        idUsuario = response.body._id;

        cy.API_editarUsuario(
          { ...dadosDinamicos, email: usuarioBase.email },
          idUsuario
        ).then((responseEdit) => {
          const body = responseEdit.body;

          expect(responseEdit.status).to.eq(400);
          expect(body).to.have.property("message");
          expect(body.message).to.include("email já está sendo usado");
        });
      });

      cy.API_excluirUsuario(idBase);
    });
  });
});
