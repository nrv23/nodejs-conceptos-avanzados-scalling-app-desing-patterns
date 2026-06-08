import { createServer } from "net";
import { Writable } from "stream";

/*
demultiplexes the incoming data by reading the headers, determining which destination 
stream to write to, and then writing the data accordingly.
*/

// Function to demultiplex the incoming data

/*

reads the data from the source stream (socket) and reconstructs the original streams.

    Reading the Header:
        Channel ID: Reads 1 byte to determine which destination stream to write to.
        Data Length: Reads 4 bytes to know how much data to read.
    Reading the Data:
        Reads the specified amount of data.
        Writes the data to the corresponding destination stream.
    Loop: Continues reading packets until there's no more data available.

*/

function demultiplexStream(source, destinations) {
    let currentChannel = null;
    let currentLength = null;

    source.on("readable", () => { // readable recibe los datos justo como los envia, data los recibe de manera random
        let chunk;
        while (true) {
            if (currentChannel === null) {
                //Non-Flowing Mode: Reading data explicitly using
                // .read() inside a 'readable' event listener, which gives us control over how much data to read.
                chunk = source.read(1); // Read channel ID in bytes
                if (chunk === null) break;
                currentChannel = chunk.readUInt8(0); // lee el canal
            }

            if (currentLength === null) {
                chunk = source.read(4); // Read data length in bytes
                if (chunk === null) break;
                currentLength = chunk.readUInt32BE(0); // asgina el tamanoo del chunk
            }

            chunk = source.read(currentLength); // Read data of chunk
            if (chunk === null) break;

            // Write data to the appropriate destination stream
            destinations[currentChannel].write(chunk);
            console.log(
                `Received data on channel ${currentChannel}: ${chunk.toString()}`
            );

            // Reset for the next packet
            currentChannel = null;
            currentLength = null;
        }
    });

    source.on("end", () => {
        destinations.forEach((dest) => dest.end());
        console.log("Connection closed.");
    });
}

//  A Writable stream that processes numbers.
const numberStream = new Writable({
    write(chunk, encoding, callback) {
        const number = parseInt(chunk.toString(), 10);
        console.log(`Number received: ${number}`);
        callback();
    },
});

//A Writable stream that processes strings.
const stringStream = new Writable({
    write(chunk, encoding, callback) {
        const message = chunk.toString();
        console.log(`String received: ${message}`);
        callback();
    },
});

// Start TCP server
const server = createServer((socket) => {
    console.log("Client connected.");

    // Demultiplex the incoming stream
    demultiplexStream(socket, [numberStream, stringStream]);

    socket.on("error", (err) => {
        console.error("Socket error:", err);
    });
});

server.listen(5000, () => {
    console.log("Server listening on port 5000.");
});
