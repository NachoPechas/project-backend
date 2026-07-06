const express = require('express');
const router = express.Router();
const itemController = require('../controllers/item');

router.get('/:id', (req, res) => itemController.getItemStatus(req, res));

module.exports = router;