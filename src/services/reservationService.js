const StudySeat = require('project-backend/models/StudySeat');
const SeatReservation = require('project-backend/models/seatReservation');

/**
 * * @param {number} userId
 * @param {number} seatId 
 * @param {number} slotId 
 * @param {number} tiempoX 
 */
async function agendarPuesto(userId, seatId, slotId, tiempoX) {
  try {
    const puesto = await StudySeat.findByPk(seatId);

    if (!puesto) {
      return { success: false, message: `El puesto con ID ${seatId} no existe.` };
    }

    if (puesto.tiempo_restante > 0 || puesto.status === 'Ocupado') {
      return { 
        success: false, 
        message: `⚠️ El puesto ${seatId} ya está ocupado. Tiempo restante: ${puesto.tiempo_restante} minutos.` 
      };
    }

    await SeatReservation.create({
      user_id: userId,
      seat_id: seatId,
      slot_id: slotId,
      status: 'Activa'
    });

    puesto.tiempo_restante = tiempoX;
    puesto.status = 'Ocupado';
    await puesto.save();

    return { 
      success: true, 
      message: `✅ Reserva confirmada en el puesto ${seatId} por ${tiempoX} minutos.` 
    };

  } catch (error) {
    console.error("Error al agendar el puesto:", error);
    return { success: false, message: "Error interno del servidor al procesar la reserva." };
  }
}


async function actualizarContadoresTiempo() {
  try {
    // Buscamos todos los puestos que tengan tiempo_restante mayor a 0
    const puestosOcupados = await StudySeat.findAll({
      where: {
        status: 'Ocupado'
      }
    });

    for (let puesto of puestosOcupados) {
      if (puesto.tiempo_restante > 0) {
        puesto.tiempo_restante -= 1; 
      }

      if (puesto.tiempo_restante === 0) {
        puesto.status = 'Disponible';
        
        await SeatReservation.update(
          { status: 'Finalizada' },
          { where: { seat_id: puesto.id, status: 'Activa' } }
        );
      }

      await puesto.save();
    }
  } catch (error) {
    console.error("Error actualizando los contadores de los puestos:", error);
  }
}

module.exports = {
  agendarPuesto,
  actualizarContadoresTiempo
};