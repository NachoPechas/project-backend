const StudySeat = require('../models/studySeat');
const SeatReservation = require('../models/seatReservation');
const TimeSlot = require('../models/timeSlot');
const User = require('../models/user');
const sequelize = require('../config/database');

const MAX_NO_SHOWS_BEFORE_SUSPENSION = 3;

function formatDate(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

function buildSlotStartDate(reservationDate, startTime) {
  const normalizedTime = String(startTime || '00:00:00').slice(0, 8);
  return new Date(`${reservationDate}T${normalizedTime}`);
}

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
      const usuario = await User.findByPk(userId, { transaction });

      if (!usuario) {
        return { success: false, message: `El usuario con ID ${userId} no existe.` };
      }

      if (usuario.status === 'Suspendido') {
        return {
          success: false,
          message: 'El usuario se encuentra suspendido temporalmente por inasistencias.',
        };
      }

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

async function detectarInasistencias(toleranceMinutes = 15, currentDate = new Date()) {
  try {
    const today = formatDate(currentDate);
    const reservasActivas = await SeatReservation.findAll({
      where: {
        reservationDate: today,
        status: 'Activa',
      },
      include: [
        {
          model: TimeSlot,
          as: 'slot',
        },
      ],
      order: [['id', 'ASC']],
    });

    const inasistencias = [];

    for (const reserva of reservasActivas) {
      if (!reserva.slot || !reserva.slot.startTime) {
        continue;
      }

      const slotStart = buildSlotStartDate(reserva.reservationDate, reserva.slot.startTime);
      const deadline = new Date(slotStart.getTime() + toleranceMinutes * 60 * 1000);

      if (currentDate < deadline) {
        continue;
      }

      await sequelize.transaction(async (transaction) => {
        const puesto = await StudySeat.findByPk(reserva.seatId, {
          transaction,
          lock: transaction.LOCK.UPDATE,
        });

        reserva.status = 'Inasistencia';
        await reserva.save({ transaction });

        if (puesto) {
          puesto.status = 'Disponible';
          puesto.tiempo_restante = 0;
          await puesto.save({ transaction });
        }
      });

      inasistencias.push(reserva);
    }

    return {
      date: today,
      toleranceMinutes,
      checkedReservations: reservasActivas.length,
      releasedSeats: inasistencias.length,
      reservations: inasistencias,
    };
  } catch (error) {
    console.error('Error al detectar inasistencias:', error);
    return {
      date: formatDate(currentDate),
      toleranceMinutes,
      checkedReservations: 0,
      releasedSeats: 0,
      reservations: [],
      error: error.message,
    };
  }
}

async function suspenderUsuariosPorInasistencias(maxNoShows = MAX_NO_SHOWS_BEFORE_SUSPENSION) {
  const usuarios = await User.findAll({
    where: {
      status: 'Activo',
    },
    order: [['id', 'ASC']],
  });

  const suspendedUsers = [];

  for (const usuario of usuarios) {
    const noShows = await SeatReservation.count({
      where: {
        userId: usuario.id,
        status: 'Inasistencia',
      },
    });

    if (noShows >= maxNoShows) {
      usuario.status = 'Suspendido';
      await usuario.save();
      suspendedUsers.push({
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        noShows,
      });
    }
  }

  return {
    maxNoShows,
    suspendedCount: suspendedUsers.length,
    suspendedUsers,
  };
}

module.exports = {
  agendarPuesto,
  actualizarContadoresTiempo,
  detectarInasistencias,
  suspenderUsuariosPorInasistencias,
};
