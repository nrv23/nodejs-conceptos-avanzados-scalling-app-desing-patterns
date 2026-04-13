const WebSocket = require("ws");

const PORT = 8080;
const server = new WebSocket.Server({ port: PORT });

let clients = [];

server.on("connection", (socket) => {
  console.log("A client connected.");
  clients.push(socket);

  socket.on("message", (message) => {
    // Broadcast the message to all connected clients except the sender
    clients.forEach((client) => {
      if (client !== socket && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  socket.on("close", () => {
    console.log("A client disconnected.");
    clients = clients.filter((client) => client !== socket);
  });
});

console.log(`WebSocket server is listening on ws://localhost:${PORT}`);
