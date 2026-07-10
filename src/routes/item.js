const express = require('express');
const router = express.Router();
const itemService = require('../services/itemService');

const {
  verifyToken,
  authorize
} = require('../middleware/authMiddleware');
const itemController = require('../controllers/item');


router.get(
  '/',
  verifyToken,
  authorize(1, 2),
  async (req, res) => {
    try {
      const items = await itemService.listItems();

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


router.get(
  '/estado/:identifier',
  verifyToken,
  itemController.getItemStatus
);


router.patch(
  '/:identifier/estado-fisico',
  verifyToken,
  authorize(1, 2),
  itemController.updatePhysicalCondition
);


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
