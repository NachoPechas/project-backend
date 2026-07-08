const { Op, fn, col } = require('sequelize');
const { Book, Item, Loan, Notification, Penalty, SeatReservation, StudySeat, User } = require('../models');

function buildDateFilter(dateField, from, to) {
  const filter = {};

  if (from || to) {
    filter[dateField] = {};

    if (from) {
      filter[dateField][Op.gte] = from;
    }

    if (to) {
      filter[dateField][Op.lte] = to;
    }
  }

  return filter;
}

async function getLoanReport(filters = {}) {
  const where = buildDateFilter('loanDate', filters.from, filters.to);

  const loans = await Loan.findAll({
    where,
    order: [['loanDate', 'DESC'], ['id', 'DESC']],
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['id', 'nombre', 'email'],
      },
      {
        model: Item,
        as: 'item',
        attributes: ['id', 'description', 'status', 'physicalCondition'],
        include: [
          {
            model: Book,
            as: 'book',
            attributes: ['id', 'title', 'author', 'category'],
          },
        ],
      },
    ],
  });

  return {
    total: loans.length,
    active: loans.filter((loan) => !loan.returnDate).length,
    returned: loans.filter((loan) => Boolean(loan.returnDate)).length,
    data: loans,
  };
}

async function getDelayReport(filters = {}) {
  const today = filters.date || new Date().toISOString().slice(0, 10);

  const overdueLoans = await Loan.findAll({
    where: {
      dueDate: { [Op.lt]: today },
      returnDate: null,
    },
    order: [['dueDate', 'ASC']],
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['id', 'nombre', 'email'],
      },
      {
        model: Item,
        as: 'item',
        attributes: ['id', 'description'],
        include: [
          {
            model: Book,
            as: 'book',
            attributes: ['id', 'title', 'author'],
          },
        ],
      },
      {
        model: Penalty,
        as: 'penalties',
        attributes: ['id', 'amount', 'reason', 'status', 'createdDate'],
      },
    ],
  });

  const data = overdueLoans.map((loan) => {
    const due = new Date(`${loan.dueDate}T00:00:00Z`);
    const reference = new Date(`${today}T00:00:00Z`);
    const overdueDays = Math.max(0, Math.floor((reference - due) / (24 * 60 * 60 * 1000)));

    return {
      id: loan.id,
      userId: loan.userId,
      itemId: loan.itemId,
      loanDate: loan.loanDate,
      dueDate: loan.dueDate,
      overdueDays,
      user: loan.user,
      item: loan.item,
      penalties: loan.penalties,
    };
  });

  return {
    date: today,
    total: data.length,
    data,
  };
}

async function getInventoryReport() {
  const totalItems = await Item.count();
  const byStatus = await Item.findAll({
    attributes: ['status', [fn('COUNT', col('id')), 'count']],
    group: ['status'],
    order: [['status', 'ASC']],
  });

  const books = await Book.findAll({
    attributes: ['id', 'title', 'author', 'category'],
    include: [
      {
        model: Item,
        as: 'items',
        attributes: ['id', 'description', 'status', 'physicalCondition'],
      },
    ],
    order: [['title', 'ASC']],
  });

  return {
    totalItems,
    byStatus: byStatus.map((row) => ({
      status: row.status,
      count: Number(row.get('count')),
    })),
    books,
  };
}

async function getDashboardReport() {
  const today = new Date().toISOString().slice(0, 10);

  const [
    activeLoans,
    overdueLoans,
    totalItems,
    availableItems,
    maintenanceItems,
    activeReservations,
    noShowReservations,
    availableSeats,
    occupiedSeats,
    suspendedUsers,
    activeUsers,
    pendingNotifications,
    pendingPenaltyAmount,
  ] = await Promise.all([
    Loan.count({ where: { returnDate: null } }),
    Loan.count({ where: { dueDate: { [Op.lt]: today }, returnDate: null } }),
    Item.count(),
    Item.count({ where: { status: 'Disponible' } }),
    Item.count({ where: { status: 'Mantenimiento' } }),
    SeatReservation.count({ where: { reservationDate: today, status: 'Activa' } }),
    SeatReservation.count({ where: { status: 'Inasistencia' } }),
    StudySeat.count({ where: { status: 'Disponible' } }),
    StudySeat.count({ where: { status: 'Ocupado' } }),
    User.count({ where: { status: 'Suspendido' } }),
    User.count({ where: { status: 'Activo' } }),
    Notification.count({ where: { status: 'Pendiente' } }),
    Penalty.sum('amount', { where: { status: 'Pendiente' } }),
  ]);

  return {
    date: today,
    loans: {
      active: activeLoans,
      overdue: overdueLoans,
    },
    inventory: {
      totalItems,
      availableItems,
      maintenanceItems,
    },
    reservations: {
      activeToday: activeReservations,
      noShows: noShowReservations,
    },
    seats: {
      available: availableSeats,
      occupied: occupiedSeats,
    },
    users: {
      suspended: suspendedUsers,
      active: activeUsers,
    },
    notifications: {
      pending: pendingNotifications,
    },
    penalties: {
      pendingAmount: Number(pendingPenaltyAmount || 0),
    },
  };
}

module.exports = {
  getLoanReport,
  getDelayReport,
  getInventoryReport,
  getDashboardReport,
};
