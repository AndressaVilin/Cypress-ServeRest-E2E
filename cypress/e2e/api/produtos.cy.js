import { faker } from "@faker-js/faker";

describe("[SR-11] Produtos", () => {
  let dadosProduto;
  let idProduto;
  let dadosAdmin;
  let token;
  let idUsuario;
  let idAdmin;

  before(() => {
    dadosAdmin = {
      nome: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      administrador: "true",
    };

    cy.API_cadastrarUsuario(dadosAdmin).then((response) => {
      idAdmin = response.body._id;
      cy.API_login(dadosAdmin).then((resLog) => {
        token = resLog.body.authorization;
      });
    });
  });

  beforeEach(() => {
    dadosProduto = {
      nome: faker.commerce.productName(),
      preco: faker.number.int({ min: 10, max: 1000 }),
      descricao: faker.commerce.productDescription(),
      quantidade: faker.number.int({ min: 1, max: 500 }),
    };
  });

  afterEach(() => {
    if (idProduto) {
      cy.API_excluirProduto(token, idProduto);
      idProduto = null;
    }
  });

  after(() => {
    if (idAdmin) {
      cy.API_excluirUsuario(idAdmin);
      idAdmin = null;
    }
  });

  it("Deve cadastrar com sucesso", () => {
    cy.API_cadastrarProduto(token, dadosProduto).then((response) => {
      idProduto = response.body._id;
      const body = response.body;

      expect(response.status).to.eq(201);
      expect(body).to.have.property("message");
      expect(body.message).to.include("Cadastro realizado com sucesso");
    });
  });

  it("Não deve permitir criar produto com mesmo nome", () => {
    cy.API_cadastrarProduto(token, dadosProduto).then((response) => {
      idProduto = response.body._id;
      expect(response.status).to.eq(201);

      cy.API_cadastrarProduto(token, dadosProduto).then((resProd) => {
        const body = resProd.body;

        expect(resProd.status).to.eq(400);
        expect(body).to.have.property("message");
        expect(body.message).to.include("Já existe produto com esse nome");
      });
    });
  });

  it("Não deve permitir criar produto com token invalido", () => {
    const tokenInvalido = "tokenInvalido";
    cy.API_cadastrarProduto(tokenInvalido, dadosProduto).then((response) => {
      const body = response.body;

      expect(response.status).to.eq(401);
      expect(body).to.have.property("message");
      expect(body.message).to.include("Token de acesso ausente");
    });
  });

  it("Não deve permitir usuário não administrador criar produto", () => {
    const usuario = {
      nome: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      administrador: "false",
    };

    cy.API_cadastrarUsuario(usuario).then((response) => {
      idUsuario = response.body._id;
      cy.API_login(usuario).then((resLog) => {
        const tokenInvalido = resLog.body.authorization;

        cy.API_cadastrarProduto(tokenInvalido, dadosProduto).then((resProd) => {
          const body = resProd.body;

          expect(resProd.status).to.eq(403);
          expect(body).to.have.property("message");
          expect(body.message).to.include(
            "Rota exclusiva para administradores"
          );

          cy.API_excluirUsuario(idUsuario);
        });
      });
    });
  });

  it("Deve retornar lista dos produtos", () => {
    cy.API_listarProdutos().then((response) => {
      expect(response.status).to.eq(200);
    });
  });

  it("Deve retornar produto com id existente com sucesso", () => {
    cy.API_cadastrarProduto(token, dadosProduto).then((response) => {
      idProduto = response.body._id;
      expect(response.status).be.eq(201);

      cy.API_procurarProduto(idProduto).then((res) => {
        expect(res.status).to.eq(200);
      });
    });
  });

  it("Deve retornar erro 400 ao procurar usuário com id inexistente", () => {
    const id = "0000000000000000";

    cy.API_procurarProduto(id).then((response) => {
      const body = response.body;

      expect(response.status).to.eq(400);
      expect(body).to.have.property("message");
      expect(body.message).to.include("Produto não encontrado");
    });
  });

  it("Deve excluir produto com sucesso", () => {
    cy.API_cadastrarProduto(token, dadosProduto).then((response) => {
      expect(response.status).to.eq(201);
      idProduto = response.body._id;

      cy.API_excluirProduto(token, idProduto).then((response) => {
        const body = response.body;
        expect(response.status).to.eq(200);
        expect(body).to.have.property("message");
        expect(body.message).to.include("Registro excluído com sucesso");
      });
    });
  });

  it("Não deve permitir excluir produto que faz parte de carrinho", () => {
    cy.API_cadastrarProduto(token, dadosProduto).then((response) => {
      expect(response.status).to.eq(201);
      idProduto = response.body._id;
      const carrinho = {
        produtos: [
          {
            idProduto: idProduto,
            quantidade: 2,
          },
        ],
      };
      cy.API_cadastrarCarrinho(token, carrinho).then(() => {
        cy.API_excluirProduto(token, idProduto).then((resProd) => {
          const body = resProd.body;
          expect(resProd.status).to.eq(400);
          expect(body).to.have.property("message");
          expect(body.message).to.include(
            "Não é permitido excluir produto que faz parte de carrinho"
          );

          cy.API_cancelarCarrinho(token);
        });
      });
    });
  });

  it("Não deve permitir excluir produto com token invalido", () => {
    const tokenInvalido = "Token invalido";
    cy.API_cadastrarProduto(token, dadosProduto).then((response) => {
      expect(response.status).to.eq(201);
      idProduto = response.body._id;

      cy.API_excluirProduto(tokenInvalido, idProduto).then((response) => {
        const body = response.body;
        expect(response.status).to.eq(401);
        expect(body).to.have.property("message");
        expect(body.message).to.include("Token de acesso ausente");
      });
    });
  });

  it("Não deve permitir usuário não administrador excluir produto", () => {
    const usuario = {
      nome: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      administrador: "false",
    };

    cy.API_cadastrarUsuario(usuario).then((response) => {
      idUsuario = response.body._id;
      cy.API_login(usuario).then((resLog) => {
        const tokenInvalido = resLog.body.authorization;

        cy.API_cadastrarProduto(token, dadosProduto).then((response) => {
          expect(response.status).to.eq(201);
          idProduto = response.body._id;

          cy.API_excluirProduto(tokenInvalido, idProduto).then((response) => {
            const body = response.body;
            expect(response.status).to.eq(403);
            expect(body).to.have.property("message");
            expect(body.message).to.include(
              "Rota exclusiva para administradores"
            );
          });
        });
      });
    });
  });

  it("Deve editar produto com sucesso", () => {
    const nomeAtualizado = faker.commerce.productName();

    cy.API_cadastrarProduto(token, dadosProduto).then((response) => {
      expect(response.status).to.eq(201);
      idProduto = response.body._id;

      cy.API_editarProduto(token, idProduto, {
        ...dadosProduto,
        nome: nomeAtualizado,
      }).then((resEdit) => {
        const body = resEdit.body;
        expect(resEdit.status).to.eq(200);
        expect(body).to.have.property("message");
        expect(body.message).to.include("Registro alterado com sucesso");
      });
    });
  });

  it("Não deve permitir editar produto com nome existente", () => {
    const dadosBase = {
      nome: faker.commerce.productName(),
      preco: faker.number.int({ min: 10, max: 1000 }),
      descricao: faker.commerce.productDescription(),
      quantidade: faker.number.int({ min: 1, max: 500 }),
    };

    cy.API_cadastrarProduto(token, dadosBase).then((response) => {
      expect(response.status).to.eq(201);
      const idBase = response.body._id;

      cy.API_cadastrarProduto(token, dadosProduto).then((res) => {
        expect(response.status).to.eq(201);
        idProduto = res.body._id;

        cy.API_editarProduto(token, idProduto, {
          ...dadosProduto,
          nome: dadosBase.nome,
        }).then((resEdit) => {
          const body = resEdit.body;
          expect(resEdit.status).to.eq(400);
          expect(body).to.have.property("message");
          expect(body.message).to.include("Já existe produto com esse nome");

          cy.API_excluirProduto(token, idBase);
        });
      });
    });
  });

  it("Não deve permitir editar produto com token invalido", () => {
    const tokenInvalido = "Token invalido";

    cy.API_cadastrarProduto(token, dadosProduto).then((response) => {
      expect(response.status).to.eq(201);

      cy.API_cadastrarProduto(tokenInvalido, dadosProduto).then((resEdit) => {
        const body = resEdit.body;
        expect(resEdit.status).to.eq(401);
        expect(body).to.have.property("message");
        expect(body.message).to.include("Token de acesso ausente, inválido");
      });
    });
  });

  it("Não deve permitir usuário não administrador editar produto", () => {
    const usuario = {
      nome: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      administrador: "false",
    };

    const nomeAtualizado = faker.commerce.productName();

    cy.API_cadastrarUsuario(usuario).then((response) => {
      idUsuario = response.body._id;
      cy.API_login(usuario).then((resLog) => {
        const tokenInvalido = resLog.body.authorization;

        cy.API_cadastrarProduto(token, dadosProduto).then((response) => {
          expect(response.status).to.eq(201);
          idProduto = response.body._id;

          cy.API_editarProduto(tokenInvalido, idProduto, {
            ...dadosProduto,
            nome: nomeAtualizado,
          }).then((response) => {
            const body = response.body;
            expect(response.status).to.eq(403);
            expect(body).to.have.property("message");
            expect(body.message).to.include(
              "Rota exclusiva para administradores"
            );
          });
        });
      });
    });
  });
});
