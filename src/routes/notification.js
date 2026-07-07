const express = require('express');
const router = express.Router();
const notificationService = require('../services/notificationService');
const { verifyToken, authorize } = require('../middleware/authMiddleware');

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
    return res.status(201).json({ success: true, data: result });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
