const { cpus } = require("os");
const cluster = require("node:cluster");
const { createServer } = require("node:http");


if (cluster.isPrimary) { // proceso principal

    console.log("primary process is ruuning :", process.pid);
    // fork de un proceso woker
    //setTimeout(() => cluster.fork(), 1000);
    for (let index = 0; index < cpus().length; index++) {
        cluster.fork();

    }
} else {
    /*

        Node hace una magia interna: el primary crea/coordina el socket del servidor 
        y reparte conexiones a los workers.
        Por eso esto no revienta:
        Por eso cada cluster puede usar el mismo puerto. La conexion es compartida

    */

    createServer((req, res) => {
        const message = "Worker process is running " + process.pid;
        console.log(message);
        res.end(message)
    }).listen(3000);


}