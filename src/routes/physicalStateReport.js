const express = require('express');
const router = express.Router();
const physicalStateReportService = require('../services/physicalStateReportService');

router.post('/', async (req, res) => {
  try {
    const report = await physicalStateReportService.createPhysicalStateReport(req.body);
    res.status(201).json({ ok: true, data: report });
  } catch (error) {
    res.status(400).json({ ok: false, message: error.message });
  }
});

module.exports = router;
