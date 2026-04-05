const fs = require("fs");
const path = require("path");
const FS_Proxy = require('./clasess/FS_Proxy');

const txtFilePath = path.join(__dirname, '/data/', "testFile.txt");
const jsonFilePath = path.join(__dirname, '/data/',"testFile.json");

const proxy = new FS_Proxy(txtFilePath);


// Intentamos leer un archivo .txt, lo cual debería funcionar correctamente
proxy.readFile(txtFilePath, 'utf8', (err, data) => { // retorna un call back con el error o el contenido del archivo 
  if(err) console.error("Error reading .txt file:", err);
  else console.log("Content of .txt file:", data);
});
  

// Intentamos leer un archivo .json, lo cual debería generar un error porque el proxy solo permite archivos .txt
proxy.readFile(jsonFilePath, 'utf8', (err, data) => { // retorna un call back con el error o el contenido del archivo 
  if(err) console.error("Error reading .json file:", err);
  else console.log("Content of .json file:", data);
});