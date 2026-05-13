import cluster from "cluster";
import os from "os";
import http from "http";

const totalCPUs = os.cpus().length;

console.log({
    totalCPUs
});

if (cluster.isPrimary) {

    console.log(`Master ${process.pid}`);

    // =========================
    // WORKERS API
    // =========================

    for (let i = 0; i < 1; i++) {

        const apiWorker = cluster.fork({
            WORKER_TYPE: "api"
        });

        apiWorker.on("message", (message) => {

            console.log(
                "Mensaje desde API worker:",
                message
            );
        });
    }

    // =========================
    // WORKERS COUNTER
    // =========================

    for (let i = 0; i < 1; i++) {

        const counterWorker = cluster.fork({
            WORKER_TYPE: "counter"
        });

        // escuchar mensajes IPC
        counterWorker.on("message", (message) => {

            // validamos el tipo de mensaje
            if (message.type === "finish") {

                console.log(
                    "Counter finalizado:"
                );

                console.log(message.data);
            }
        });
    }

    cluster.on("exit", (worker) => {

        console.log(
            `Worker ${worker.process.pid} murió`
        );
    });

} else {

    const type = process.env.WORKER_TYPE;

    // =========================
    // API WORKER
    // =========================

    if (type === "api") {

        const server = http.createServer((req, res) => {

            res.writeHead(200, {
                "Content-Type": "text/plain"
            });

            res.end(
                `Hola desde API worker ${process.pid}`
            );
        });

        server.listen(3000, () => {

            console.log(
                `API worker ${process.pid} escuchando`
            );
        });
    }

    // =========================
    // COUNTER WORKER
    // =========================

    if (type === "counter") {

        console.log(
            `Counter worker ${process.pid} iniciando`
        );

        let count = 0;

        while (count <= 10000) {
            count++;
        }

        // enviamos mensaje IPC al master
        process.send({
            type: "finish",
            data: {
                pid: process.pid,
                count
            }
        });

        process.exit();
    }
}

// los cluster pueden enviar datos entre ellos por medio de variables de entorno. o por medio de eventos IPC

// CLuster API
// son procesos que corren en paralelo y utilizan todos los nucleos de la CPU

// con cluster module se puede escalar una aplicacion de manera horizontal

// Para comunicación entre procesos
//process.send();

// Para recibir mensajes
//process.on("message", (message) => {
//    console.log(message);
//});