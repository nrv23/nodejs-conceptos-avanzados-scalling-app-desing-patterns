import csv from 'csv-parser';


export function createCsvParserStream() {

    return csv();
}