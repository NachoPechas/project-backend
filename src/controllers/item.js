const itemService = require('../services/itemService');

class ItemController {
  async getItemStatus(req, res) {
    try {
      const { id } = req.params;

      if (!id || isNaN(Number(id))) {
        return res.status(400).json({
          success: false,
          message: 'El identificador del ejemplar debe ser numérico.'
        });
      }

      const item = await itemService.getStatusById(id);

      if (!item) {
        return res.status(404).json({
          success: false,
          message: `No existe un ejemplar con ID ${id}.`
        });
      }

      return res.status(200).json({ success: true, data: item });
    } catch (error) {
      console.error(`[ItemController][getItemStatus] Error: ${error.message}`, error);
      return res.status(500).json({
        success: false,
        message: 'No se pudo procesar la solicitud en este momento.'
      });
    }
  }
}

module.exports = new ItemController();