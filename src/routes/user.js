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

router.get('/:id', async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) return res.status(404).json({ ok: false, mensaje: 'No encontrado' });
    res.json({ ok: true, data: usuario });
  } catch (err) {
    res.status(500).json({ ok: false, mensaje: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, email } = req.body;
    const nuevo = await Usuario.create({ name, email });
    res.status(201).json({ ok: true, data: nuevo });
  } catch (err) {
    res.status(400).json({ ok: false, mensaje: err.message });
  }
});

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