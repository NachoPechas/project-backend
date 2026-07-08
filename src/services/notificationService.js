const Notification = require('../models/notification');

async function createNotification(data, injectedModels = {}) {
  const { Notification: NotificationModel = Notification } = injectedModels;

  return NotificationModel.create({
    userId: data.userId,
    type: data.type,
    message: data.message,
    status: 'pendiente',
  });
}

module.exports = {
  createNotification,
};
