const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Ruta para formulario 1
app.get('/formulario1', (req, res) => {
    res.sendFile(path.join(__dirname, 'formulario1.html'));
});

app.post('/formulario1/addData', (req, res) => {
    const newData = req.body;
    newData.budget = parseFloat(newData.budget);
    fs.readFile('data.json', 'utf8', (err, data) => {
        if (err) return res.status(500).send('Error al leer el archivo');
        const jsonData = JSON.parse(data);
        jsonData[0].input2 = newData;
        fs.writeFile('data.json', JSON.stringify(jsonData, null, 2), (err) => {
            if (err) return res.status(500).send('Error al escribir el archivo');
        });
    });
    res.status(200).send('Datos de formulario 1 actualizados');
});

// Ruta para formulario 2
app.get('/formulario2', (req, res) => {
    res.sendFile(path.join(__dirname, 'formulario2.html'));
});

app.post('/formulario2/addData', (req, res) => {
    const newData = req.body;
    newData.DPI = parseInt(newData.DPI, 10);
    newData.salary = parseFloat(newData.salary);
    fs.readFile('info.json', 'utf8', (err, data) => {
        if (err) return res.status(500).send('Error al leer el archivo');
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
            if (err) return res.status(500).send('Error al escribir el archivo');
        });
    });
    res.status(200).send('Datos de formulario 2 actualizados');
});

// Iniciar el servidor
const server = app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
