const Item = require('../models/item');
const PhysicalStateReport = require('../models/physicalStateReport');

async function createPhysicalStateReport(data, injectedModels = {}) {
  const { Item: ItemModel = Item, PhysicalStateReport: ReportModel = PhysicalStateReport } = injectedModels;
  const item = await ItemModel.findByPk(data.itemId);

  if (!item) {
    throw new Error('El ejemplar no existe');
  }

  const report = await ReportModel.create({
    itemId: data.itemId,
    state: data.state,
    observation: data.observation || '',
    reportedBy: data.reportedBy,
  });

  if (data.state === 'dañado') {
    await item.update({
      status: 'en_mantenimiento',
      physicalCondition: 'dañado',
    });
  }

  return report;
}

module.exports = {
  createPhysicalStateReport,
};
