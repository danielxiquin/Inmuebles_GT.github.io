const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Mostrar formulario 1

app.get('/formulario1', (req, res) => {
    res.sendFile(path.join(__dirname, 'formulario1.html'));  
});

// Mostrar formulario 2
app.get('/formulario2', (req, res) => {
    res.sendFile(path.join(__dirname, 'formulario2.html'));  
});

const tempDataPath = path.join('/tmp', 'data.json');
const tempInfoPath = path.join('/tmp', 'info.json');

app.post('/addData', (req, res) => {
    const formType = req.body.formType;  

    if (formType === 'formulario1') {  // Datos del formulario 1
        const newData = req.body;
        newData.budget = parseFloat(newData.budget);

        fs.readFile(tempDataPath, 'utf8', (err, data) => {
            if (err) return res.status(500).send('Error al leer el archivo data.json');

            const jsonData = JSON.parse(data);
            jsonData[0].input2 = newData;

            fs.writeFile('data.json', JSON.stringify(jsonData, null, 2), (err) => {
                if (err) return res.status(500).send('Error al escribir en el archivo data.json');
                res.status(200).send('Datos de formulario 1 actualizados');
            });
        });
    } else if (formType === 'formulario2') {  // Datos del formulario 2
        const newData = req.body;
        newData.DPI = parseInt(newData.DPI, 10);
        newData.salary = parseFloat(newData.salary);

        fs.readFile(tempInfoPath, 'utf8', (err, data) => {
            if (err) return res.status(500).send('Error al leer el archivo info.json');

            const jsonData = JSON.parse(data);
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
                if (err) return res.status(500).send('Error al escribir en el archivo info.json');
                res.status(200).send('Datos de formulario 2 actualizados');
            });
        });
    } else {
        res.status(400).send('Formulario no reconocido');
    }
});

// Iniciar el servidor
const server = app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});

// Apagado seguro del servidor
const shutdown = () => {
    server.close(() => {
        console.log('Servidor apagado');
    });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
