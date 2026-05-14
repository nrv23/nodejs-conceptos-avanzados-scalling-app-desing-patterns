const fs = require("fs");
var { promisify } = require("util");
var writeFile = promisify(fs.writeFile);
var unlink = promisify(fs.unlink);
var readdir = promisify(fs.readdir);

var wait = (sec) =>
  new Promise((resolves) => {
    setTimeout(resolves, sec * 1000);
  });
// promise.race devuelve el resutlado de la primer promesa en resolverse o fallar.
Promise.race([wait(4), wait(5), wait(8), wait(1)])
  //.then(() => readdir(__dirname))
  .then(console.log);
// ejecuta todas las promesas al mismo tiempo pero si una falla se termina el proceso.
Promise.all([writeFile("test1.txt", "1"), writeFile("test2.txt", "2"), writeFile("test3.txt", "3")])
  .then(() => readdir(__dirname, { encoding: 'utf-8' }))
  .then(console.log);



