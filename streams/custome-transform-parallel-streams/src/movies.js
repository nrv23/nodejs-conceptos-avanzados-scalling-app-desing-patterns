import { pipeline } from "node:stream";
import { ConcurrentStream } from "./concurrentStream.js";
import { createReadStream, createWriteStream } from "node:fs";
import split from 'split';


pipeline(
    createReadStream('./movies.csv'),
    split(),
    new ConcurrentStream(async (chunk, enc, push, callback) => {

        if (!chunk.trim()) {
            return callback();
        }

        try {

            const [title, rating, poster] = chunk.split(',');
            const ratingFloat = parseFloat(rating);

            if (ratingFloat >= 5) {
                // publica el chunk para el consumer
                push(`The title ${title}, rating ${ratingFloat} , poster url ${poster} \n`);
            }

        } catch (error) {
            console.log("Error procesing chunk...", chunk, error);
            callback(error, null);
        }

        callback();
    }),
    createWriteStream('./filteredMovies.txt'),
    (err) => {
        if (err) {
            console.log('Pipeline error ', err);
            process.exit(0);
        }

        console.log('All movies was proccesed')
    }
)