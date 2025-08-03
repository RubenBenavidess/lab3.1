const express = require('express');
const Reserva = require('../models/Reserva');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Protege todas las rutas siguientes con autenticación
router.use(authMiddleware);

// Función para validar formato de 12 horas AM/PM
function validarFormatoHora(hora) {
  const regex12Horas = /^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/i;
  return regex12Horas.test(hora);
}

// Función para validar que no sea domingo
function validarNoDomingo(fecha) {
  // Agregar 'T00:00:00' para evitar problemas de zona horaria
  const fechaObj = new Date(fecha + 'T00:00:00');
  const diaSemana = fechaObj.getDay(); // 0 = Domingo, 1 = Lunes, etc.
  
  console.log(`Fecha recibida: ${fecha}`);
  console.log(`Fecha procesada: ${fechaObj}`);
  console.log(`Día de la semana: ${diaSemana} (0=Domingo, 1=Lunes, etc.)`);
  
  return diaSemana !== 0;
}

// Listar todas las reservas del usuario autenticado
router.get('/', async (req, res) => {
  const reservas = await Reserva.find({ usuario: req.userId });
  res.json(reservas);
});

// Crear nueva reserva
router.post('/', async (req, res) => {
  const { fecha, sala, hora } = req.body;

  // CAMBIO 1: Validar formato de 12 horas AM/PM
  if (!validarFormatoHora(hora)) {
    return res.status(400).json({ 
      msg: 'Formato de hora inválido. Use formato de 12 horas con AM/PM (ej. "03:30 PM")' 
    });
  }

  // CAMBIO 2: Validar que no sea domingo
  if (!validarNoDomingo(fecha)) {
    return res.status(400).json({ 
      msg: 'No se permiten reservas los domingos' 
    });
  }

  const nueva = new Reserva({
    usuario: req.userId,
    fecha,
    sala,
    hora
  });

  await nueva.save();
  res.status(201).json(nueva);
});

// Eliminar una reserva (solo si pertenece al usuario)
router.delete('/:id', async (req, res) => {
  await Reserva.deleteOne({ _id: req.params.id, usuario: req.userId });
  res.json({ msg: 'Reserva cancelada' });
});

module.exports = router;