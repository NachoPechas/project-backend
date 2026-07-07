const express = require('express');
const router = express.Router();
const itemService = require('../services/itemService');

router.post('/', async (req, res) => {
  try {
    const item = await itemService.createItem(req.body);
    res.status(201).json({ ok: true, data: item });
  } catch (error) {
    res.status(400).json({ ok: false, message: error.message });
  }
});

router.get('/libro/:bookId', async (req, res) => {
  try {
    const items = await itemService.listItemsByBook(req.params.bookId);
    res.json({ ok: true, data: items });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
});

module.exports = router;
