const express = require('express');
const router = express.Router();

const proxy = require('http-proxy-middleware');

const options = {
  target: 'https://paf3.ecordum.cn',
  auth: process.env.ECGDATA_AUTH,
  secure: false,
};

const ecgDataProxy = proxy(options);

router.use('/', ecgDataProxy);

module.exports = router;
