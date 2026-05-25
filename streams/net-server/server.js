
import { randomUUID } from 'node:crypto';
import net from 'node:net';
import { Writable } from 'node:stream';

const clients = new Map(); // map funciona como una estructura tipo diccionary en C#

const broadcastToClients = (senderSocketId, data) => {
    [...clients.values()]
        .filter(clientSocket => clientSocket.id !== senderSocketId)
        .forEach(clientSocket => clientSocket.write(data));
}

const broadcastViaStream = socket => {
    return Writable({ // custome writable stream
        write(chunk, enc, cb) {
            const data = JSON.stringify({
                message: chunk.toString(),
                connectionId: socket.id
            })
            broadcastToClients(socket.id, data)
            cb(null, chunk);
        }
    })
}

const server = net.createServer(socket => { // socket es un duplex stream o sea puede leer y escribir datos
    // aqui recibe datos
    socket.on("data", data => {
        console.log("Datos recibidos");
        console.log({ data: data.toString('utf-8') });
    })
    socket.pipe(broadcastViaStream(socket));
});

server.on("connection", socket => {

    socket.id = randomUUID();
    console.log(`Cliente conectado con ID: ${socket.id}`);

    clients.set(socket.id, socket);

    // devolver una respuesta usando streams por medio del socket 

    socket.write(JSON.stringify({
        connectionId: socket.id
    }));
    // 

    server.on("close", _ => {
        console.log(`Connecion ${socket.id} is closed`);
        clients.delete(socket.id); // elimina el socket client del map
    })
})

server.listen(3000, () => console.log("Escuchando en puerto 3000"));