import { searchRecordsInCsv } from "./readCSV.js";

searchRecordsInCsv(["./src/customers.csv", "./src/sales_data.csv"], "Alice")
  .on("fileRead", (fileName) => {
    console.log(`Done reading: ${fileName}`);
  })
  .on("recordFound", (file, row) => {
    console.log(`Found a match in ${file}:`, row);
  })
  .on("error", (err) => {
    console.error("An error occurred:", err.message);
  });
