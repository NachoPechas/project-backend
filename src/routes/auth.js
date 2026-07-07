const express = require('express');
const router = express.Router();
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const authController = require('../controllers/authController');

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const JWT_SECRET = process.env.JWT_SECRET || 'secret_token_key_unal';
const client = new OAuth2Client(CLIENT_ID);

router.post('/login', authController.login);

router.post('/google-login', async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: 'Falta el token de autenticacion.' });
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name } = payload;

    if (!email.endsWith('@unal.edu.co')) {
      return res.status(403).json({
        error: 'Acceso denegado. Solo se permiten correos institucionales @unal.edu.co',
      });
    }

    const assignedRoleId = email === 'admin.biblioteca@unal.edu.co' ? 1 : 3;

    const [dbUser, created] = await User.findOrCreate({
      where: { email },
      defaults: {
        nombre: name,
        roleId: assignedRoleId,
        providerAuth: 'google',
        status: 'Activo',
      },
    });

    if (dbUser.status !== 'Activo') {
      return res.status(403).json({ error: 'Tu usuario no se encuentra activo en el sistema.' });
    }

    const roleMap = { 1: 'Administrador', 2: 'Bibliotecario', 3: 'Estudiante' };
    const roleName = roleMap[dbUser.roleId] || 'Estudiante';

    const libraryToken = jwt.sign(
      {
        id: dbUser.id,
        email: dbUser.email,
        roleId: dbUser.roleId,
        roleName,
      },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    return res.json({
      message: created ? 'Usuario registrado e iniciado sesion con exito' : 'Inicio de sesion exitoso',
      token: libraryToken,
      user: {
        id: dbUser.id,
        nombre: dbUser.nombre,
        email: dbUser.email,
        roleId: dbUser.roleId,
        roleName,
      },
    });
  } catch (error) {
    console.error('Error en la verificacion de Google:', error);
    return res.status(401).json({ error: 'Token de Google invalido o expirado.' });
  }
});

module.exports = router;
