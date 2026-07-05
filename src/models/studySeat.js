const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User'); // Asumiendo que tienes tu modelo User

class StudySeat extends Model {}
StudySeat.init({
  id: { type: DataTypes.INTEGER, primaryKey: true },
  status: { type: DataTypes.VARCHAR(50), defaultValue: 'Disponible' },
  location_details: { type: DataTypes.TEXT },
  computers: { type: DataTypes.INTEGER },
  // Añadimos virtualmente o físicamente el contador 'x' de tiempo restante en minutos
  tiempo_restante: { type: DataTypes.INTEGER, defaultValue: 0 } 
}, {
  sequelize,
  modelName: 'StudySeat',
  tableName: 'study_seat',
  timestamps: false
});

class SeatReservation extends Model {}
SeatReservation.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER },
  seat_id: { type: DataTypes.INTEGER },
  slot_id: { type: DataTypes.INTEGER },
  reservation_date: { type: DataTypes.DATEONLY, defaultValue: DataTypes.NOW },
  status: { type: DataTypes.VARCHAR(50), defaultValue: 'Activa' }
}, {
  sequelize,
  modelName: 'SeatReservation',
  tableName: 'seat_reservation',
  timestamps: false
});

// Relaciones
StudySeat.hasMany(SeatReservation, { foreignKey: 'seat_id' });
SeatReservation.belongsTo(StudySeat, { foreignKey: 'seat_id' });