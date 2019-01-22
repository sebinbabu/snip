const express = require('express');
const { snipController } = require('../../controllers');

const router = express.Router();

router.get('/:snipname', snipController.getSnip);
router.post('/:snipname', snipController.setSnip);

module.exports = router;
