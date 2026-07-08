const express = require('express');
const router = express.Router();
const reservationService = require('../services/reservationService');
const { verifyToken, authorize } = require('../middleware/authMiddleware');
const auditService = require('../services/auditService');

function isValidDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

router.post('/inasistencias', verifyToken, authorize(1, 2), async (req, res) => {
  const toleranceMinutes = Number(req.body.toleranceMinutes || 15);

  if (!Number.isInteger(toleranceMinutes) || toleranceMinutes < 0) {
    return res.status(400).json({
      success: false,
      message: 'toleranceMinutes debe ser un entero mayor o igual a 0.',
    });
  }

  const result = await reservationService.detectarInasistencias(toleranceMinutes);
  auditService.logAction({
    userId: req.user.id,
    action: 'DETECT_NO_SHOWS',
    entity: 'SeatReservation',
    details: result,
    ipAddress: req.ip,
  }).catch(() => {});
  return res.status(200).json({ success: true, data: result });
});

router.post('/suspensiones', verifyToken, authorize(1, 2), async (req, res) => {
  const maxNoShows = Number(req.body.maxNoShows || 3);

  if (!Number.isInteger(maxNoShows) || maxNoShows <= 0) {
    return res.status(400).json({
      success: false,
      message: 'maxNoShows debe ser un entero positivo.',
    });
  }

  const result = await reservationService.suspenderUsuariosPorInasistencias(maxNoShows);
  auditService.logAction({
    userId: req.user.id,
    action: 'SUSPEND_USERS_BY_NO_SHOWS',
    entity: 'User',
    details: result,
    ipAddress: req.ip,
  }).catch(() => {});
  return res.status(200).json({ success: true, data: result });
});

router.post('/', verifyToken, authorize(1, 2, 3), async (req, res) => {
  const { userId, seatId, slotId, reservationDate, durationMinutes } = req.body;
  const userRole = Number(req.user.roleId || req.user.role_id);
  const authenticatedUserId = Number(req.user.id);
  const reservationUserId = userRole === 1 || userRole === 2
    ? Number(userId || authenticatedUserId)
    : authenticatedUserId;

  const reservationData = {
    userId: reservationUserId,
    seatId: Number(seatId),
    slotId: Number(slotId),
    reservationDate,
    durationMinutes: Number(durationMinutes),
  };

  if (
    !Number.isInteger(reservationData.userId) ||
    !Number.isInteger(reservationData.seatId) ||
    !Number.isInteger(reservationData.slotId) ||
    !Number.isInteger(reservationData.durationMinutes) ||
    !isValidDate(reservationData.reservationDate) ||
    reservationData.userId <= 0 ||
    reservationData.seatId <= 0 ||
    reservationData.slotId <= 0 ||
    reservationData.durationMinutes <= 0
  ) {
    return res.status(400).json({
      success: false,
      message: 'seatId, slotId y durationMinutes deben ser enteros positivos; reservationDate debe tener formato YYYY-MM-DD.',
    });
  }

  const result = await reservationService.agendarPuesto(
    reservationData.userId,
    reservationData.seatId,
    reservationData.slotId,
    reservationData.reservationDate,
    reservationData.durationMinutes
  );

  if (!result.success) {
    return res.status(409).json(result);
  }

  auditService.logAction({
    userId: req.user.id,
    action: 'CREATE_SEAT_RESERVATION',
    entity: 'SeatReservation',
    entityId: result.data && result.data.reservation ? result.data.reservation.id : null,
    details: result.data,
    ipAddress: req.ip,
  }).catch(() => {});

  return res.status(201).json(result);
});

module.exports = router;
