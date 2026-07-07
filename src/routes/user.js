const express = require('express');
const router = express.Router();
const Usuario = require('../models/user');

const {
  verifyToken,
  authorize
} = require('../middleware/authMiddleware');
const userController = require('../controllers/userController');

// Registro publico de estudiantes con correo institucional
router.post('/registro', userController.register);

// Obtener todos los usuarios (Solo Administrador)
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

// Obtener un usuario por ID (Solo Administrador)
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

// Crear usuario (Solo Administrador)
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

// Actualizar usuario (Solo Administrador)
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

// Eliminar usuario (Solo Administrador)
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
