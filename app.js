const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const bodyParser = require('body-parser'); // без этого пост не работает
const helmet = require('helmet');
const handleError = require('./middlewares/handleError');
const routers = require('./routes');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

const app = express();

app.use(helmet());
app.use(bodyParser.json()); // подключение body-parser к app
app.use(bodyParser.urlencoded({ extended: true }));

app.use(routers);

app.use(errors());
app.use(handleError);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
