const express = require('express');
const router = express.Router();
const { buscarPuestosEstudio } = require('../controllers/studySeat');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/', verifyToken, buscarPuestosEstudio);

module.exports = router;
