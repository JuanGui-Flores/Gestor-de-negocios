const express = require('express');
const router = express.Router();
const pool = require('../config/db'); // Ajusta esta ruta a tu conexión de base de datos si es necesario (ej: '../db')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Clave secreta
const JWT_SECRET = 'clave_secreta_mv_motos';

// Endpoint de Login: POST /api/auth/login
router.post('/login', async (req, res) => {
  const { usuario, password } = req.body;
  console.log('Intentando iniciar sesión con usuario:', usuario);

  try {
    const resultado = await pool.query('SELECT * FROM usuarios WHERE email = $1', [usuario]);
    
    if (resultado.rows.length === 0) {
      console.log('❌ No se encontró ningún usuario con ese email/usuario en la BD.');
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos.' });
    }

    const user = resultado.rows[0];
    console.log('✅ Usuario encontrado en la BD:', user.email);

    const passwordValida = await bcrypt.compare(password, user.password);
    console.log('🔍 ¿Contraseña válida?:', passwordValida);
    
    if (!passwordValida) {
      console.log('❌ La contraseña no coincide con el hash.');
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos.' });
    }

    const token = jwt.sign(
      { id_usuario: user.id_usuario, email: user.email, rol: user.rol },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      mensaje: '¡Bienvenido de nuevo!',
      token,
      usuario: {
        nombre: user.nombre,
        email: user.email,
        rol: user.rol
      }
    });

  } catch (err) {
    console.error('Error en el servidor:', err.message);
    res.status(500).json({ error: 'Error en el servidor al intentar iniciar sesión.' });
  }
});

module.exports = router;