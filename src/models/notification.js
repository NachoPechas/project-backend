const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Notification extends Model {}

Notification.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      field: 'user_id',
      allowNull: true,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    type: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    sentDate: {
      type: DataTypes.DATE,
      field: 'sent_date',
      defaultValue: DataTypes.NOW,
    },
    status: {
      type: DataTypes.STRING(50),
      defaultValue: 'Pendiente',
    },
  },
  {
    sequelize,
    modelName: 'Notification',
    tableName: 'notification',
    timestamps: false,
  }
);

module.exports = Notification;
