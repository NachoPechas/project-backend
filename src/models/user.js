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
    name: {
      type: DataTypes.STRING(255),
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
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 3,
      references: {
        model: 'role', 
        key: 'id',
      },
      field: 'role_id'
    },
    status: {
      type: DataTypes.STRING(50),
      defaultValue: 'Activo',
    },

    password: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    login_attempts: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'login_attempts'
    },
    lock_until: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'lock_until'
    }
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'user',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

module.exports = User;