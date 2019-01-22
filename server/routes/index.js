const express = require('express');
const apiRouter = require('./api');
const webRouter = require('./web');

const router = express.Router();

router.use('/api', apiRouter);
router.use('/', webRouter);

module.exports = router;
