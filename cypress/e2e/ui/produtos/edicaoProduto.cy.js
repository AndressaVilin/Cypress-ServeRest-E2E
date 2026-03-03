import { faker } from "@faker-js/faker";

describe("[SR-23] Editar Produto", () => {
  let dadosAdmin;
  let idAdmin;
  let dadosProduto;
  let token;
  let idProduto;

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

  it("Deve editar produto com sucesso", () => {
    const novoNome = faker.commerce.productName();

    cy.API_cadastrarProduto(token, dadosProduto).then((response) => {
      idProduto = response.body._id;

      cy.visit("/admin/listarprodutos");

      cy.get(".jumbotron")
        .should("be.visible")
        .and("contain", dadosProduto.nome);

      cy.API_editarProduto(token, idProduto, {
        ...dadosProduto,
        nome: novoNome,
      }).then((res) => {
        expect(res.status).to.eq(200);
        cy.visit("/admin/listarprodutos");
        cy.contains("td", novoNome, { timeout: 2000 }).should("be.visible");
      });
    });
  });
});
