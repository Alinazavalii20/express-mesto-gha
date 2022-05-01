const express = require('express');
const mongoose = require('mongoose');

const userRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

const app = express();
const { PORT = 3001 } = process.env;
app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '62198f7d3c1ef718b915a9db',
  };

  next();
});

async function main() {
  await mongoose.connect('mongodb://localhost:27017/mydb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  console.log('Connect to mydb');

  app.listen(PORT, () => {
    console.log(`server listening on port ${PORT}`);
  });
}

app.get('/', (req, res) => {
  res.send(req.body)
})

app.use('/users', userRouter);
app.use('/cards', cardsRouter);

app.use((req, res) => {
  res.status(404).send({ message: 'Страница не найдена' });
});

main();

//const express = require('express');

//const mongoose = require('mongoose');

//const routes = require('./routes/index');

//const app = express();
//const { PORT = 3000 } = process.env;

//app.use(express.json())

//app.use(routes);
//mongoose.connect('mongodb://localhost:27017/mestodb');

//app.post('/', (req, res) => {
  //res.send(req.body)
//})

//app.listen(PORT, () => {
 //console.log(`server listening on port ${PORT}`)
//})


//app.use((req, res, next) => {
//  req.user = {
//    _id: ''
//  };
 // next();
//});


//app.listen(PORT, () => {
 //console.log(`server listening on port ${PORT}`)
//})

//app.post('/', (req, res) => {
//  res.send(req.body)
//})
//app.use((req, res,next) => {
 // console.log(req.method, req.path);
 // next();
//})
//app.get('/', (req, res) => {
 // res.send('Hello word')
//})

////const mongoose = require('mongoose');

//mongoose.connect('mongodb://localhost:27017/mestodb ', {
 // useNewUrlParser: true,
 // useUnifiedTopology: true,
//});
