const express = require('express');
const router = express.Router();
const loanService = require('../services/loanService');

router.post('/', async (req, res) => {
  try {
    const loan = await loanService.createLoan(req.body);
    res.status(201).json({ ok: true, data: loan });
  } catch (error) {
    res.status(400).json({ ok: false, message: error.message });
  }
});

module.exports = router;
