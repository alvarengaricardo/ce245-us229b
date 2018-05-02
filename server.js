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
var Leito = require('./app/models/models');

//URI: mlab
mongoose.connect('mongodb://usuario:senha@ds014648.mlab.com:14648/hospital');

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

//Rotas que terminarem com '/leitos' (servir: GET ALL & POST)
router.route('/leitos')

    /* 1) Método: Criar Leito (acessar em: POST http://localhost:8000/api/leitos)  */
    .post(function(req, res) {        
        var leito = new Leito(); 
        //setar os campos do leito (via request):
        leito.hospital = req.body.hospital;
        leito.status = req.body.status;
        leito.setor = req.body.setor;
        leito.andar = req.body.andar;
        leito.ala = req.body.ala;
        leito.tipo = req.body.tipo;


        leito.save(function(error) {
            if(error)
                res.send('Erro ao tentar salvar o leito....: ' + error);
            
            res.json({ message: 'Leito Cadastrado com Sucesso!' });
        });
    })

    /* 2) Método: Selecionar Todos leitos (acessar em: GET http://localhost:8000/api/leitos)  */
    .get(function(req, res) {
        Leito.find(function(error, leitos) {
            if(error) 
                res.send('Erro ao tentar Selecionar todos os leitos...: ' + error);
            res.json(leitos);
        });
    });

    //Rotas que irão terminar em '/leitos/:leito_id' (servir tanto para: GET, PUT & DELETE: id):
    router.route('/leitos/:leito_id')

    /* 3) Método: Selecionar por Id: (acessar em: GET http://localhost:8000/api/leitos/leito_id) */
    .get(function (req, res) {
        
        //Função para poder Selecionar um determinado leito por ID - irá verificar se caso não encontrar um deteminado
        //leito pelo id... retorna uma mensagem de error:
        Leito.findById(req.params.leito_id, function(error, leito) {
            if(error)
                res.send('Id do leito não encontrado....: ' + error);

            res.json(leito);
        });
    })

    /* 4) Método: Atualizar por Id: (acessar em: PUT http://localhost:8000/api/leitos/:leito_id) */
    .put(function(req, res) {

        //Primeiro: para atualizarmos, precisamos primeiro achar 'Id' do 'leito':
        Leito.findById(req.params.leito_id, function(error, leito) {
            if (error) 
                res.send("Id do leito não encontrado....: " + error);

                //Segundo: 
                leito.hospital = req.body.hospital;
                leito.status = req.body.status;
                leito.setor = req.body.setor;
                leito.andar = req.body.andar;
                leito.ala = req.body.ala;
                leito.tipo = req.body.tipo;

                leito.save(function(error) {
                    if(error)
                        res.send('Erro ao atualizar o leito....: ' + error);

                    res.json({ message: 'leito atualizado com sucesso!' });
                });
            });
        })

        /* 5) Método: Excluir por Id (acessar: http://localhost:8000/api/leitos/:leito_id) */
        .delete(function(req, res) {
            
            Leito.remove({
                _id: req.params.leito_id
                }, function(error) {
                    if (error) 
                        res.send("Id do leito não encontrado....: " + error);

                    res.json({ message: 'Leito excluído com sucesso!' });
                });
            });

//Definindo um padrão das rotas prefixadas: '/api':
app.use('/api', router);

//Iniciando a Aplicação (servidor):
app.listen(port);
console.log("Iniciando a app na porta " + port);