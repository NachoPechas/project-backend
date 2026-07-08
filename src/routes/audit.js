const express = require('express');
const router = express.Router();
const auditService = require('../services/auditService');
const { verifyToken, authorize } = require('../middleware/authMiddleware');

router.get('/', verifyToken, authorize(1), async (req, res) => {
  try {
    const logs = await auditService.listAuditLogs(req.query);
    return res.json({
      success: true,
      count: logs.length,
      data: logs,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
