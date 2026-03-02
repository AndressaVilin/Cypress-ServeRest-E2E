import { faker } from "@faker-js/faker";

describe("[SR-16] Carrinho", () => {
  let carrinho;
  let produto;
  let idProduto;
  let tokenAdmin;
  let idAdmin;
  let tokenUsuario;
  let dadosAdmin;
  let idCarrinho;

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
        tokenAdmin = resLog.body.authorization;
      });
    });
  });

  beforeEach(() => {
    produto = {
      nome: faker.commerce.productName(),
      preco: faker.number.int({ min: 10, max: 1000 }),
      descricao: faker.commerce.productDescription(),
      quantidade: 5,
    };

    cy.API_cadastrarProduto(tokenAdmin, produto).then((response) => {
      idProduto = response.body._id;
    });
  });

  afterEach(() => {
    cy.API_cancelarCarrinho(tokenAdmin);

    if(tokenUsuario){
        cy.API_cancelarCarrinho(tokenUsuario);
        tokenUsuario = null;
    }

    if (idProduto) {
      cy.API_excluirProduto(tokenAdmin, idProduto);
      idProduto = null;
    }
  });

  after(() => {
    if (idAdmin) {
      cy.API_excluirUsuario(idAdmin);
      idAdmin = null;
    }
  });

  it("Deve cadastrar carrinho com sucesso", () => {
    const usuarioComum = {
      nome: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      administrador: "true",
    };

    carrinho = {
      produtos: [
        {
          idProduto: idProduto,
          quantidade: 2,
        },
      ],
    };

    cy.API_cadastrarUsuario(usuarioComum).then((response) => {
      expect(response.status).to.eq(201);

      cy.API_login(usuarioComum).then((resLog) => {
        tokenUsuario = resLog.body.authorization;

        cy.API_cadastrarCarrinho(tokenUsuario, carrinho).then((resCar) => {
          const body = resCar.body;
          expect(resCar.status).to.eq(201);
          expect(body).to.have.property("message");
          expect(body.message).to.include("Cadastro realizado com sucesso");
        });
      });
    });
  });

  it("Deve mostrar erro 400 ao cadastrar carrinho com quantidade superior ao estoque", () => {
    carrinho = {
      produtos: [
        {
          idProduto: idProduto,
          quantidade: 10,
        },
      ],
    };

    cy.API_cadastrarCarrinho(tokenAdmin, carrinho).then((response) => {
      const body = response.body;
      expect(response.status).to.eq(400);
      expect(body).to.have.property("message");
      expect(body.message).to.include(
        "Produto não possui quantidade suficiente"
      );
    });
  });

  it("Deve mostrar erro 400 ao cadastrar carrinho com produto duplicado", () => {
    carrinho = {
      produtos: [
        {
          idProduto: idProduto,
          quantidade: 2,
        },
        {
          idProduto: idProduto,
          quantidade: 1,
        },
      ],
    };

    cy.API_cadastrarCarrinho(tokenAdmin, carrinho).then((response) => {
      const body = response.body;
      expect(response.status).to.eq(400);
      expect(body).to.have.property("message");
      expect(body.message).to.include(
        "Não é permitido possuir produto duplicado"
      );
    });
  });

  it("Deve mostrar erro 400 ao cadastrar carrinho com produto inexistente", () => {
    carrinho = {
      produtos: [
        {
          idProduto: "0000000000000000",
          quantidade: 2,
        },
      ],
    };

    cy.API_cadastrarCarrinho(tokenAdmin, carrinho).then((response) => {
      const body = response.body;
      expect(response.status).to.eq(400);
      expect(body).to.have.property("message");
      expect(body.message).to.include("Produto não encontrado");
    });
  });

  it("Deve mostrar erro 401 ao cadastrar carrinho usando token invalido", () => {
    const tokenInvalido = "Token invalido";

    carrinho = {
      produtos: [
        {
          idProduto: idProduto,
          quantidade: 4,
        },
      ],
    };

    cy.API_cadastrarCarrinho(tokenInvalido, carrinho).then((response) => {
      const body = response.body;
      expect(response.status).to.eq(401);
      expect(body).to.have.property("message");
      expect(body.message).to.include("Token de acesso ausente, inválido");
    });
  });

  it("Deve lista carrinhos com sucesso", () => {
    cy.API_listarCarrinhos().then((response) => {
      expect(response.status).to.eq(200);
    });
  });

  it("Deve mostrar carrinho especificado com sucesso", () => {
    carrinho = {
      produtos: [
        {
          idProduto: idProduto,
          quantidade: 2,
        },
      ],
    };

    cy.API_cadastrarCarrinho(tokenAdmin, carrinho).then((response) => {
      idCarrinho = response.body._id;
      expect(response.status).to.eq(201);
      cy.API_procurarCarrinho(idCarrinho).then((resCar) => {
        expect(resCar.status).to.eq(200);
      });
    });
  });

  it("Deve mostrar messagem de erro ao tentar procurar carrinho que não existe", () => {
    idCarrinho = "0000000000000000";
    cy.API_procurarCarrinho(idCarrinho).then((response) => {
      expect(response.status).to.eq(400);
    });
  });

  it("Deve concluir compra de um carrinho", () => {
    carrinho = {
      produtos: [
        {
          idProduto: idProduto,
          quantidade: 2,
        },
      ],
    };

    cy.API_cadastrarCarrinho(tokenAdmin, carrinho).then((response) => {
      idCarrinho = response.body._id;
      expect(response.status).to.eq(201);
      cy.API_concluirCompra(tokenAdmin).then((resCar) => {
        const body = resCar.body;
        expect(resCar.status).to.eq(200);
        expect(body).to.have.property("message");
        expect(body.message).to.include("Registro excluído com sucesso");
      });
    });
  });

  it("Deve cancelar compra de um carrinho", () => {
    const tokenInvalido = "Token invalido";

    carrinho = {
      produtos: [
        {
          idProduto: idProduto,
          quantidade: 2,
        },
      ],
    };

    cy.API_cadastrarCarrinho(tokenAdmin, carrinho).then((response) => {
      idCarrinho = response.body._id;
      expect(response.status).to.eq(201);
      cy.API_concluirCompra(tokenInvalido).then((resCar) => {
        const body = resCar.body;
        expect(resCar.status).to.eq(401);
        expect(body).to.have.property("message");
        expect(body.message).to.include(
          "Token de acesso ausente, inválido, expirado ou usuário do token não existe mais"
        );
      });
    });
  });
});
