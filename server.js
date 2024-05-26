const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'formulario1.html'));
});

app.post('/addData', (req, res) => {
    const newData = req.body;

    newData.budget = parseFloat(newData.budget);

    fs.readFile('data.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error al leer el archivo');
            return;
        }

        let jsonData;
        try {
            jsonData = JSON.parse(data);
        } catch (parseErr) {
            console.error(parseErr);
            res.status(500).send('Error al analizar el archivo JSON');
            return;
        }

        jsonData[0].input2 = newData;

        fs.writeFile('data.json', JSON.stringify(jsonData, null, 2), (err) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error al escribir en el archivo');
                return;
            }

        });
    });
});


const server = app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`El puerto ${port} ya está en uso`);
    } else {
        console.error(`Error del servidor: ${err}`);
    }
});

const shutdown = () => {
    server.close(() => {
        console.log('Servidor apagado');
    });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);