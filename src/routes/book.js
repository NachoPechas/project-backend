const express = require('express');
const router = express.Router();
const bookService = require('../services/bookService');

const {
  verifyToken,
  authorize
} = require('../middleware/authMiddleware');

// Crear libro (Administrador o Bibliotecario)
router.post(
  '/',
  verifyToken,
  authorize(1, 2),
  async (req, res) => {
    try {
      const book = await bookService.createBook(req.body);
      res.status(201).json({ ok: true, data: book });
    } catch (error) {
      res.status(400).json({ ok: false, message: error.message });
    }
  }
);

// Ver todos los libros (cualquier usuario autenticado)
router.get(
  '/',
  verifyToken,
  async (req, res) => {
    try {
      const { title, author, category } = req.query;
      const hasFilters = title || author || category;
      const books = hasFilters
        ? await bookService.searchCatalog({ title, author, category })
        : await bookService.listBooks();

      res.json({ ok: true, data: books });
    } catch (error) {
      res.status(500).json({ ok: false, message: error.message });
    }
  }
);

// Ver un libro por ID (cualquier usuario autenticado)
router.get(
  '/:id',
  verifyToken,
  async (req, res) => {
    try {
      const book = await bookService.getBookById(req.params.id);

      if (!book) {
        return res.status(404).json({
          ok: false,
          message: 'Libro no encontrado'
        });
      }

      res.json({ ok: true, data: book });

    } catch (error) {
      res.status(500).json({
        ok: false,
        message: error.message
      });
    }
  }
);

module.exports = router;
