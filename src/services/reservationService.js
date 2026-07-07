const StudySeat = require('../models/studySeat');
const SeatReservation = require('../models/seatReservation');
const sequelize = require('../config/database');

/**
 * Agenda un puesto de estudio y actualiza su disponibilidad al confirmar.
 * @param {number} userId
 * @param {number} seatId
 * @param {number} slotId
 * @param {string} reservationDate
 * @param {number} tiempoX
 */
async function agendarPuesto(userId, seatId, slotId, reservationDate, tiempoX) {
  try {
    return await sequelize.transaction(async (transaction) => {
      const puesto = await StudySeat.findByPk(seatId, {
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!puesto) {
        return { success: false, message: `El puesto con ID ${seatId} no existe.` };
      }

      if (puesto.tiempo_restante > 0 || puesto.status === 'Ocupado') {
        return {
          success: false,
          message: `El puesto ${seatId} ya esta ocupado. Tiempo restante: ${puesto.tiempo_restante} minutos.`,
        };
      }

      const reservaExistente = await SeatReservation.findOne({
        where: {
          seatId,
          slotId,
          reservationDate,
          status: 'Activa',
        },
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (reservaExistente) {
        return {
          success: false,
          message: `El puesto ${seatId} ya tiene una reserva activa para el ${reservationDate} en la franja ${slotId}.`,
        };
      }

      const reserva = await SeatReservation.create(
        {
          userId,
          seatId,
          slotId,
          reservationDate,
          status: 'Activa',
        },
        { transaction }
      );

      puesto.tiempo_restante = tiempoX;
      puesto.status = 'Ocupado';
      await puesto.save({ transaction });

      return {
        success: true,
        message: `Reserva confirmada en el puesto ${seatId} para el ${reservationDate} por ${tiempoX} minutos.`,
        data: {
          reservation: reserva,
          seat: puesto,
        },
      };
    });
  } catch (error) {
    console.error('Error interno en agendarPuesto:', error);
    return { success: false, message: 'Error interno del servidor al procesar la reserva.' };
  }
}

/**
 * Reduce los contadores de tiempo de los puestos ocupados.
 */
async function actualizarContadoresTiempo() {
  try {
    const puestosOcupados = await StudySeat.findAll({
      where: {
        status: 'Ocupado',
      },
    });

    for (const puesto of puestosOcupados) {
      if (puesto.tiempo_restante > 0) {
        puesto.tiempo_restante -= 1;
      }

      if (puesto.tiempo_restante === 0) {
        puesto.status = 'Disponible';

        await SeatReservation.update(
          { status: 'Finalizada' },
          { where: { seatId: puesto.id, status: 'Activa' } }
        );
      }

      await puesto.save();
    }
  } catch (error) {
    console.error('Error en actualizarContadoresTiempo:', error);
  }
}

module.exports = {
  agendarPuesto,
  actualizarContadoresTiempo,
};
