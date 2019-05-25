const router = require('express').Router();
const {convertXml2json} = require('../utils');
module.exports = router;


// POST :/api/xmlToJson
router.post('/xmlToJson', (req, res, next) => {
  const {xml} = req.body;
  // console.log(xml)
  // console.log(convertXml2json(xml));
  res.status(201).send(convertXml2json(xml));
})
