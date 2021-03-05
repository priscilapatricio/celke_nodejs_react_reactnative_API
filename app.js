const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

require('./models/home');
const Home = mongoose.model('Home');

require('./models/orcamento');
const Orcamento = mongoose.model('Orcamento');

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.header("Access-Control-Allow-Headers", "X-PINGOTHER, Content-Type, Authorization");
  app.use(cors());
  next();
})

mongoose.connect(
  'mongodb://localhost:27017/celke', 
  {useNewUrlParser: true, useUnifiedTopology: true}
  ).then(() =>{
  console.log("Conexão com BD MongoDB realizada com sucesso!");
})

.catch((err) => {
  console.log("Erro: Conexão com BD MongoDB não realizada com sucesso!");
});

app.get('/home', async (req, res) => {
    await Home.findOne({}).then((home)=>{
      return res.json({
        error:false,
        home:home
      });
    }).catch((err) => {
      return res.status(400).json({
        error: true,
        message: "Nenhum registro encontrado!"
      });
    });
  });

  app.post('/home', async (req, res) => {
    const dados ={
      "topTitulo": "Temos a solução que a sua empresa precisa!",
      "topSubtitulo": "This is a simple hero unit, a simple Jumbotron-style component for calling extra attention to featured content or information.",
      "topTextoBtn": "Orçamento",
      "topLinkBtn": "http://localhost:3000/orcamento",
      "serTitulo": "Serviços",
      "serSubtitulo": "Sed augue massa, posuere ac facilisis ac, sodales nec ante.",
      "serUmIcone": "laptop-code",
      "serUmTitulo": "Serviço um",
      "serUmDesc": "Duis sodales velit sit amet metus rutrum euismod. Morbi viverra tortor quis nisi faucibus, id rutrum risus blandit.",
      "serDoisIcone":"mobile-alt",
      "serDoisTitulo": "Serviço dois",
      "serDoisDesc": "Cras lobortis dignissim nisi eget euismod. Integer tempus dolor et orci vulputate, imperdiet facilisis dolor eleifend.",
      "serTresIcone":"network-wired",
      "serTresTitulo": "Serviço três",
      "serTresDesc": "Nunc rhoncus porttitor enim eget luctus. Suspendisse a justo ut magna feugiat accumsan sit amet eu augue."
    }

    const homeExiste = await Home.findOne({});
    if(homeExiste){
      return res.status(400).json({
        error: true,
        message: "Erro: A página home já possui um registro!"
      });
    }

    await Home.create(dados, (err) => {
      if(err) return res.status(400).json({
        error:true,
        message: "Erro: Conteúdo da página não cadastrado com sucesso!"
      });    
    });

    return res.json({
      error:false,
      message: "Conteúdo da página cadastrado com sucesso!"
    });
  });

  app.post('/orcamento', async (req, res) => {
   
    await Orcamento.create(req.body, (err) => {
      if(err) return res.status(400).json({
        error:true,
        message: "Erro: Solicitação de orçamento enviado com sucesso!"
      });    
    });

    return res.json({
      error:false,
      message: "Solicitação de orçamento enviada com sucesso!"
    });
  });

app.listen(8080, function(){
    console.log("Servidor iniciado na porta 8080: http://localhost:8080");
});
