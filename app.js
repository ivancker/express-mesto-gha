const express = require('express');

const app = express();

const users = [];
const _id = 0;

app.get('/', (req, res) => {
  res.send('Get request');
});

app.post('/', (req, res) => {
  res.send('Post request');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
