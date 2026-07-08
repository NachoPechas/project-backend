const express = require('express');
const router = express.Router();
const loanController = require('../controllers/loanController');
const { verifyToken, authorize } = require('../middleware/authMiddleware');
const { audit } = require('../services/auditService');

router.get('/historial/mio', verifyToken, loanController.getMyHistory);

router.post('/prestar', verifyToken, authorize(1, 2), audit('CREATE_LOAN', 'Loan'), loanController.rentBook);

module.exports = router;
