const express = require('express');
const app = express();
const porta = 80;
const bodyParser = require('body-parser');
const connection = require('./database/database');
const Pergunta = require('./database/Pergunta');
const Resposta = require('./database/Resposta');

connection
  .authenticate()
  .then(() => {
    console.log('conexão feita com o banco de dados!')
  })
  .catch((msgErro) => console.log(msgErro))

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  Pergunta.findAll({ raw: true, order: [
    ['id', 'DESC']
  ] }).then(perguntas => {
    res.render('index', {
      perguntas: perguntas
    });
  })
});

app.get('/perguntar', (req, res) => {
  res.render('perguntar');
});

app.post('/salvarpergunta', (req, res) => {

  let titulo = req.body.titulo;
  let descricao = req.body.descricao;

  Pergunta.create({
    titulo: titulo,
    descricao: descricao,
  }).then(() => {
    res.redirect('/');
  });
});

app.get('/pergunta/:id', (req, res) => {

  let id = req.params.id;

  Pergunta.findOne({
    where: {id: id}
  }).then(pergunta => {
    if(pergunta != undefined){
      Resposta.findAll({
        order: [ 
          ['Id', 'DESC'] 
        ],
        where: {perguntaId: pergunta.id}
      }).then(respostas => {
        res.render('pergunta', {
          pergunta: pergunta,
          respostas: respostas
        });
      });

    } else {
      res.redirect('/');
    }
  });
});

app.post('/responder', (req, res) => {
   let corpo = req.body.corpo;
   let perguntaId = req.body.pergunta

   Resposta.create({
     corpo: corpo,
     perguntaId: perguntaId
   }).then(() => {
     res.redirect(`/pergunta/${perguntaId}`);
   });
});

app.listen(porta, (err) => {
  if(err) {
    console.log("Ocorreu um erro no servidor")
  } else {
    console.log(`servidor rodando na porta ${porta}`)
  }
});
