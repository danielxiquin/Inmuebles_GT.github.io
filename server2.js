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

    fs.readFile('input_auctions.json', 'utf8', (err, otherData) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error al leer el archivo input_auctions.json');
            return;
        }

        let otherJsonData;
        try {
            otherJsonData = JSON.parse(otherData);
        } catch (parseErr) {
            console.error(parseErr);
            res.status(500).send('Error al analizar el archivo JSON input_auctions.json');
            return;
        }

        const indexToUpdate = 3;
        if (otherJsonData[0].customers[indexToUpdate]) {
            otherJsonData[0].customers[indexToUpdate].dpi = newData.DPI;
            otherJsonData[0].customers[indexToUpdate].date = newData.birthday;
        } else {
            res.status(404).send('Cliente no encontrado en la posición especificada');
            return;
        }

        fs.writeFile('input_auctions.json', JSON.stringify(otherJsonData, null, 2), (err) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error al escribir en el archivo input_auctions.json');
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
