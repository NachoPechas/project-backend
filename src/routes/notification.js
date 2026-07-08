const express = require('express');
const router = express.Router();
const notificationService = require('../services/notificationService');
const { verifyToken, authorize } = require('../middleware/authMiddleware');
const auditService = require('../services/auditService');

router.get('/mis', verifyToken, async (req, res) => {
  try {
    const notifications = await notificationService.listNotificationsForUser(req.user.id);
    return res.json({ success: true, data: notifications });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.get('/', verifyToken, authorize(1, 2), async (req, res) => {
  try {
    const notifications = await notificationService.listAllNotifications();
    return res.json({ success: true, data: notifications });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.post('/vencimientos', verifyToken, authorize(1, 2), async (req, res) => {
  try {
    const result = await notificationService.createDueDateNotifications(req.body.date);
    auditService.logAction({
      userId: req.user.id,
      action: 'GENERATE_DUE_DATE_NOTIFICATIONS',
      entity: 'Notification',
      details: result,
      ipAddress: req.ip,
    }).catch(() => {});
    return res.status(201).json({ success: true, data: result });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.post('/retrasos', verifyToken, authorize(1, 2), async (req, res) => {
  try {
    const result = await notificationService.createOverdueNotifications(req.body.date);
    auditService.logAction({
      userId: req.user.id,
      action: 'GENERATE_OVERDUE_NOTIFICATIONS',
      entity: 'Notification',
      details: result,
      ipAddress: req.ip,
    }).catch(() => {});
    return res.status(201).json({ success: true, data: result });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
