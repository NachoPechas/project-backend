const express = require('express');
const router = express.Router();
const auditLogService = require('../services/auditLogService');

router.post('/', async (req, res) => {
  try {
    const log = await auditLogService.createAuditLog(req.body);
    res.status(201).json({ ok: true, data: log });
  } catch (error) {
    res.status(400).json({ ok: false, message: error.message });
  }
});

module.exports = router;
