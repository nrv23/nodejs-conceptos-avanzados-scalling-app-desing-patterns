import { createServer } from 'node:http';
import { createReadStream } from 'node:stream';

const PORT = process.env.PORT || 5000;

const allowedHeaders = {
    'Access-Control-Allow-Origin': "*",
    'Access-Control-Allow-Methods': "*",
}

async function handleRequest(req, res) {

    if (req.method === "OPTIONS") {
        res.writeHead(204, allowedHeaders);
        res.end();
    }

    createReadStream("./imd_movies.csv", {
        encoding: 'utf-8'
    });

    res.end("solicitud respondida")
};

createServer(handleRequest)
    .listen(PORT, () => {
        console.log("Servidor peticiones en puerto " + PORT);
    });

