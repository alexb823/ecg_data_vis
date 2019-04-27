const express = require('express');
const router = express.Router();

const proxy = require('http-proxy-middleware');

const options = {
  target: 'https://paf3.ecordum.cn',
  auth: 'ecordumtest:8ENzA1MA37',
  secure: false,
  // changeOrigin: true,
  // pathRewrite: { '^/wxapp2/ecgdata': '' }
};

const ecgDataProxy = proxy(options);

router.use('/', ecgDataProxy);

router.get('/', (req, res, next) => {
  next()
});

module.exports = router;
