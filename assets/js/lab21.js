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
var Conjunto = /** @class */ (function () {
    function Conjunto(data) {
        this.address = data.address;
        this.price = data.price;
        this.contactPhone = data.contactPhone;
        this.id = data.id;
    }
    return Conjunto;
}());
var House = /** @class */ (function (_super) {
    __extends(House, _super);
    function House(data) {
        var _this = _super.call(this, data) || this;
        _this.zoneDangerous = data.zoneDangerous;
        return _this;
    }
    return House;
}(Conjunto));
var Apartments = /** @class */ (function (_super) {
    __extends(Apartments, _super);
    function Apartments(data) {
        var _this = _super.call(this, data) || this;
        _this.isPetFriendly = data.isPetFriendly;
        return _this;
    }
    return Apartments;
}(Conjunto));
var Premises = /** @class */ (function (_super) {
    __extends(Premises, _super);
    function Premises(data) {
        var _this = _super.call(this, data) || this;
        _this.commercialActivities = data.commercialActivities;
        return _this;
    }
    return Premises;
}(Conjunto));
function filterHouses(houses, clientRequirements) {
    var filteredBuildings = [];
    var base = [];
    houses.forEach(function (house) {
        var newhouses = new House(house);
        var colores = ['Red', 'Orange', 'Yellow', 'Green'];
        colores = colores.slice(0, colores.indexOf(clientRequirements.minDanger) + 1);
        var value = colores.indexOf(house.zoneDangerous);
        if (colores.indexOf(house.zoneDangerous) !== -1 && house.price <= clientRequirements.budget) {
            base.push(house);
        }
    });
    base.forEach(function (a) {
        var final = {
            id: a.id,
            price: a.price
        };
        filteredBuildings.push(final);
    });
    return filteredBuildings;
}
function filterApartments(apartments, clientRequirements) {
    var filteredBuildings = [];
    var base = [];

    apartments.forEach(function (apartment) {
        var newapartment = new Apartments(apartment);

        if (newapartment.isPetFriendly === clientRequirements.wannaPetFriendly) {
            if (newapartment.price <= clientRequirements.budget) {
                base.push(newapartment);
            }
        }
    });
    base.forEach(function (a) {
        var final = {
            id: a.id,
            price: a.price
        };
        filteredBuildings.push(final);
    });
    
    return filteredBuildings;
}
function filterPremises(premises, clientRequirements) {
    var filteredBuildings = [];
    var base = [];
    premises.forEach(function (premise) {
        var newpremises = new Premises(premise);
        newpremises.commercialActivities.forEach(function (clave) {
            if (clave === clientRequirements.commercialActivity) {
                if (newpremises.price <= clientRequirements.budget)
                    base.push(newpremises);
            }
        });
    });
    base.forEach(function (a) {
        var final = {
            id: a.id,
            price: a.price
        };
        filteredBuildings.push(final);
    });
    return filteredBuildings;
}
function recommendBuildings(input1, input2) {
    let recommendedBuildings = [];
    let temp = [];
    const clientRequirements = input2;
    if (clientRequirements.typeBuilder === "Houses") {
        input1.forEach(function (obj) {
            if (clientRequirements.typeBuilder === "Houses" && obj.builds && obj.builds.Houses) {
                temp = filterHouses(obj.builds.Houses, clientRequirements);
                recommendedBuildings = recommendedBuildings.concat(temp);
            }
        });
    }
    else if (clientRequirements.typeBuilder === "Apartments") {
        input1.forEach(function (obj) {
            if (clientRequirements.typeBuilder === "Apartments" && obj.builds && obj.builds.Apartments) {

                temp = filterApartments(obj.builds.Apartments, clientRequirements);
                recommendedBuildings = recommendedBuildings.concat(temp);
            }
        });
    }
    else if (clientRequirements.typeBuilder === "Premises") {
        input1.forEach(function (obj) {
            if (clientRequirements.typeBuilder === "Premises" && obj.builds && obj.builds.Premises) {
                temp = filterPremises(obj.builds.Premises, clientRequirements);
                recommendedBuildings = recommendedBuildings.concat(temp);
            }
        });
    }
    recommendedBuildings.sort(function (a, b) { return b.price - a.price; });
    var recommendedIds = recommendedBuildings.map(function (building) { return building.id; });

    return recommendedIds;

}




function fetchDataAndRecommend() {
    const filePath = '../../data.json'; 

    fetch(filePath)
        .then(response => response.json())
        .then(data => {
            data.forEach(function(input) {
                const input1 = input.input1;
                const input2 = input.input2;
                const result = recommendBuildings(input1, input2);
                const resultadofinal =result[0];
                
                const resultadoElement = document.getElementById('resultado');
                const enlaceRecomendacion = document.getElementById('enlace-recomendacion')
                if(result.length > 0){
                    resultadoElement.textContent = 'Resultado: ' + resultadofinal;
                    enlaceRecomendacion.textContent = 'Ir a subasta'
                    enlaceRecomendacion.href = 'formulario2.html'
                }else{
                    resultadoElement.textContent = 'No se encontro una construccion segun tu preferencia';
                    enlaceRecomendacion.textContent = 'Volver'
                    enlaceRecomendacion.href = 'formulario1.html'
                }
            });
        })
        .catch(error => {
            console.error('Error al cargar los datos:', error);
        });
}

fetchDataAndRecommend();


