const express = require('express');
const router = express.Router();
const Usuario = require('../models/user');

// GET /api/usuarios → listar todos
router.get('/', async (req, res) => {
  try {
    const usuarios = await Usuario.findAll();
    res.json({ ok: true, data: usuarios });
  } catch (err) {
    res.status(500).json({ ok: false, mensaje: err.message });
  }
});

// GET /api/usuarios/:id → obtener uno por id
router.get('/:id', async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) return res.status(404).json({ ok: false, mensaje: 'No encontrado' });
    res.json({ ok: true, data: usuario });
  } catch (err) {
    res.status(500).json({ ok: false, mensaje: err.message });
  }
});

// POST /api/usuarios → crear nuevo usuario
router.post('/', async (req, res) => {
  try {
    const { nombre, email } = req.body;
    const nuevo = await Usuario.create({ nombre, email });
    res.status(201).json({ ok: true, data: nuevo });
  } catch (err) {
    res.status(400).json({ ok: false, mensaje: err.message });
  }
});

// PUT /api/usuarios/:id → actualizar usuario
router.put('/:id', async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) return res.status(404).json({ ok: false, mensaje: 'No encontrado' });
    await usuario.update(req.body);
    res.json({ ok: true, data: usuario });
  } catch (err) {
    res.status(400).json({ ok: false, mensaje: err.message });
  }
});

// DELETE /api/usuarios/:id → eliminar usuario
router.delete('/:id', async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) return res.status(404).json({ ok: false, mensaje: 'No encontrado' });
    await usuario.destroy();
    res.json({ ok: true, mensaje: 'Usuario eliminado' });
  } catch (err) {
    res.status(500).json({ ok: false, mensaje: err.message });
  }
});

module.exports = router;