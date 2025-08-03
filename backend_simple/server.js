const express = require('express');

const app = express();

const PORT = 3000;

//Middleware to parse JSON bodies
app.use(express.json());

//Ruta GET para enviar un mensaje de bienvenida
app.get('/api/hello', (req, res) => {
    setTimeout(() => {
        res.send('Hello, World!');    
    }, Math.random() * 500);
});

//Ruta POST para recibir datos y responder con lo mismo recibido
app.post('/api/data', (req, res) => {
    const data = req.body;

    setTimeout(() => {
        res.status(201).json({"receivedData": data});
    }, Math.random() * 800);
});

//Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});