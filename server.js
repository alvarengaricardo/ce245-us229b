/*
*
*Arquivo: server.js
*Descrição:
*Autor:
*Data: 01/05/2018
*
*/

// configurar setup App:

// Chamadas dos pacotes
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Produto = require('./app/models/produto');

//URI: mlab
mongoose.connect('mongodb://usuario:camboja@ds014118.mlab.com:14118/node-crud-api');

// Configuração da variável app para usar o 'bodyParser()':
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Definindo a porta onde será executada a api:
var port = process.env.port || 8000;

// Rotas da API
// ==========================

// Criando uma instãncia das Rotas via Express:
var router = express.Router();

router.use(function(req, res, next){
    console.log('Acesso rota.');
    next();
});

// Rota de exemplo:
router.get('/', function(req, res){
    res.json({message: 'Funcionando ok.'})
});

//API's:
//==============================================================================

//Rotas que terminarem com '/produtos' (servir: GET ALL & POST)
router.route('/produtos')

    /* 1) Método: Criar Produto (acessar em: POST http://localhost:8000/api/produtos)  */
    .post(function(req, res) {
        var produto = new Produto();

        //Aqui vamos setar os campos do produto (via request):
        produto.nome = req.body.nome;
        produto.preco = req.body.preco;
        produto.descricao = req.body.descricao;

        produto.save(function(error) {
            if(error)
                res.send('Erro ao tentar salvar o Produto....: ' + error);
            
            res.json({ message: 'Produto Cadastrado com Sucesso!' });
        });
    })

    /* 2) Método: Selecionar Todos Produtos (acessar em: GET http://localhost:8000/api/produtos)  */
    .get(function(req, res) {
        Produto.find(function(error, produtos) {
            if(error) 
                res.send('Erro ao tentar Selecionar Todos os produtos...: ' + error);

            res.json(produtos);
        });
    });

    //Rotas que irão terminar em '/produtos/:produto_id' (servir tanto para: GET, PUT & DELETE: id):
    router.route('/produtos/:produto_id')

    /* 3) Método: Selecionar por Id: (acessar em: GET http://localhost:8000/api/produtos/:produto_id) */
    .get(function (req, res) {
        
        //Função para poder Selecionar um determinado produto por ID - irá verificar se caso não encontrar um detemrinado
        //produto pelo id... retorna uma mensagem de error:
        Produto.findById(req.params.produto_id, function(error, produto) {
            if(error)
                res.send('Id do Produto não encontrado....: ' + error);

            res.json(produto);
        });
    })

    /* 4) Método: Atualizar por Id: (acessar em: PUT http://localhost:8000/api/produtos/:produto_id) */
    .put(function(req, res) {

        //Primeiro: para atualizarmos, precisamos primeiro achar 'Id' do 'Produto':
        Produto.findById(req.params.produto_id, function(error, produto) {
            if (error) 
                res.send("Id do Produto não encontrado....: " + error);

                //Segundo: 
                produto.nome = req.body.nome;
                produto.preco = req.body.preco;
                produto.descricao = req.body.descricao;

                //Terceiro: Agora que já atualizamos os dados, vamos salvar as propriedades:
                produto.save(function(error) {
                    if(error)
                        res.send('Erro ao atualizar o produto....: ' + error);

                    res.json({ message: 'Produto atualizado com sucesso!' });
                });
            });
        })

        /* 5) Método: Excluir por Id (acessar: http://localhost:8000/api/produtos/:produto_id) */
        .delete(function(req, res) {
            
            Produto.remove({
                _id: req.params.produto_id
                }, function(error) {
                    if (error) 
                        res.send("Id do Produto não encontrado....: " + error);

                    res.json({ message: 'Produto Excluído com Sucesso!' });
                });
            });

//Definindo um padrão das rotas prefixadas: '/api':
app.use('/api', router);

//Iniciando a Aplicação (servidor):
app.listen(port);
console.log("Iniciando a app na porta " + port);