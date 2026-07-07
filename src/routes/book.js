const express = require('express');
const router = express.Router();
const bookService = require('../services/bookService');

router.post('/', async (req, res) => {
  try {
    const book = await bookService.createBook(req.body);
    res.status(201).json({ ok: true, data: book });
  } catch (error) {
    res.status(400).json({ ok: false, message: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const books = await bookService.listBooks();
    res.json({ ok: true, data: books });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const book = await bookService.getBookById(req.params.id);
    if (!book) {
      return res.status(404).json({ ok: false, message: 'Libro no encontrado' });
    }
    res.json({ ok: true, data: book });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
});

module.exports = router;
