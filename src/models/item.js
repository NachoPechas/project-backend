const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Book = require('./book');

const Item = sequelize.define('Item', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  book_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'book',
      key: 'id'
    }
  },
  description: {
    type: DataTypes.TEXT
  },
  physical_condition: {
    type: DataTypes.STRING(100)
  },
  availability_status: {
    type: DataTypes.STRING(50),
    defaultValue: 'Disponible'
  }
}, {
  tableName: 'item',
  timestamps: false
});

Item.belongsTo(Book, { foreignKey: 'book_id', as: 'book' });
Book.hasMany(Item, { foreignKey: 'book_id', as: 'items' });

module.exports = Item;