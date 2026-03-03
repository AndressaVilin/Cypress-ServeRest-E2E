import { faker } from "@faker-js/faker";

describe("[SR-23] Excluir Produto", () => {
  let dadosAdmin;
  let idAdmin;
  let dadosProduto;
  let token;

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
    cy.API_login(dadosAdmin);

    dadosProduto = {
      nome: faker.commerce.productName(),
      preco: faker.number.int({ min: 10, max: 1000 }),
      descricao: faker.commerce.productDescription(),
      quantidade: faker.number.int({ min: 1, max: 500 }),
    };
  });

  after(() => {
    if (idAdmin) {
      cy.API_excluirUsuario(idAdmin);
    }
  });

  it("Deve excluir produto com sucesso", () => {
    cy.API_cadastrarProduto(token, dadosProduto);

    cy.visit("/admin/listarprodutos");

    cy.get(".jumbotron").should("be.visible").and("contain", dadosProduto.nome);

    cy.UI_excluirProduto(dadosProduto);

    cy.get(".jumbotron", { timeout: 2000 }).should(
      "not.contain",
      dadosProduto.nome
    );

    cy.API_listarProdutos().then((response) => {
      const produto = response.body.produtos.find(
        (p) => p.nome === dadosProduto.nome
      );
      if (produto) {
        cy.API_excluirProduto(token, produto._id).then((res) => {
          expect(res.status).to.eq(200);
        });
      }
    });
  });
});
