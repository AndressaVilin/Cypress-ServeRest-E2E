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
    retryOnNetworkFailure: true
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