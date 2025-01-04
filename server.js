const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Rutas temporales para archivos JSON
const tempDataPath = path.join('/tmp', 'data.json');
const tempInfoPath = path.join('/tmp', 'info.json');
const tempAuctionsPath = path.join('/tmp', 'input_auctions.json');

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Rutas para mostrar los formularios
app.get('/formulario1', (req, res) => {
    res.sendFile(path.join(__dirname, 'formulario1.html'));
});

app.get('/formulario2', (req, res) => {
    res.sendFile(path.join(__dirname, 'formulario2.html'));
});

// Ruta POST para manejar ambos formularios
app.post('/addData', (req, res) => {
    const formType = req.body.formType;

    if (formType === 'formulario1') {  // Manejo del formulario 1
        const newData = req.body;
        newData.budget = parseFloat(newData.budget);

        // Actualización de data.json (input2)
        fs.readFile(tempDataPath, 'utf8', (err, data) => {
            if (err) {
                const initialData = [{ input2: {} }];
                fs.writeFileSync(tempDataPath, JSON.stringify(initialData, null, 2));
                data = JSON.stringify(initialData);
            }
            const jsonData = JSON.parse(data);
            jsonData[0].input2 = newData;  // Actualiza input2 con los datos del formulario

            fs.writeFile(tempDataPath, JSON.stringify(jsonData, null, 2), (err) => {
                if (err) return res.status(500).send('Error al escribir en data.json');
                console.log('Datos guardados en data.json');
            });
        });

        // Registrar la subasta en input_auctions.json solo si es necesario
        fs.readFile(tempAuctionsPath, 'utf8', (err, otherData) => {
            if (err) {
                const initialData = [{ customers: [] }];
                fs.writeFileSync(tempAuctionsPath, JSON.stringify(initialData, null, 2));
                otherData = JSON.stringify(initialData);
            }
            const otherJsonData = JSON.parse(otherData);
            otherJsonData[0].customers.push({
                name: newData.name || "Cliente Anónimo",
                budget: newData.budget
            });

            fs.writeFile(tempAuctionsPath, JSON.stringify(otherJsonData, null, 2), (err) => {
                if (err) return res.status(500).send('Error al escribir en input_auctions.json');
                res.status(200).send('Formulario 1 procesado correctamente y cliente registrado en subasta');

                res.redirect('/Subasta.html');
            });
        });
    } else if (formType === 'formulario2') {  // Manejo del formulario 2
        const newData = req.body;
        newData.DPI = parseInt(newData.DPI, 10);
        newData.salary = parseFloat(newData.salary);

        // Guardar los datos en info.json (no toca input_auctions.json)
        fs.readFile(tempInfoPath, 'utf8', (err, data) => {
            if (err) {
                const initialData = [{ clients: [] }];
                fs.writeFileSync(tempInfoPath, JSON.stringify(initialData, null, 2));
                data = JSON.stringify(initialData);
            }
            const jsonData = JSON.parse(data);
            jsonData[0].clients.push({  // Agrega un nuevo cliente al array
                dpi: newData.DPI,
                firstName: newData.name,
                lastName: newData.lastname,
                birthDate: newData.birthday,
                job: newData.ocup,
                placeJob: newData.work,
                salary: newData.salary
            });

            fs.writeFile(tempInfoPath, JSON.stringify(jsonData, null, 2), (err) => {
                if (err) return res.status(500).send('Error al escribir en info.json');
                res.status(200).send('Datos de formulario 2 actualizados correctamente');
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

process.on('SIGTERM', () => server.close(() => console.log('Servidor apagado')));
process.on('SIGINT', () => server.close(() => console.log('Servidor apagado')));
