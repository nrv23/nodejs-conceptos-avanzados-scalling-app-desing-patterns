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

    cluster.on("exit", (worker, code, signal) => {
        // worker.id es el numero en orden de creacion
        // worker.process.pid es el numero de proceso a nivel de Sistema operativo
        console.log(`Worker ${worker.id} with pid ${worker.process.pid} died`);
        cluster.fork();
    }); // si un proceso se cae o finaliza
} else {
    /*

        Node hace una magia interna: el primary crea/coordina el socket del servidor 
        y reparte conexiones a los workers.
        Por eso esto no revienta:
        Por eso cada cluster puede usar el mismo puerto. La conexion es compartida

    */

    console.log("starting Worker with processid:" + process.pid);

    createServer((req, res) => {

        if (req.url === "/kill") {

            res.end("killed Worker with processid:" + process.pid)

            process.exit(0);
        } else {
            res.end("Serving request with processid:" + process.pid)
        }

    }).listen(3000);


}