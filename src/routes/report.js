const express = require('express');
const router = express.Router();
const reportService = require('../services/reportService');
const { verifyToken, authorize } = require('../middleware/authMiddleware');
const { audit } = require('../services/auditService');

router.get('/prestamos', verifyToken, authorize(1, 2), audit('VIEW_LOAN_REPORT', 'Report'), async (req, res) => {
  try {
    const report = await reportService.getLoanReport(req.query);
    return res.json({ success: true, data: report });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/retrasos', verifyToken, authorize(1, 2), audit('VIEW_DELAY_REPORT', 'Report'), async (req, res) => {
  try {
    const report = await reportService.getDelayReport(req.query);
    return res.json({ success: true, data: report });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/inventario', verifyToken, authorize(1, 2), audit('VIEW_INVENTORY_REPORT', 'Report'), async (req, res) => {
  try {
    const report = await reportService.getInventoryReport();
    return res.json({ success: true, data: report });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/dashboard', verifyToken, authorize(1, 2), audit('VIEW_DASHBOARD_REPORT', 'Report'), async (req, res) => {
  try {
    const report = await reportService.getDashboardReport();
    return res.json({ success: true, data: report });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
