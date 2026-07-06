const express = require('express');
const router = express.Router();
const { buscarPuestosEstudio } = require('../controllers/studySeat');

router.get('/', buscarPuestosEstudio);

module.exports = router;