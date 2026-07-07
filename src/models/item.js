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
    code: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    bookId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'disponible',
    },
    location: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    physicalCondition: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: 'buen_estado',
    },
  },
  {
    sequelize,
    modelName: 'Item',
    tableName: 'items',
    timestamps: true,
  }
);

module.exports = Item;
