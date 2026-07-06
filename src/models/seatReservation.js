const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

const User = require('./user');
const StudySeat = require('./studySeat');

class SeatReservation extends Model {}

SeatReservation.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    seat_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    slot_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    reservation_date: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW,
    },
    status: { 
      type: DataTypes.STRING(50), 
      defaultValue: 'Activa' 
    },
  },
  {
    sequelize,
    modelName: 'SeatReservation',
    tableName: 'seat_reservation',
    timestamps: false,
  }
);

// Relaciones con Usuarios
SeatReservation.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
User.hasMany(SeatReservation, { foreignKey: 'user_id', as: 'reservations' });

// Relaciones con Puestos
SeatReservation.belongsTo(StudySeat, { foreignKey: 'seat_id', as: 'seat' });
StudySeat.hasMany(SeatReservation, { foreignKey: 'seat_id', as: 'reservations' });

module.exports = SeatReservation;