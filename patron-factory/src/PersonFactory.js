var Customer = require("./Customer");
var Employee = require("./Employee");

/*

    El patron factory es un patron de diseño creacional 
    que nos permite crear objetos sin exponer la logica 
    de creacion al cliente y referirnos a los objetos 
    creados a traves de una interfaz comun.

    En este ejemplo, tenemos una fabrica de personas
     que puede crear tanto clientes como empleados. 
     La funcion PersonFactory toma el nombre, los fondos, 
     la posicion y el tipo de persona que queremos crear,
     y devuelve una instancia del tipo correspondiente.

*/

const PersonFactory = (name, funds, position, type) => {
    switch (type) {
        case "customer":
            return new Customer(name, funds);
        case "employee":
            return new Employee(name, funds, position);
        default:
            throw new Error("Invalid person type");
    }
}

module.exports = PersonFactory;