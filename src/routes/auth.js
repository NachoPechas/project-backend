const express = require('express');
const router = express.Router();
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/user');

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

    let [usuario, creado] = await Usuario.findOrCreate({
      where: { email: email },
      defaults: {
        nombre: name,   // Guardamos 'name' de Google en 'nombre' de Postgres
        activo: true,             
        rol: 'estudiante',        
        proveedorAuth: 'google'   
      }
    });

    if (!usuario.activo) {
      return res.status(403).json({ error: 'Tu usuario se encuentra inactivo en el sistema.' });
    }

    const libraryToken = jwt.sign(
      { id: usuario.id, email: usuario.email, rol: usuario.rol || 'estudiante' },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    return res.json({
      message: creado ? 'Usuario registrado e iniciado sesión con éxito' : 'Inicio de sesión exitoso',
      token: libraryToken,
      user: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol || 'estudiante'
      }
    });

  } catch (error) {
    console.error('Error en la verificación de Google:', error);
    return res.status(401).json({ error: 'Token de Google inválido o expirado.' });
  }
});

module.exports = router;