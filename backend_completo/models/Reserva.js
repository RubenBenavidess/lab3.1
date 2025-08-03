const mongoose = require('mongoose');

// Define el esquema de una reserva
const reservaSchema = new mongoose.Schema({
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' }, // Referencia al usuario
  fecha: String,   // Fecha de la reserva
  sala: String,    // Nombre de la sala (ej: A, B, C)
  hora: String     // Hora de la reserva
});

// Exporta el modelo Reserva
module.exports = mongoose.model('Reserva', reservaSchema);