const { BasicSupport, TechnicalSupport, ManagerSupport,  DirectorSupport } = require("./support");

// Create the handlers
const basic = new BasicSupport();
const technical = new TechnicalSupport();
const manager = new ManagerSupport();
const director = new DirectorSupport();

// Set up the chain: Basic -> Technical -> Manager
//basic.setNext(technical).setNext(manager); // esta linea es importante porque permite encadenar los handlers de manera fluida.
// ademas declara el orden jerarquico de los handlers, es decir, el orden en el que se procesaran las solicitudes. 
// Si una solicitud no puede ser manejada por el handler actual, 
// se pasara al siguiente handler en la cadena hasta que se encuentre uno que pueda manejarla o se alcance el final de la cadena.


basic.setNext(technical).setNext(manager).setNext(director); // Agrega un nuevo handler al final de la cadena, en este caso, el DirectorSupport.
// Create some requests
const request1 = { type: "basic" };
const request2 = { type: "technical" };
const request3 = { type: "manager" };
const request5 = { type: "director" };
const request4 = { type: "unknown" };

// Send requests through the chain
basic.handle(request1); // Basic Support will handle this
basic.handle(request2); // Technical Support will handle this
basic.handle(request3); // Manager Support will handle this
basic.handle(request5); // Director Support will handle this
basic.handle(request4); // unknown Support will handle this

