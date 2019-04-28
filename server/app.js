require('dotenv').config();
const path = require('path')
const express = require('express');
const ecgData = require('./routes/ecgData');

const app = express();

app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..', 'dist')));

app.use('/wxapp2/ecgdata/liveecg', ecgData);

app.get('/*', (req, res, next) => {
  res.sendFile(path.join(__dirname, '..', 'src/index.html' ))
});

//handle 404s
app.use((req, res, next) => {
  const err = new Error('Not Found!');
  err.status = 404;
  next(err)
})

//Error handling endware
app.use((err, req, res, next) =>{
  res.status(err.status || 500);
  res.send(err.message || 'Internet server error!')
})

module.exports = app;
