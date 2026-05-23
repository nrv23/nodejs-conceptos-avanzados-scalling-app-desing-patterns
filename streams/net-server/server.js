
import net from 'node:net';


const server = net.createServer(socket => { // socket es un duplex stream o sea puede leer y escribir datos


    socket.on("data", data => {
        console.log("Datos recibidos");
        console.log({ data: data.toString('utf-8') });
    })
    socket.pipe(socket);
});

server.on("connection", client => {
    console.log("Cliente conectado");
})

server.listen(3000, () => console.log("Escuchando en puerto 3000"));