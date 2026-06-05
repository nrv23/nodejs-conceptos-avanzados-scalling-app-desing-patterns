import combine from 'stream-combiner2';
import { createCsvParserStream } from './CsvParserStream.js';
import { createJsonTransformerStream } from './JsonTransfomerStream.js'
import { createDataFilterStream } from './DataFIlterStream.js';


export function createCombinedStream(criteria) {
    return combine(createCsvParserStream(), createDataFilterStream(criteria), createJsonTransformerStream())
}