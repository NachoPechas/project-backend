const express = require('express');
const router = express.Router();
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const JWT_SECRET = process.env.JWT_SECRET || 'secreto_para_la_biblioteca_123';
const client = new OAuth2Client(CLIENT_ID);

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


    let [dbUser, created] = await User.findOrCreate({
      where: { email: email },
      defaults: {
        name: name,
        role_id: assignedRoleId, // Se guarda el ID numérico (1, 2 o 3)
        status: 'Activo'
      }
    });

    if (dbUser.status !== 'Activo') {
      return res.status(403).json({ error: 'Tu usuario no se encuentra activo en el sistema.' });
    }

    const roleMap = { 1: 'Administrador', 2: 'Bibliotecario', 3: 'Estudiante' };
    const roleName = roleMap[dbUser.role_id] || 'Estudiante';

    const libraryToken = jwt.sign(
      { 
        id: dbUser.id, 
        email: dbUser.email, 
        roleId: dbUser.role_id,
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
        name: dbUser.name,
        email: dbUser.email,
        roleId: dbUser.role_id,
        roleName: roleName
      }
    });

  } catch (error) {
    console.error('Error en la verificación de Google:', error);
    return res.status(401).json({ error: 'Token de Google inválido o expirado.' });
  }
});

module.exports = router;