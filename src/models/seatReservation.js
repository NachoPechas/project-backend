const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class SeatReservation extends Model {}

SeatReservation.init(
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
    seatId: {
      type: DataTypes.INTEGER,
      field: 'seat_id',
      allowNull: false,
    },
    slotId: {
      type: DataTypes.INTEGER,
      field: 'slot_id',
      allowNull: false,
    },
    reservationDate: {
      type: DataTypes.DATEONLY,
      field: 'reservation_date',
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

module.exports = SeatReservation;
