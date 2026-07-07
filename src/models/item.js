const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Item extends Model {}

Item.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    bookId: {
      type: DataTypes.INTEGER,
      field: 'book_id',
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING(50),
      field: 'availability_status',
      allowNull: false,
      defaultValue: 'Disponible',
    },
    physicalCondition: {
      type: DataTypes.STRING(100),
      field: 'physical_condition',
      allowNull: true,
      defaultValue: 'Bueno',
    },
  },
  {
    sequelize,
    modelName: 'Item',
    tableName: 'item',
    timestamps: false,
  }
);

module.exports = Item;
