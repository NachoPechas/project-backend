const itemService = require('../services/itemService');
const auditService = require('../services/auditService');

class ItemController {
  async getItemStatus(req, res) {
    try {
      const { identifier } = req.params;

      if (!identifier || !String(identifier).trim()) {
        return res.status(400).json({
          success: false,
          message: 'El identificador del ejemplar es obligatorio.',
        });
      }

      const item = await itemService.getStatusByIdentifier(identifier);

      if (!item) {
        return res.status(404).json({
          success: false,
          message: `No existe un ejemplar con identificador ${identifier}.`,
        });
      }

      return res.status(200).json({ success: true, data: item });
    } catch (error) {
      console.error(`[ItemController][getItemStatus] Error: ${error.message}`, error);
      return res.status(500).json({
        success: false,
        message: 'No se pudo procesar la solicitud en este momento.',
      });
    }
  }

  async updatePhysicalCondition(req, res) {
    try {
      const { identifier } = req.params;
      const { physicalCondition } = req.body;

      if (!identifier || !String(identifier).trim()) {
        return res.status(400).json({
          success: false,
          message: 'El identificador del ejemplar es obligatorio.',
        });
      }

      if (!physicalCondition || !String(physicalCondition).trim()) {
        return res.status(400).json({
          success: false,
          message: 'El estado fisico del ejemplar es obligatorio.',
        });
      }

      const item = await itemService.updatePhysicalCondition(
        identifier,
        String(physicalCondition).trim()
      );

      if (!item) {
        return res.status(404).json({
          success: false,
          message: `No existe un ejemplar con identificador ${identifier}.`,
        });
      }

      auditService.logAction({
        userId: req.user ? req.user.id : null,
        action: 'UPDATE_ITEM_PHYSICAL_CONDITION',
        entity: 'Item',
        entityId: item.id,
        details: { physicalCondition: item.physicalCondition, status: item.status },
        ipAddress: req.ip,
      }).catch(() => {});

      return res.status(200).json({
        success: true,
        message: 'Estado fisico del ejemplar actualizado correctamente.',
        data: item,
      });
    } catch (error) {
      console.error(`[ItemController][updatePhysicalCondition] Error: ${error.message}`, error);
      return res.status(500).json({
        success: false,
        message: 'No se pudo actualizar el estado fisico del ejemplar.',
      });
    }
  }
}

module.exports = new ItemController();
