const express = require('express');
const mongoose = require('mongoose');

const userRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

const app = express();
const { PORT = 3000 } = process.env;
app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '62711ea1a9b96071d9da3a18',
  };

  next();
});

async function main() {
  await mongoose.connect('mongodb://localhost:27017/mestodb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  console.log('Connect to mydb');

  app.listen(PORT, () => {
    console.log(`server listening on port ${PORT}`);
  });
}

app.get('/', (req, res) => {
  res.send(req.body);
});

app.use('/users', userRouter);
app.use('/cards', cardsRouter);

app.use((req, res) => {
  res.status(404).send({ message: 'Страница не найдена' });
});

main();
