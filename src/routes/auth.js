const express = require('express');
const router = express.Router();
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const JWT_SECRET = process.env.JWT_SECRET || 'secreto_para_la_biblioteca_123';
const client = new OAuth2Client(CLIENT_ID);

function buildUserDataFromGooglePayload(payload, assignedRoleId) {
  return {
    nombre: payload.name || payload.given_name || payload.email,
    email: payload.email,
    roleId: assignedRoleId,
    status: 'Activo',
  };
}

router.post('/google-login', async (req, res) => {
  const { token } = req.body; 

  if (!token) {
    return res.status(400).json({ error: 'Falta el token de autenticación.' });
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
        error: 'Acceso denegado. Solo se permiten correos institucionales @unal.edu.co' 
      });
    }

    let assignedRoleId = 3; 

    if (email === 'admin.biblioteca@unal.edu.co') {
      assignedRoleId = 1; 
    }


    const userData = buildUserDataFromGooglePayload({ email, name }, assignedRoleId);

    let [dbUser, created] = await User.findOrCreate({
      where: { email: email },
      defaults: userData
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
        roleName: roleName
      },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    return res.json({
      message: created ? 'Usuario registrado e iniciado sesión con éxito' : 'Inicio de sesión exitoso',
      token: libraryToken,
      user: {
        id: dbUser.id,
        name: dbUser.nombre,
        email: dbUser.email,
        roleId: dbUser.roleId,
        roleName: roleName
      }
    });

  } catch (error) {
    console.error('Error en la verificación de Google:', error);
    return res.status(401).json({ error: 'Token de Google inválido o expirado.' });
  }
});

module.exports = {
  router,
  buildUserDataFromGooglePayload,
};