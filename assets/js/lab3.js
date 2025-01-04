"use strict";

class Cliente {
    constructor(dpi, firstName, lastName, birthDate, job, placeJob, salary) {
        this.dpi = dpi;
        this.firstName = firstName;
        this.lastName = lastName;
        this.birthDate = birthDate;
        this.job = job;
        this.placeJob = placeJob;
        this.salary = salary;
    }

    async generarFirmaDigital() {
        const clienteStr = `${this.dpi}${this.firstName}${this.lastName}${this.birthDate}${this.job}${this.placeJob}${this.salary}`;
        const encoder = new TextEncoder();
        const data = encoder.encode(clienteStr);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
        return hashHex;
    }
}

class Clientefinal extends Cliente {
    constructor(dpi, firstName, lastName, birthDate, job, placeJob, salary, property, budget, signature) {
        super(dpi, firstName, lastName, birthDate, job, placeJob, salary);
        this.property = property;
        this.budget = budget;
        this.signature = signature;
    }
}

class HashTable {
    constructor() {
        this.table = {};
    }

    calcularHash(dpi) {
        return dpi; 
    }

    agregarCliente(cliente) {
        const posicion = this.calcularHash(cliente.dpi);
        this.table[posicion] = cliente;
    }

    buscarCliente(dpi) {
        const posicion = this.calcularHash(dpi);
        return this.table[posicion] || null;
    }
}


const tablaHash = new HashTable();

function agregandototable(cliente) {
    tablaHash.agregarCliente(cliente);
}


fetch('../../Info.json')
    .then(response => response.json())
    .then(data2 => {
        data2.forEach(input => {
            const cliente1 = new Cliente(input.dpi, input.firstName, input.lastName, input.birthDate, input.job, input.placeJob, input.salary);
            agregandototable(cliente1);
        });
    })
    .catch(error => console.error('Error al cargar los datos:', error));


function compararBudget(a, b) {
    return b.budget - a.budget;
}

function eliminacion(customers, rejection) {
    const container = customers.slice(); 
    container.sort(compararBudget);
    container.splice(0, rejection);
    return container[0];
}

function fetchDataAndRecommend() {
    fetch('../../input_auctions.json')
        .then(response => response.json())
        .then(data => {
            data.forEach(input => {
                const { property, customers, rejection } = input;
                const result = eliminacion(customers, rejection);
                const clienteEncontrado = tablaHash.buscarCliente(result.dpi);

                if (clienteEncontrado) {
                    const firmaDigital = clienteEncontrado.generarFirmaDigital();

                    firmaDigital.then((firmaDigital) =>{
                        const clienteganador = new Clientefinal(
                            clienteEncontrado.dpi,
                            clienteEncontrado.firstName,
                            clienteEncontrado.lastName,
                            clienteEncontrado.birthDate,
                            clienteEncontrado.job,
                            clienteEncontrado.placeJob,
                            clienteEncontrado.salary,
                            property,
                            result.budget,
                            firmaDigital
                           
                        );
    
                        const resultadoElement = document.getElementById('resultado');
                        if (resultadoElement) {
                            const fieldLabels = {
                                dpi: 'DPI',
                                firstName: 'Nombre',
                                lastName: 'Apellido',
                                birthDate: 'Fecha de Nacimiento',
                                job: 'Trabajo',
                                placeJob: 'Lugar de Trabajo',
                                salary: 'Salario',
                                property: 'Propiedad',
                                budget: 'Presupuesto',
                                firmaDigital: 'Firma Digital'
                            };
                        
                            Object.entries(clienteganador).forEach(([key, value]) => {
                                const label = fieldLabels[key] || key; 
                                const div = document.createElement('div');
                                div.textContent = `${label}: ${value}`;
                                resultadoElement.appendChild(div);
                            });
                        }
                    })
                   
                }
            });
        })
        .catch(error => console.error('Error al cargar los datos:', error));
}

fetchDataAndRecommend();
