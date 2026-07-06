const express = require('express');
const router = express.Router();
const bookController = require('../controllers/book');

router.get('/', (req, res) => bookController.getBooks(req, res));

module.exports = router;