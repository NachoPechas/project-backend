const test = require('node:test');
const assert = require('node:assert/strict');
const { createPhysicalStateReport } = require('../src/services/physicalStateReportService');
const { createReservation } = require('../src/services/reservationService');
const { createNotification } = require('../src/services/notificationService');
const { createAuditLog } = require('../src/services/auditLogService');

test('createPhysicalStateReport marca un ejemplar como en mantenimiento si el reporte es dañado', async () => {
  const item = {
    id: 1,
    status: 'disponible',
    physicalCondition: 'buen_estado',
    update: async (changes) => Object.assign(item, changes),
  };
  const report = {
    create: async (data) => data,
  };

  const result = await createPhysicalStateReport({ itemId: 1, state: 'dañado', observation: 'Roto', reportedBy: 5 }, {
    Item: { findByPk: async () => item },
    PhysicalStateReport: report,
  });

  assert.equal(result.state, 'dañado');
  assert.equal(item.status, 'en_mantenimiento');
  assert.equal(item.physicalCondition, 'dañado');
});

test('createReservation rechaza una reserva si ya existe un conflicto activo para el mismo puesto y franja', async () => {
  const seat = { id: 2, status: 'Disponible', tiempo_restante: 0, save: async function () { return this; } };
  const reservationModel = {
    findOne: async () => ({ id: 99, status: 'Activa' }),
    create: async () => ({ ok: true }),
  };

  await assert.rejects(
    () => createReservation(10, 2, 4, 30, { StudySeat: { findByPk: async () => seat }, SeatReservation: reservationModel }),
    /No es posible reservar/i
  );
});

test('createNotification guarda un mensaje con estado pendiente', async () => {
  const notifications = [];
  const notificationModel = {
    create: async (data) => {
      notifications.push(data);
      return data;
    },
  };

  const result = await createNotification({ userId: 3, type: 'vencimiento', message: 'Préstamo por vencer' }, { Notification: notificationModel });

  assert.equal(result.status, 'pendiente');
  assert.equal(notifications[0].message, 'Préstamo por vencer');
});

test('createAuditLog registra una acción del sistema', async () => {
  const logs = [];
  const auditModel = {
    create: async (data) => {
      logs.push(data);
      return data;
    },
  };

  const result = await createAuditLog({ userId: 1, action: 'crear_rol', resource: 'roles', details: 'Rol creado' }, { AuditLog: auditModel });

  assert.equal(result.action, 'crear_rol');
  assert.equal(logs[0].resource, 'roles');
});
