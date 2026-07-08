const AuditLog = require('../models/auditLog');

async function createAuditLog(data, injectedModels = {}) {
  const { AuditLog: AuditLogModel = AuditLog } = injectedModels;

  return AuditLogModel.create({
    userId: data.userId,
    action: data.action,
    resource: data.resource,
    details: data.details || '',
  });
}

module.exports = {
  createAuditLog,
};
