const express = require('express');
const router = express.Router();
const notificationService = require('../services/notificationService');

router.post('/', async (req, res) => {
  try {
    const notification = await notificationService.createNotification(req.body);
    res.status(201).json({ ok: true, data: notification });
  } catch (error) {
    res.status(400).json({ ok: false, message: error.message });
  }
});

module.exports = router;
