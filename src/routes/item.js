const express = require('express');
const router = express.Router();
const itemService = require('../services/itemService');

const {
  verifyToken,
  authorize
} = require('../middleware/authMiddleware');
const itemController = require('../controllers/item');

// Crear un ejemplar (Administrador o Bibliotecario)
router.post(
  '/',
  verifyToken,
  authorize(1, 2),
  async (req, res) => {
    try {
      const item = await itemService.createItem(req.body);

      res.status(201).json({
        ok: true,
        data: item
      });

    } catch (error) {
      res.status(400).json({
        ok: false,
        message: error.message
      });
    }
  }
);

// Consultar estado de un ejemplar por ID numerico o codigo unico
router.get(
  '/estado/:identifier',
  verifyToken,
  itemController.getItemStatus
);

// Registrar o actualizar el estado fisico de un ejemplar
router.patch(
  '/:identifier/estado-fisico',
  verifyToken,
  authorize(1, 2),
  itemController.updatePhysicalCondition
);

// Consultar ejemplares de un libro (Todos los usuarios autenticados)
router.get(
  '/libro/:bookId',
  verifyToken,
  async (req, res) => {
    try {
      const items = await itemService.listItemsByBook(req.params.bookId);

      res.json({
        ok: true,
        data: items
      });

    } catch (error) {
      res.status(500).json({
        ok: false,
        message: error.message
      });
    }
  }
);

module.exports = router;
