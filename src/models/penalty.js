const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Penalty extends Model {}

Penalty.init(
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
    loanId: {
      type: DataTypes.INTEGER,
      field: 'loan_id',
      allowNull: true,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING(50),
      defaultValue: 'Pendiente',
    },
    createdDate: {
      type: DataTypes.DATEONLY,
      field: 'created_date',
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'Penalty',
    tableName: 'penalty',
    timestamps: false,
  }
);

module.exports = Penalty;
