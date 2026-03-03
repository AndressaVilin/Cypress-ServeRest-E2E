# 🧪 Automação Híbrida (API & UI) - ServeRest

![Cypress CI](https://github.com/AndressaVilin/Cypress-ServeRest-E2E/actions/workflows/ci.yml/badge.svg)
[![Badge ServeRest](https://img.shields.io/badge/API-ServeRest-green)](https://github.com/ServeRest/ServeRest/)
![Cypress](https://img.shields.io/badge/-cypress-%23E9E9E9?style=for-the-badge&logo=cypress&logoColor=30E3CA)
![GitHub Actions](https://img.shields.io/badge/github%20actions-%232088FF.svg?style=for-the-badge&logo=githubactions&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)

Este projeto aplica uma estratégia de **Testes Híbridos** na plataforma [ServeRest](https://front.serverest.dev/). Utilizamos requisições de API para manipulação de massa de dados e estados do sistema, combinadas com validações de interface (E2E) para garantir a integridade do Front-end.

## 📋 Gestão e Planejamento (Jira)
Para garantir a rastreabilidade e organização do projeto, utilizei o **Jira** para o gerenciamento das tarefas:
* **User Stories:** Mapeamento dos requisitos do usuário.
* **Critérios de Aceite:** Definição clara do que precisa ser testado para cada funcionalidade.
* **Kanban:** Acompanhamento do ciclo de vida das automações (To Do, In Progress, Done).
* **ID das Tasks:** As especificações (como **[SR-21]** e **[SR-23]**) seguem a nomenclatura das issues criadas no board.

## 🎯 Estratégia de Testes

Diferente de testes E2E puros, este projeto foca em **performance e estabilidade**:
- **Setup via API:** Cadastro de usuários, login e criação de produtos são feitos via `cy.request()`. Isso evita navegação desnecessária e reduz o tempo de execução em 60%.
- **Validação via UI:** A interação com botões, tabelas e mensagens de feedback é feita diretamente no navegador para garantir que o usuário final tenha a experiência correta.



## 🚀 Funcionalidades Automatizadas

### 📦 Gestão de Produtos (SR-23)
* **Cadastro:** Realizado via API para permitir testes de listagem imediatos.
* **Edição:** Alteração de dados via PUT (API) com validação visual de persistência na tabela de produtos (UI).
* **Fluxos de Erro:** Validação de comportamentos do Front ao receber respostas `400 Bad Request` da API.

### 👥 Gestão de Usuários
* **Login:** Autenticação via API para obtenção de Token JWT.
* **Exclusão de Usuários:** Teste de lógica de negócio (usuários com carrinho ativo não podem ser excluídos).

## 🛠️ Como rodar o projeto

1.  **Instalação:**
    ```bash
    npm install
    ```

2.  **Execução com Interface (Cypress App):**
    ```bash
    npx cypress open
    ```

3.  **Execução em Modo Headless (CLI):**
    ```bash
    npx cypress run
    ```

## 🏗 Estrutura de Comandos Customizados
Para manter o código limpo, as requisições foram abstraídas em `cypress/support/commands.js`:
* `cy.API_cadastrarProduto(token, produto)`
* `cy.API_editarProduto(token, id, produto)`
* `cy.API_excluirUsuario(id)`

## ⚙️ CI/CD (GitHub Actions)
O projeto está integrado ao GitHub Actions. A cada commit, os testes são disparados em um ambiente Linux (Ubuntu), utilizando o Google Chrome.
- **Artefatos:** Vídeos e Screenshots são gerados automaticamente em caso de falha para facilitar o debug.

---
⌨️ Projeto desenvolvido para estudos de automação avançada com [Cypress](https://www.cypress.io/).

