import {faker} from '@faker-js/faker'

describe('[SER-8] Login - API', () => {

    let dadosUsuario;
    let idUsuario;

    beforeEach(() => {
        dadosUsuario = {
            nome: faker.person.fullName(), 
            email: faker.internet.email(),
            password: faker.internet.password(),
            administrador: "true"
        }

        cy.cadastrarUsuario(dadosUsuario).then(response => {
            idUsuario = response.body._id
        })
    })

    afterEach(() => {
        if(idUsuario){
            cy.excluirUsuario(idUsuario)
        }
    })
    it('[SER-9] Deve realizar login com sucesso', () => {
        cy.login(dadosUsuario)
        .then(response => {
            expect(response.status).to.eq(200)
            expect(response.body).to.have.property('message')
            expect(response.body.message).to.include('sucesso')

            expect(response.body).to.have.property('authorization')
        })
    })
})