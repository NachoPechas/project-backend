const { Op } = require('sequelize');
const { Loan, Notification, Penalty } = require('../models');

const DAILY_FINE_AMOUNT = 1000;

function formatDate(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

async function createDueDateNotifications(targetDate = formatDate()) {
  const loans = await Loan.findAll({
    where: {
      dueDate: targetDate,
      returnDate: null,
    },
    order: [['id', 'ASC']],
  });

  const notifications = [];

  for (const loan of loans) {
    const message = `Recuerda devolver el prestamo ${loan.id} hoy (${targetDate}).`;

    const [notification, created] = await Notification.findOrCreate({
      where: {
        userId: loan.userId,
        type: 'Vencimiento',
        message,
      },
      defaults: {
        userId: loan.userId,
        message,
        type: 'Vencimiento',
        status: 'Pendiente',
      },
    });

    notifications.push({ notification, created });
  }

  return {
    date: targetDate,
    checkedLoans: loans.length,
    createdNotifications: notifications.filter((item) => item.created).length,
    notifications: notifications.map((item) => item.notification),
  };
}

function daysBetween(startDate, endDate) {
  const start = new Date(`${startDate}T00:00:00Z`);
  const end = new Date(`${endDate}T00:00:00Z`);
  return Math.max(0, Math.floor((end - start) / (24 * 60 * 60 * 1000)));
}

async function createOverdueNotifications(targetDate = formatDate()) {
  const loans = await Loan.findAll({
    where: {
      dueDate: { [Op.lt]: targetDate },
      returnDate: null,
    },
    order: [['id', 'ASC']],
  });

  const notifications = [];
  const penalties = [];

  for (const loan of loans) {
    const overdueDays = daysBetween(loan.dueDate, targetDate);
    const fineAmount = overdueDays * DAILY_FINE_AMOUNT;
    const message = `Prestamo ${loan.id} con ${overdueDays} dias de retraso. Multa acumulada: ${fineAmount}.`;

    const [penalty] = await Penalty.findOrCreate({
      where: {
        loanId: loan.id,
        reason: 'Retraso en devolucion',
      },
      defaults: {
        userId: loan.userId,
        loanId: loan.id,
        amount: fineAmount,
        reason: 'Retraso en devolucion',
        status: 'Pendiente',
      },
    });

    await penalty.update({
      amount: fineAmount,
      status: 'Pendiente',
    });

    const [notification, created] = await Notification.findOrCreate({
      where: {
        userId: loan.userId,
        type: 'Retraso',
        message,
      },
      defaults: {
        userId: loan.userId,
        message,
        type: 'Retraso',
        status: 'Pendiente',
      },
    });

    notifications.push({ notification, created });
    penalties.push(penalty);
  }

  return {
    date: targetDate,
    checkedLoans: loans.length,
    createdNotifications: notifications.filter((item) => item.created).length,
    notifications: notifications.map((item) => item.notification),
    penalties,
  };
}

async function listNotificationsForUser(userId) {
  return Notification.findAll({
    where: { userId },
    order: [['sentDate', 'DESC']],
  });
}

async function listAllNotifications() {
  return Notification.findAll({
    order: [['sentDate', 'DESC']],
  });
}

module.exports = {
  createDueDateNotifications,
  createOverdueNotifications,
  listNotificationsForUser,
  listAllNotifications,
};
