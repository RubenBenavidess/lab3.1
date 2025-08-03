const express = require('express');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs'); // Para encriptar contraseñas
const jwt = require('jsonwebtoken'); // Para generar tokens JWT

const router = express.Router();

// Registro de usuario
router.post('/register', async (req, res) => {
  const { correo, contraseña } = req.body;

  // Encripta la contraseña antes de guardarla
  const hashed = await bcrypt.hash(contraseña, 10);

  const nuevo = new Usuario({ correo, contraseña: hashed });
  await nuevo.save();

  res.status(201).json({ msg: 'Usuario creado' });
});

// Login de usuario
router.post('/login', async (req, res) => {
  const { correo, contraseña } = req.body;

  // Busca al usuario en la base de datos
  const usuario = await Usuario.findOne({ correo });
  if (!usuario) return res.status(404).json({ msg: 'No encontrado' });

  // Compara la contraseña ingresada con la almacenada
  const valido = await bcrypt.compare(contraseña, usuario.contraseña);
  if (!valido) return res.status(401).json({ msg: 'Contraseña incorrecta' });

  // Genera un token JWT con el ID del usuario
  const token = jwt.sign({ id: usuario._id }, process.env.JWT_SECRET);
  res.json({ token });
});

module.exports = router;