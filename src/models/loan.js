const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Loan extends Model {}

Loan.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      field: 'user_id',
      allowNull: false,
    },
    itemId: {
      type: DataTypes.INTEGER,
      field: 'item_id',
      allowNull: false,
    },
    loanDate: {
      type: DataTypes.DATEONLY,
      field: 'loan_date',
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    dueDate: {
      type: DataTypes.DATEONLY,
      field: 'due_date',
      allowNull: false,
    },
    returnDate: {
      type: DataTypes.DATEONLY,
      field: 'return_date',
      allowNull: true,
    },
    initialCondition: {
      type: DataTypes.STRING(100),
      field: 'initial_condition',
      allowNull: true,
    },
    finalCondition: {
      type: DataTypes.STRING(100),
      field: 'final_condition',
      allowNull: true,
    }
  },
  {
    sequelize,
    modelName: 'Loan',
    tableName: 'loan',
    timestamps: false,
  }
);

module.exports = Loan;
