const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 4000;

app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'formulario2.html'));
});

app.post('/addData', (req, res) => {
    const newData = req.body;

    newData.DPI = parseInt(newData.DPI, 10);
    newData.salary = parseFloat(newData.salary);

    fs.readFile('info.json', 'utf8', (err, data) => {
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

        jsonData[1] = {
            dpi: newData.DPI,
            firstName: newData.name,
            lastName: newData.lastname,
            birthDate: newData.birthday,
            job: newData.ocup,
            placeJob: newData.work,
            salary: newData.salary
        };

        fs.writeFile('info.json', JSON.stringify(jsonData, null, 2), (err) => {
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
