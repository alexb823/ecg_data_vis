const express = require('express');
const ecgData = require('./routes/ecgData');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/wxapp2/ecgdata', ecgData);

app.get('/', (req, res, next) => {
  res.send('hi');
});


module.exports = app;
