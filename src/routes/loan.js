const express = require('express');
const router = express.Router();
const loanController = require('../controllers/loanController');
const { verifyToken, authorize } = require('../middleware/authMiddleware');
const { audit } = require('../services/auditService');

router.get('/historial/mio', verifyToken, loanController.getMyHistory);
router.get('/historial/:userId', verifyToken, authorize(1, 2), loanController.getUserHistory);

router.post('/prestar', verifyToken, authorize(1, 2, 3), audit('CREATE_LOAN', 'Loan'), loanController.rentBook);

module.exports = router;
