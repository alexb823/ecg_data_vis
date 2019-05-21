require('dotenv').config();
const path = require('path');
const express = require('express');
const ecgData = require('./routes/ecgData');

const app = express();

app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// Static middleware
app.use(express.static(path.join(__dirname, '..', 'dist')));
app.use(express.static(path.join(__dirname, '..', 'public')));

// Proxy server router
// Requests starting with /wxapp2/ecgdata/liveecg will proxy to https://paf3.ecordum.cn
app.use('/wxapp2/ecgdata/liveecg', ecgData);

// For all GET requests that are not to the proxy, will send index.html
app.get('/*', (req, res, next) => {
  res.sendFile(path.join(__dirname, '..', 'src/index.html' ))
});

// Handle 404s
app.use((req, res, next) => {
  const err = new Error('Not Found!');
  err.status = 404;
  next(err)
})

// Error handling endware
app.use((err, req, res, next) =>{
  res.status(err.status || 500);
  res.send(err.message || 'Internet server error!')
})

module.exports = app;
