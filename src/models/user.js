const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING(255),
      field: 'name',
      allowNull: false,
      validate: {
        notEmpty: true,
      }
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      }
    },
    roleId: {
      type: DataTypes.INTEGER,
      field: 'role_id',
      allowNull: false,
      defaultValue: 3,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    loginAttempts: {
      type: DataTypes.INTEGER,
      field: 'login_attempts',
      defaultValue: 0,
    },
    lockUntil: {
      type: DataTypes.DATE,
      field: 'lock_until',
      allowNull: true,
    },
    providerAuth: {
      type: DataTypes.STRING(20),
      field: 'provider_auth',
      defaultValue: 'local',
    },
    status: {
      type: DataTypes.STRING(50),
      defaultValue: 'Activo',
    }
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'user',
    timestamps: true,
    underscored: true,
  }
);

module.exports = User;
