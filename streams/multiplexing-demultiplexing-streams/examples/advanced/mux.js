import net from "node:net";
import { Readable } from "node:stream";

const PORT = 4000;
const HEADER_SIZE = 13;

function encodeFrame(channelId, offset, payload) {
    const body = Buffer.from(JSON.stringify(payload));
    const header = Buffer.alloc(HEADER_SIZE);

    header.writeUInt8(channelId, 0);
    header.writeBigUInt64BE(BigInt(offset), 1);
    header.writeUInt32BE(body.length, 9);

    return Buffer.concat([header, body]);
}

function createNumberStream() {
    let n = 0;

    return new Readable({
        objectMode: true,
        read() {
            const interval = setInterval(() => {
                if (n >= 20) {
                    clearInterval(interval);
                    this.push(null);
                    return;
                }

                this.push({ value: n });
                n++;
            }, 100);
        }
    });
}

function createStringStream() {
    const values = ["hello", "node", "tcp", "streams", "multiplexing", "replay"];
    let index = 0;

    return new Readable({
        objectMode: true,
        read() {
            const interval = setInterval(() => {
                if (index >= values.length) {
                    clearInterval(interval);
                    this.push(null);
                    return;
                }

                this.push({ value: values[index] });
                index++;
            }, 180);
        }
    });
}

function createMultiplexer(socket, streams) {
    const offsets = new Map();
    const replayLog = new Map();

    for (const { channelId, stream } of streams) {
        offsets.set(channelId, 0);
        replayLog.set(channelId, []);

        stream.on("data", payload => {
            const offset = offsets.get(channelId);
            const frame = encodeFrame(channelId, offset, payload);

            replayLog.get(channelId).push({ offset, frame });
            offsets.set(channelId, offset + 1);

            const canContinue = socket.write(frame);

            console.log({
                channelId,
                offset,
                payload
            });

            if (!canContinue) {
                console.log("Backpressure detected. Pausing all streams.");

                for (const source of streams) {
                    source.stream.pause();
                }
            }
        });

        stream.on("end", () => {
            console.log(`Channel ${channelId} ended`);
        });
    }

    socket.on("drain", () => {
        console.log("Socket drained. Resuming streams.");

        for (const source of streams) {
            source.stream.resume();
        }
    });

    socket.on("data", raw => {
        const message = raw.toString();

        try {
            const command = JSON.parse(message);

            if (command.type === "replay") {
                const { channelId, fromOffset } = command;

                console.log(`Replay requested. Channel ${channelId} from offset ${fromOffset}`);

                const frames = replayLog
                    .get(channelId)
                    .filter(item => item.offset >= fromOffset);

                for (const item of frames) {
                    const canContinue = socket.write(item.frame);

                    if (!canContinue) {
                        console.log("Backpressure during replay.");
                        break;
                    }
                }
            }
        } catch {
            // Ignorar mensajes no-control.
        }
    });
}

const server = net.createServer(socket => {
    console.log("Client connected");

    const numbers = createNumberStream();
    const strings = createStringStream();

    createMultiplexer(socket, [
        { channelId: 0, stream: numbers },
        { channelId: 1, stream: strings }
    ]);

    socket.on("close", () => {
        console.log("Client disconnected");
    });

    socket.on("error", err => {
        console.error("Socket error:", err.message);
    });
});

server.listen(PORT, () => {
    console.log(`Multiplexer server running on port ${PORT}`);
});