const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { celebrate, Joi } = require('celebrate');

const auth = require('./middlewares/auth');
const userRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

const { login } = require('./controllers/users');
const { creatUser } = require('./controllers/users');

const app = express();
app.use(cookieParser());
const { PORT = 3000 } = process.env;
app.use(express.json());

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

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/^https?:\/\/(w{3}\.)?[a-zA-Z0-9-.]+\.[a-zA-Z]{2,}([a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]+)*#*$/),
    about: Joi.string().min(2).max(60),
  }),
}), creatUser);

app.get('/', (req, res) => {
  res.send(req.body);
});

app.use('/users', auth, userRouter);
app.use('/cards', auth, cardsRouter);

app.use((req, res) => {
  res.status(404).send({ message: 'Страница не найдена' });
});

main();

/* app.use((req, res, next) => {
  req.user = {
    _id: '62711ea1a9b96071d9da3a18',
  };

  next();
}); */
