import net from "node:net";
import { Transform, Writable } from "node:stream";

const PORT = 4000;
const HEADER_SIZE = 13;

class FrameParser extends Transform {
    constructor() {
        super({ readableObjectMode: true });
        this.buffer = Buffer.alloc(0);
    }

    _transform(chunk, enc, cb) {
        this.buffer = Buffer.concat([this.buffer, chunk]);

        while (this.buffer.length >= HEADER_SIZE) { // buffer = HEADER + PAYLOAD, el buffer debe tener el size del header o mayor 
            // para poder leerlo y parsear el payload y leer los datos del buffer
            const channelId = this.buffer.readUInt8(0);
            const offset = Number(this.buffer.readBigUInt64BE(1));
            const payloadLength = this.buffer.readUInt32BE(9); // son 4 bytes

            const fullFrameSize = HEADER_SIZE + payloadLength; // son 17 bytes

            /*
                Header= channelId+payloadSize luego y por aparte payload value, este valor lo sumas al header size
                 y ya tienes el frame completo para procesarlo

                 // frame completo
                 ┌──────────┬─────────┬───────────────┬─────────┐
                │channelId │ offset  │payloadLength  │ hello   │
                └──────────┴─────────┴───────────────┴─────────┘

            */

            if (this.buffer.length < fullFrameSize) {
                break; // partial frame and waiting to receive entire frame
            }

            const payloadBuffer = this.buffer.subarray(HEADER_SIZE, fullFrameSize);
            const payload = JSON.parse(payloadBuffer.toString());

            this.push({
                channelId,
                offset,
                payload
            });

            this.buffer = this.buffer.subarray(fullFrameSize);
        }

        cb();
    }
}

function createSlowConsumer(socket) {
    const offsets = new Map();

    return new Writable({
        objectMode: true,
        highWaterMark: 2,

        write(frame, enc, cb) {
            const lastOffset = offsets.get(frame.channelId) ?? -1;

            if (frame.offset !== lastOffset + 1) {
                console.log(
                    `Missing frame on channel ${frame.channelId}. Expected ${lastOffset + 1}, got ${frame.offset}`
                );

                socket.write(JSON.stringify({
                    type: "replay",
                    channelId: frame.channelId,
                    fromOffset: lastOffset + 1
                }));
            }

            offsets.set(frame.channelId, frame.offset);

            console.log(
                `Channel ${frame.channelId} | offset ${frame.offset} | payload:`,
                frame.payload
            );

            setTimeout(cb, 500); // consumidor lento para probar backpressure
        }
    });
}

const socket = net.createConnection({ port: PORT }, () => {
    console.log("Connected to multiplexer server");
});

const parser = new FrameParser();
const consumer = createSlowConsumer(socket);

socket
    .pipe(parser)
    .pipe(consumer);

socket.on("error", err => {
    console.error("Socket error:", err.message);
});