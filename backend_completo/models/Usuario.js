const mongoose = require('mongoose');

// Define el esquema del usuario
const usuarioSchema = new mongoose.Schema({
  correo: String,       // Email del usuario
  contraseña: String    // Contraseña encriptada
});

// Exporta el modelo Usuario
module.exports = mongoose.model('Usuario', usuarioSchema);