const express = require('express');
const router = express.Router();
const fineService = require('../services/fineService');

router.post('/:loanId', async (req, res) => {
  try {
    const loan = await fineService.applyFine(req.params.loanId, req.body);
    res.json({ ok: true, data: loan });
  } catch (error) {
    res.status(400).json({ ok: false, message: error.message });
  }
});

module.exports = router;
