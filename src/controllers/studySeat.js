const { Op } = require('sequelize');
const { StudySeat, TimeSlot, SeatReservation } = require('../models');

function formatSeat(seat, availableSlots, reservedSlots) {
  return {
    id: seat.id,
    code: `P-${String(seat.id).padStart(3, '0')}`,
    location: seat.location_details,
    status: seat.status,
    computers: seat.computers,
    remainingMinutes: seat.tiempo_restante,
    availableSlots,
    reservedSlots,
  };
}

const buscarPuestosEstudio = async (req, res) => {
  try {
    const { details, status, computers, date } = req.query;
    const reservationDate = date || new Date().toISOString().slice(0, 10);
    const condiciones = {};

    if (details) {
      condiciones.location_details = {
        [Op.iLike]: `%${details}%`,
      };
    }

    if (status) {
      condiciones.status = status;
    }

    if (computers) {
      condiciones.computers = parseInt(computers, 10);
    }

    const [puestos, franjas, reservas] = await Promise.all([
      StudySeat.findAll({
        where: condiciones,
        order: [['id', 'ASC']],
      }),
      TimeSlot.findAll({
        order: [['id', 'ASC']],
      }),
      SeatReservation.findAll({
        where: {
          reservationDate,
          status: 'Activa',
        },
      }),
    ]);

    const reservasPorPuesto = new Map();

    for (const reserva of reservas) {
      if (!reservasPorPuesto.has(reserva.seatId)) {
        reservasPorPuesto.set(reserva.seatId, new Set());
      }

      reservasPorPuesto.get(reserva.seatId).add(reserva.slotId);
    }

    const data = puestos.map((puesto) => {
      const reservedSlotIds = reservasPorPuesto.get(puesto.id) || new Set();
      const availableSlots = franjas
        .filter((franja) => !reservedSlotIds.has(franja.id))
        .map((franja) => ({
          id: franja.id,
          startTime: franja.startTime,
          endTime: franja.endTime,
        }));

      const reservedSlots = franjas
        .filter((franja) => reservedSlotIds.has(franja.id))
        .map((franja) => ({
          id: franja.id,
          startTime: franja.startTime,
          endTime: franja.endTime,
        }));

      return formatSeat(puesto, availableSlots, reservedSlots);
    });

    return res.status(200).json({
      success: true,
      date: reservationDate,
      count: data.length,
      data,
    });
  } catch (error) {
    console.error('Error al consultar puestos de estudio:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno en el servidor al consultar puestos de estudio.',
      error: error.message,
    });
  }
};

module.exports = {
  buscarPuestosEstudio,
};
