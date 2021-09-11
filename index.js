const express = require('express');
const app = express();
const porta = 3000;
const bodyParser = require('body-parser');
const connection = require('./database/database');
const pergunta = require('./database/pergunta')

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
  pergunta.findAll({ raw: true }).then(perguntas => {
    res.render("index", {
      perguntas: perguntas
    });
  })
});

app.get('/perguntar', (req, res) => {
  res.render("perguntar");
});

app.post('/salvarpergunta', (req, res) => {

  let titulo = req.body.titulo;
  let descricao = req.body.descricao;

  pergunta.create({
    titulo: titulo,
    descricao: descricao,
  }).then(() => {
    res.redirect('/');
  });
});

app.listen(porta, (err) => {
  if(err) {
    console.log("Ocorreu um erro no servidor")
  } else {
    console.log(`servidor rodando na porta ${porta}`)
  }
});
