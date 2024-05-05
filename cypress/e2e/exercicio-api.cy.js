/// <reference types="cypress" />
import contrato from '../contracts/usuario.contracts'

    let token
    let random = Math.floor(Math.random() * 1000000)
    let usuario = `Usuario Novo ${random}`
    let email = `UsuarioNovo${random}`
    let id = ''

    before(() => {
        //faz login antes da execução do teste usando comando personalizado, 
        //e depois armazena o retorno do login que é o token em uma variavel para ser usado dentro do teste de cadastro de produto
        cy.token('fulano@qa.com', 'teste').then(tkn => { 
            token = tkn
        })
    });

describe('Testes da Funcionalidade Usuários', () => {

    //SJM - 22/08/23 - Utilizando JOI para teste de contrato
    it('Deve validar contrato de usuários', () => {
        //faz um get em usuarios, atribui para response e valida se response.body é igual ao JOI de usuario
         cy.request('usuarios').then(response => {
            return contrato.validateAsync(response.body)
         })
    });

    it('GET - Deve listar usuários cadastrados', () => {
        //sempre utilizado para fazer as requisições 
        cy.request({
            method: 'GET', //metodo html
            url: '/usuarios', //url base + endpoint
         }).then((response) => { //response = retorno da request
            expect(response.status).to.equal(200) //espera que o status code do request seja 200
            expect(response.body.usuarios[0].nome).not.equal('')
        })
    });

    it('POST - Deve cadastrar um usuário com sucesso', () => {
         cy.request({
            method: 'POST',
            url: '/usuarios',
            headers: {authorization : token},
            body : {
                "administrador": "true",
                "nome": usuario ,
                "email": email + "@qa.com.br" ,
                "password": "teste"
            }
         }).then((response) => {
            expect(response.status).to.be.equal(201),
            expect(response.body.message).to.equal('Cadastro realizado com sucesso')
            id = response.body._id
            cy.log(response.body._id)
        })
    });

    it('POST - Deve validar um usuário com email inválido', () => {
        cy.request({
            method: 'POST',
            url: '/usuarios',
            headers: {authorization : token},
            body : {
                "administrador": "true",
                "nome": usuario ,
                "email": usuario + "@qa.com.br",
                "password": "teste"
            },
            failOnStatusCode: false
         }).then((response) => {
            expect(response.status).to.be.equal(400),
            expect(response.body.email).to.equal('email deve ser um email válido')
            
        }) 
    });

    it('PUT - Deve editar um usuário previamente cadastrado', () => {
        let randomNew = Math.floor(Math.random() * 1000000)
        let usuarioNew = `Usuario Novo ${random}`
        let emailNew = `UsuarioNovo${random}`
        cy.log(id)

        cy.request({
            method: 'PUT',
            url: `/usuarios/${id}`, //utiliza o id do usuario cadastrado anteriormente cujo qual id foi atribuido a variavel
            headers: {authorization : token},
            body : {
                "administrador": "true",
                "nome": usuarioNew ,
                "email": emailNew + "@qa.com.br" ,
                "password": "teste"
            },
        }).then((response) =>{
            expect(response.status).to.be.equal(200),
            expect(response.body.message).to.equal('Registro alterado com sucesso')
        })
    });

    it('DELETE - Deve deletar um usuário previamente cadastrado', () => {
        cy.log(id) //log do id do usuario criado , depois alterado, e por fim deletado
        cy.request({
            method: 'DELETE',
            url: `/usuarios/${id}`,
            headers: {authorization : token},
        })
    });


});