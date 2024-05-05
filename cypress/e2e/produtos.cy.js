/// <reference types="cypress" />
import contrato from '../contracts/produtos.contracts'

//SJM - 15/08/23 - Criação do script para teste com metodos GET POST PUT DELETE
describe('Testes da funcionalidade produtos', () => {

    let token
    let produto = `Produto Ebac ${Math.floor(Math.random() * 1000000)}`

    before(() => {
        //faz login antes da execução do teste usando comando personalizado, 
        //e depois armazena o retorno do login que é o token em uma variavel para ser usado dentro do teste de cadastro de produto
        cy.token('fulano@qa.com', 'teste').then(tkn => { 
            token = tkn
        })
    });

    //SJM - 17/08/23 - Utilizando JOI para teste de contrato
    it('Deve validar contrato de produtos', () => {
        cy.request('produtos').then(response => {
             return contrato.validateAsync(response.body)
        })
    });

    it('GET - Deve listar todos os produtos cadastrados', () => {
        cy.request({
            method: 'GET',
            url: '/produtos',
        }).then((response) => {
            //expect(response.body.produtos[0].nome).to.equal('Logitech MX Vertical'),
            expect(response.status).to.equal(200),
            expect(response.body.produtos[0].nome).not.equal(''),
            expect(response.body).to.have.property('produtos'),
            expect(response.duration).to.be.lessThan(100)
        })
    });

    it('POST - Cadastrar produto', () => {
        cy.request({
            method: 'POST',
            url: '/produtos',
            body: { 
                "nome": produto,
                "preco": 200,
                "descricao": "Produto Novo",
                "quantidade": 100
            },
            headers: {authorization : token}
        }).then((response) => {
            expect(response.status).to.be.equal(201),
            expect(response.body.message).to.equal('Cadastro realizado com sucesso')
        })
    });

    it('PUT - Deve validar mensagem de erro ao cadastrar produto repetido', () => {
        //usou comando personalizado para tentar cadastrar um produto novo e fez as validações de que o mesmo ja havia sido cadastrado anteriormente
        cy.cadastrarProduto(token, produto, 100, produto, 10)
        .then((response) => {
            expect(response.status).to.be.equal(400)
            expect(response.body.message).to.equal('Já existe produto com esse nome')
        });
    });

    it('PUT - Deve editar um produto ja cadastrado', () => {
        let produto = `Produto Ebac ${Math.floor(Math.random() * 1000000)}`
        //faz o get direto no request(''), depois atribui o valor do id do produto 0 do array para variavel para ser usado posteriormente
        cy.request('/produtos').then(response => {
            cy.log(response.body.produtos[0]._id)
            let id = response.body.produtos[0]._id
            cy.request({
                method: 'PUT',
                url: `/produtos/${id}`,
                headers: {authorization : token},
                body: { 
                    "nome": produto,
                    "preco": 220,
                    "descricao": produto,
                    "quantidade": 10
                },
            }).then((response) =>{
                expect(response.status).to.be.equal(200),
                expect(response.body.message).to.equal('Registro alterado com sucesso')
            })
        })
    });

    it('PUT - Alterar produto cadastrado previamente com comando personalizado', () => {
        let produtoNovo = `Produto Ebac ${Math.floor(Math.random() * 1000000)}`
        let produto = `Produto Ebac ${Math.floor(Math.random() * 1000000)}`
        //Cadastrando produto
        cy.cadastrarProduto(token, produtoNovo, 100, produtoNovo, 10).then(response => { 
            let id = response.body._id
            cy.log(response.body._id)

            cy.request({
                method: 'PUT',
                url: `/produtos/${id}`,
                headers: {authorization : token},
                body: { 
                    "nome": produto,
                    "preco": 220,
                    "descricao": produto,
                    "quantidade": 10
                },
            }).then((response) =>{
                expect(response.status).to.be.equal(200),
                expect(response.body.message).to.equal('Registro alterado com sucesso')
            })
        })
    });

    it('DELETE - Deve excluir um produto cadastrado e editado anteriormente com comando personalizado', () => {
        let produtoNovo = `Produto Ebac ${Math.floor(Math.random() * 1000000)}`
        cy.cadastrarProduto(token, produtoNovo, 100, produtoNovo, 10).then(response => { 
            let id = response.body._id
            cy.log(response.body._id)
        
            cy.deletarProduto(token, id)
            .then((response) =>{
                expect(response.status).to.be.equal(200),
                expect(response.body.message).to.equal('Registro excluído com sucesso')
            })
        })
    });

});