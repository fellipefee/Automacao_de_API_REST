// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })


Cypress.Commands.add('token', (email, senha) => { 
    cy.request({
        method: 'POST',
        url: '/login',
        body: { 
            "email": email,
            "password": senha
        }
        }).then((response) => {
        expect(response.status).to.equal(200)
        return response.body.authorization
        })
    })

    Cypress.Commands.add('cadastrarProduto', (token, produto, preco, descricao, quantidade) =>{
        cy.request({
            method: 'POST',
            url: '/produtos',
            body: { 
                "nome": produto,
                "preco": preco,
                "descricao": descricao,
                "quantidade": quantidade
            },
            headers: {authorization : token},
            failOnStatusCode: false
        })
    })

    Cypress.Commands.add('deletarProduto', (token, id) => {
        cy.request({
            method: 'DELETE',
            url: `/produtos/${id}`,
            headers: {authorization : token},
            
        })
    })

    //SJM - 22/08/23 - Criando commands para testes da api do exercicio
    Cypress.Commands.add('validaEndpointAPI', (endpoint, varJoi) => {
        cy.request('' + endpoint).then(response => {
            return varJoi.validateAsync(response.body)
         })
    })

    Cypress.Commands.add('getEndpoint', (endpoint) => {
        cy.request({
            method: 'GET', //metodo html
            url: '/'+ endpoint, //url base + endpoint
         })
    })

    Cypress.Commands.add('cadastraUsuario', (token, nome, email, password, admin) =>{
        cy.request({
            method: 'POST',
            url: '/usuarios',
            headers: {authorization : token},
            body : {
                "nome": nome ,
                "email": email + "@qa.com.br" ,
                "password": password,
                "administrador": admin
            },
            failOnStatusCode: false
         })
    })

    Cypress.Commands.add('editaUsuarioCadastrado', (token, id, nome, email, password, admin) =>{
        cy.request({
            method: 'PUT',
            url: `/usuarios/${id}`,
            headers: {authorization : token},
            body : {
                "nome": nome ,
                "email": email + "@qa.com.br" ,
                "password": password,
                "administrador": admin
            },
            failOnStatusCode: false
         })
    })

    Cypress.Commands.add('deletaRegistroEndpoint', (token, endpoint, id) => {
        cy.request({
            method: 'DELETE',
            url: '/' + endpoint + `/${id}`,
            headers: {authorization : token},
        })
    })