const router = require('express').Router();
module.exports = router;

// POST :/api/xmlToJson
router.post('/:userId', (req, res, next) => {
  User.findByPk(req.params.userId)
  .then(user => user.update(req.body))
  .then(user => res.status(201).send(user))
  .catch(next)
})
