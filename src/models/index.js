const sequelize = require('../config/database');
const Role = require('./role');
const User = require('./user');
const Book = require('./book');
const Item = require('./item');
const Loan = require('./loan');
const PhysicalStateReport = require('./physicalStateReport');
const Notification = require('./notification');
const AuditLog = require('./auditLog');

Role.hasMany(User, { foreignKey: 'roleId', as: 'users' });
User.belongsTo(Role, { foreignKey: 'roleId', as: 'role' });

Book.hasMany(Item, { foreignKey: 'bookId', as: 'items' });
Item.belongsTo(Book, { foreignKey: 'bookId', as: 'book' });

Item.hasMany(Loan, { foreignKey: 'itemId', as: 'loans' });
Loan.belongsTo(Item, { foreignKey: 'itemId', as: 'item' });

User.hasMany(Loan, { foreignKey: 'userId', as: 'loans' });
Loan.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = {
  sequelize,
  Role,
  User,
  Book,
  Item,
  Loan,
  PhysicalStateReport,
  Notification,
  AuditLog,
};
