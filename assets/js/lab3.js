"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var crypto = require("crypto");





//----------Creando el cliente-------------
var Cliente = /** @class */ (function () {
    function Cliente(dpi, firstName, lastName, birthDate, job, placeJob, salary) {
        this.dpi = dpi;
        this.firstName = firstName;
        this.lastName = lastName;
        this.birthDate = birthDate;
        this.job = job;
        this.placeJob = placeJob;
        this.salary = salary;
    }
    Cliente.prototype.generarFirmaDigital = function () {
        var clienteStr = "".concat(this.dpi).concat(this.firstName).concat(this.lastName).concat(this.birthDate).concat(this.job).concat(this.placeJob).concat(this.salary);
        var hash = crypto.createHash('sha256');
        hash.update(clienteStr);
        var firmaDigital = hash.digest('hex');
        return firmaDigital;
    };
    return Cliente;
}());
var Clientefinal = /** @class */ (function (_super) {
    __extends(Clientefinal, _super);
    function Clientefinal(dpi, firstName, lastName, birthDate, job, placeJob, salary, property, budget, signature) {
        var _this = _super.call(this, dpi, firstName, lastName, birthDate, job, placeJob, salary) || this;
        _this.property = property;
        _this.budget = budget;
        _this.signature = signature;
        return _this;
    }
    return Clientefinal;
}(Cliente));
var HashTable = /** @class */ (function () {
    function HashTable() {
        this.table = {};
    }
    HashTable.prototype.calcularHash = function (dpi) {
        return dpi;
    };
    HashTable.prototype.agregarCliente = function (cliente) {
        var posicion = this.calcularHash(cliente.dpi);
        this.table[posicion] = cliente;
    };
    HashTable.prototype.buscarCliente = function (dpi) {
        var posicion = this.calcularHash(dpi);
        return this.table[posicion] || null;
    };
    return HashTable;
}());
//--------Agregando datos en la tabla hash0------------
var tablaHash = new HashTable();
function agregandototable(cliente) {
    tablaHash.agregarCliente(cliente);
}

//------------RECORRIENDO INPUT2 ---------------
const filePath = '../../Info.json'; 

fetch(filePath)
    .then(response => response.json())
    .then(data2 => {
        data2.forEach(function (input) {
            var cliente1 = new Cliente(input.dpi, input.firstName, input.lastName, input.birthDate, input.job, input.placeJob, input.salary);
            agregandototable(cliente1);
        });
    })
    .catch(error => {
        console.error('Error al cargar los datos:', error);
    });



//Encontrando DPI del cliente ganador
function compararBudget(a, b) {
    return b.budget - a.budget;
}
function eliminacion(customers, rejection) {
    var container = [];
    customers.forEach(function (elemento) {
        container.push(elemento);
    });
    container.sort(compararBudget);
    container.splice(0, rejection);
    var result = container[0];
    return result;
}



function fetchDataAndRecommend() {
    const filePath = '../../input_auctions.json'; 

    fetch(filePath)
        .then(response => response.json())
        .then(data => {
            data.forEach(function (input) {
                var property = input.property;
                var customers = input.customers;
                var rejection = input.rejection;
                var result = eliminacion(customers, rejection);
                var clienteEncontrado = tablaHash.buscarCliente(result.dpi);
                var firmaDigital = clienteEncontrado.generarFirmaDigital();
                var clienteganador = new Clientefinal(clienteEncontrado === null || clienteEncontrado === void 0 ? void 0 : clienteEncontrado.dpi, clienteEncontrado === null || clienteEncontrado === void 0 ? void 0 : clienteEncontrado.firstName, clienteEncontrado === null || clienteEncontrado === void 0 ? void 0 : clienteEncontrado.lastName, clienteEncontrado === null || clienteEncontrado === void 0 ? void 0 : clienteEncontrado.birthDate, clienteEncontrado === null || clienteEncontrado === void 0 ? void 0 : clienteEncontrado.job, clienteEncontrado === null || clienteEncontrado === void 0 ? void 0 : clienteEncontrado.placeJob, clienteEncontrado === null || clienteEncontrado === void 0 ? void 0 : clienteEncontrado.salary, property, result.budget, firmaDigital);
                const resultadoElement = document.getElementById('resultado');
                resultadoElement.textContent = 'Resultado: ' + clienteganador.join(', ');
            });
        })
        .catch(error => {
            console.error('Error al cargar los datos:', error);
        });
}

fetchDataAndRecommend();
