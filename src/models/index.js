const sequelize = require('../config/database');
const Role = require('./role');
const User = require('./user');
const Book = require('./book');
const Item = require('./item');
const Loan = require('./loan');

Role.hasMany(User, { foreignKey: 'roleId', as: 'user' });
User.belongsTo(Role, { foreignKey: 'roleId', as: 'role' });

Book.hasMany(Item, { foreignKey: 'bookId', as: 'item' });
Item.belongsTo(Book, { foreignKey: 'bookId', as: 'book' });

Item.hasMany(Loan, { foreignKey: 'itemId', as: 'loan' });
Loan.belongsTo(Item, { foreignKey: 'itemId', as: 'item' });

User.hasMany(Loan, { foreignKey: 'userId', as: 'loan' });
Loan.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = {
  sequelize,
  Role,
  User,
  Book,
  Item,
  Loan,
};
