const express = require('express');
const router = express.Router();
const Usuario = require('../models/user');

const {
  verifyToken,
  authorize
} = require('../middleware/authMiddleware');
const userController = require('../controllers/userController');

router.post('/registro', verifyToken, userController.register);


router.get(
  '/',
  verifyToken,
  authorize(1),
  async (req, res) => {
    try {
      const usuarios = await Usuario.findAll();
      res.json({ ok: true, data: usuarios });
    } catch (err) {
      res.status(500).json({
        ok: false,
        mensaje: err.message
      });
    }
  }
);


router.get(
  '/:id',
  verifyToken,
  authorize(1),
  async (req, res) => {
    try {
      const usuario = await Usuario.findByPk(req.params.id);

      if (!usuario) {
        return res.status(404).json({
          ok: false,
          mensaje: 'No encontrado'
        });
      }

      res.json({
        ok: true,
        data: usuario
      });

    } catch (err) {
      res.status(500).json({
        ok: false,
        mensaje: err.message
      });
    }
  }
);


router.post(
  '/',
  verifyToken,
  authorize(1),
  async (req, res) => {
    try {
      const { nombre, email } = req.body;

      const nuevo = await Usuario.create({
        nombre,
        email,
        roleId: 3,
        status: 'Activo'
      });

      res.status(201).json({
        ok: true,
        data: nuevo
      });

    } catch (err) {
      res.status(400).json({
        ok: false,
        mensaje: err.message
      });
    }
  }
);


router.put(
  '/:id',
  verifyToken,
  authorize(1),
  async (req, res) => {
    try {
      const usuario = await Usuario.findByPk(req.params.id);

      if (!usuario) {
        return res.status(404).json({
          ok: false,
          mensaje: 'No encontrado'
        });
      }

      await usuario.update(req.body);

      res.json({
        ok: true,
        data: usuario
      });

    } catch (err) {
      res.status(400).json({
        ok: false,
        mensaje: err.message
      });
    }
  }
);


router.delete(
  '/:id',
  verifyToken,
  authorize(1),
  async (req, res) => {
    try {
      const usuario = await Usuario.findByPk(req.params.id);

      if (!usuario) {
        return res.status(404).json({
          ok: false,
          mensaje: 'No encontrado'
        });
      }

      await usuario.destroy();

      res.json({
        ok: true,
        mensaje: 'Usuario eliminado'
      });

    } catch (err) {
      res.status(500).json({
        ok: false,
        mensaje: err.message
      });
    }
  }
);

module.exports = router;
