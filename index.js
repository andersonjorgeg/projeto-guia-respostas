const express = require('express');
const app = express();
const porta = 3000;

app.set('view engine', 'ejs');

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render("index");
});

app.get('/perguntar', (req, res) => {
  res.render("perguntar");
});

app.listen(porta, (err) => {
  if(err) {
    console.log("Ocorreu um erro no servidor")
  } else {
    console.log(`servidor rodando na porta ${porta}`)
  }
});
