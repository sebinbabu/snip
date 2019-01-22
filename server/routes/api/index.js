const express = require('express');

const userRoute = require('./user');
const snipRoute = require('./snip');
const otherRoutes = require('./other');

const router = express.Router();

router.use('/user', userRoute);
router.use('/snip', snipRoute);
router.use('/', otherRoutes);

router.use('/', (req, res, next) => {
  const error = new Error('not found');
  error.status = 404;
  next(error);
});

module.exports = router;
