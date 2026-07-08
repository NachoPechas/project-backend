const { Op } = require('sequelize');
const { AuditLog, User } = require('../models');

async function logAction({ userId = null, action, entity = null, entityId = null, details = null, ipAddress = null }) {
  if (!action) {
    return null;
  }

  return AuditLog.create({
    userId,
    action,
    entity,
    entityId,
    details,
    ipAddress,
  });
}

async function listAuditLogs(filters = {}) {
  const where = {};

  if (filters.userId) {
    where.userId = Number(filters.userId);
  }

  if (filters.action) {
    where.action = filters.action;
  }

  if (filters.entity) {
    where.entity = filters.entity;
  }

  if (filters.from || filters.to) {
    where.createdAt = {};
    if (filters.from) where.createdAt[Op.gte] = new Date(`${filters.from}T00:00:00`);
    if (filters.to) where.createdAt[Op.lte] = new Date(`${filters.to}T23:59:59`);
  }

  return AuditLog.findAll({
    where,
    order: [['createdAt', 'DESC']],
    limit: Math.min(Number(filters.limit || 100), 500),
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['id', 'nombre', 'email', 'roleId'],
      },
    ],
  });
}

function audit(action, entity) {
  return (req, res, next) => {
    const originalJson = res.json.bind(res);

    res.json = (body) => {
      if (res.statusCode < 400) {
        logAction({
          userId: req.user ? req.user.id : null,
          action,
          entity,
          entityId: req.params.id || req.params.identifier || null,
          details: {
            method: req.method,
            path: req.originalUrl,
            body: req.body,
          },
          ipAddress: req.ip,
        }).catch((error) => {
          console.error('Error al registrar auditoria:', error.message);
        });
      }

      return originalJson(body);
    };

    next();
  };
}

module.exports = {
  logAction,
  listAuditLogs,
  audit,
};
