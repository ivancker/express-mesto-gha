const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser'); // без этого пост не работает
const routers = require('./routes');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

const app = express();

app.use(bodyParser.json()); // подключение body-parser к app

app.use((req, res, next) => {
  req.user = {
    _id: '648f66c2fda1ea6e76d87aca',
  };

  next();
});

app.use(routers);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
