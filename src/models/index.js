const sequelize = require('../config/database');
const Role = require('./role');
const User = require('./user');
const Book = require('./book');
const Item = require('./item');
const Loan = require('./loan');
const StudySeat = require('./studySeat');
const SeatReservation = require('./seatReservation');
const TimeSlot = require('./timeSlot');
const Notification = require('./notification');
const Penalty = require('./penalty');

Role.hasMany(User, { foreignKey: 'roleId', as: 'users' });
User.belongsTo(Role, { foreignKey: 'roleId', as: 'role' });

Book.hasMany(Item, { foreignKey: 'bookId', as: 'items' });
Item.belongsTo(Book, { foreignKey: 'bookId', as: 'book' });

Item.hasMany(Loan, { foreignKey: 'itemId', as: 'loans' });
Loan.belongsTo(Item, { foreignKey: 'itemId', as: 'item' });

User.hasMany(Loan, { foreignKey: 'userId', as: 'loans' });
Loan.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(SeatReservation, { foreignKey: 'userId', as: 'reservations' });
SeatReservation.belongsTo(User, { foreignKey: 'userId', as: 'user' });

StudySeat.hasMany(SeatReservation, { foreignKey: 'seatId', as: 'reservations' });
SeatReservation.belongsTo(StudySeat, { foreignKey: 'seatId', as: 'seat' });

TimeSlot.hasMany(SeatReservation, { foreignKey: 'slotId', as: 'reservations' });
SeatReservation.belongsTo(TimeSlot, { foreignKey: 'slotId', as: 'slot' });

User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications' });
Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Penalty, { foreignKey: 'userId', as: 'penalties' });
Penalty.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Loan.hasMany(Penalty, { foreignKey: 'loanId', as: 'penalties' });
Penalty.belongsTo(Loan, { foreignKey: 'loanId', as: 'loan' });

module.exports = {
  sequelize,
  Role,
  User,
  Book,
  Item,
  Loan,
  StudySeat,
  SeatReservation,
  TimeSlot,
  Notification,
  Penalty,
};
