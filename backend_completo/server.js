const express = require('express'); // Framework para construir servidores web
const mongoose = require('mongoose'); // ODM para MongoDB
const cors = require('cors'); // Permite el acceso desde otros orígenes
const authRoutes = require('./routes/auth'); // Rutas de autenticación
const reservaRoutes = require('./routes/reservas'); // Rutas de reservas
require('dotenv').config(); // Carga variables de entorno desde .env

const app = express();
app.use(cors()); // Habilita CORS
app.use(express.json()); // Permite parsear cuerpos JSON

// Enrutamiento
app.use('/api/auth', authRoutes);
app.use('/api/reservas', reservaRoutes);

// Conexión a MongoDB y levantamiento del servidor
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB conectado');
    app.listen(3000, () => console.log('Servidor corriendo en puerto 3000'));
  })
  .catch(err => console.error(err));