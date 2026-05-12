import CsvSearcher from "./readCSV.class.js";
import { searchRecordsInCsv } from "./readCSV.js";


// el metodo retorna un eventemmiter, el cual podemos suscribirnos para recibir eventos
// .on es un metodo del event emmiter
// .emit es un metodo del event emmiter
// .once es un metodo del event emmiter
// .off es un metodo del event emmiter
// .removeListener es un metodo del event emmiter
// .removeAllListeners es un metodo del event emmiter
// .listenerCount es un metodo del event emmiter
// .listeners es un metodo del event emmiter

const term = "Alice";
const csvSearcher = new CsvSearcher(term);
csvSearcher
  .addFile(["customers.csv", "sales_data.csv"])
  .search()
  // agrego aqui los eventos
  .on("fileRead", (fileName) => {
    console.log(`Done reading: ${fileName}`);
  })
  .on("recordFound", (file, row) => {
    console.log(`Found a match in ${file}:`, row);
  })
  .on("error", (err) => {
    console.error("An error occurred:", err.message);
  });


// ===== CUANDO TODO TERMINA =====
reader.once("finish", () => {
  console.log("All files processed");
  // cleanup listeners
  reader.off("fileRead", onFileRead);
  reader.off("recordFound", onRecordFound);
  reader.off("error", onError);
  console.log("Listeners removed");
});



/*searchRecordsInCsv(["customers.csv", "sales_data.csv"], "Alice")
  .on("fileRead", (fileName) => {
    console.log(`Done reading: ${fileName}`);
  })
  .on("recordFound", (file, row) => {
    console.log(`Found a match in ${file}:`, row);
  })
  .on("error", (err) => {
    console.error("An error occurred:", err.message);
  });
*/