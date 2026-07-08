const express = require('express');
const router = express.Router();
const returnService = require('../services/returnService');

router.post('/:loanId', async (req, res) => {
  try {
    const loan = await returnService.returnLoan(req.params.loanId, req.body);
    res.json({ ok: true, data: loan });
  } catch (error) {
    res.status(400).json({ ok: false, message: error.message });
  }
});

module.exports = router;
