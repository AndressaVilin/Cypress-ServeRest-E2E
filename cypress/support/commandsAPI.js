Cypress.Commands.add("API_cadastrarUsuario", (usuario) => {
  return cy.request({
    method: "POST",
    url: `${Cypress.env("urlApi")}/usuarios`,
    body: usuario,
    failOnStatusCode: false,
  });
});

Cypress.Commands.add("API_login", (usuario) => {
  return cy
    .request({
      method: "POST",
      url: `${Cypress.env("urlApi")}/login`,
      body: {
        email: usuario.email,
        password: usuario.password,
      },
      failOnStatusCode: false,
    })
    .then((response) => {
      expect(response.status).to.be.oneOf([200, 401]);

      if (response.status === 200) {
        const token = response.body.authorization;
        window.localStorage.setItem("serverest/userToken", token);
      }
    });
});

Cypress.Commands.add("API_excluirUsuario", (id) => {
  return cy.request({
    method: "DELETE",
    url: `${Cypress.env("urlApi")}/usuarios/${id}`,
    failOnStatusCode: false,
  });
});

Cypress.Commands.add('API_listarUsuarios', () => {
  return cy.request({
    method: 'GET',
    url: `${Cypress.env("urlApi")}/usuarios`,
    retryOnNetworkFailure: true,
  })
})

Cypress.Commands.add('API_procurarUsuario', id => {
  return cy.request({
    method: 'GET',
    url: `${Cypress.env("urlApi")}/usuarios/${id}`,
    retryOnNetworkFailure: true,
    failOnStatusCode: false
  })
})

Cypress.Commands.add('API_editarUsuario', (usuario, id) => {
  return cy.request({
    method: 'PUT',
    url: `${Cypress.env('urlApi')}/usuarios/${id}`,
    body: usuario,
    failOnStatusCode: false
  })
})

Cypress.Commands.add('API_cadastrarProduto', (token, produto) => {
  return cy.request({
    method: 'POST',
    url: `${Cypress.env('urlApi')}/produtos`,
    body: produto,
    headers: {
      Authorization: token
    },
    failOnStatusCode: false
  })
})

Cypress.Commands.add('API_listarProdutos', () => {
  return cy.request({
    method: 'GET',
    url: `${Cypress.env("urlApi")}/produtos`,
    retryOnNetworkFailure: true,
  })
})

Cypress.Commands.add('API_procurarProduto', id => {
  return cy.request({
    method: 'GET',
    url: `${Cypress.env("urlApi")}/produtos/${id}`,
    retryOnNetworkFailure: true,
    failOnStatusCode: false
  })
})

Cypress.Commands.add('API_excluirProduto', (token, id) => {
  return cy.request({
    method: 'DELETE',
    url: `${Cypress.env('urlApi')}/produtos/${id}`,
    headers: {
      Authorization: token
    },
    failOnStatusCode: false
  })
})

Cypress.Commands.add('API_editarProduto', (token, id,produto) => {
  return cy.request({
    method: 'PUT',
    url: `${Cypress.env('urlApi')}/produtos/${id}`,
    body: produto,
    headers: {
      Authorization: token
    },
    failOnStatusCode: false
  })
})

Cypress.Commands.add('API_listarCarrinhos', () => {
  return cy.request({
    method: 'GET',
    url: `${Cypress.env('urlApi')}/carrinhos`,
    retryOnNetworkFailure: true,
  })
})

Cypress.Commands.add('API_procurarCarrinho', id => {
  return cy.request({
    method: 'GET',
    url: `${Cypress.env('urlApi')}/carrinhos/${id}`,
    retryOnNetworkFailure: true,
    failOnStatusCode: false,
  })
})

Cypress.Commands.add('API_cadastrarCarrinho', (token, carrinho) => {
  return cy.request({
    method: 'POST',
    url: `${Cypress.env('urlApi')}/carrinhos`,
    body: carrinho,
    failOnStatusCode: false,
    headers: {
      Authorization: token
    }
  })
})

Cypress.Commands.add('API_concluirCompra', token => {
  return cy.request({
    method: 'DELETE',
    url: `${Cypress.env('urlApi')}/carrinhos/concluir-compra`,
    failOnStatusCode: false,
    headers: {
      Authorization: token
    }
  })
})

Cypress.Commands.add('API_cancelarCarrinho', token => {
  return cy.request({
    method: 'DELETE',
    url: `${Cypress.env('urlApi')}/carrinhos/cancelar-compra`,
    failOnStatusCode: false,
    headers: {
      Authorization: token
    }
  })
})

