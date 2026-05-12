
import { getValueThatMightBeCachedAsync } from "./asyncFetchData.js";
import { getValueThatMightBeCached } from "./fetchData.js";


function createDataWatcher(key) {
  let watchers = [];

  // This tries to get data, but might be async or sync depending on `key` usage
  getValueThatMightBeCachedAsync(key, (result) => {
    // result es el valor que se obtiene de getValueThatMightBeCached
    // la funcion se ejecuta pero esper los 500 ms del metodo interno para respoder
    // luego de recibir el valor se recorre el array de watchers y se ejecuta cada funcion
    console.log({ result })
    watchers.forEach((fn) => fn(result)); // fn es la funcion que se pasa como argumento por el usuario
  });

  return {
    onReady: (fn) => { // fn es la funcion que se pasa como argumento por el usuario
      console.log("Watcher ready", fn);
      watchers.push(fn) // guardamos la funcion en el array watchers
    },
  };
}

// Example usage
const watcher1 = createDataWatcher("myKey");
watcher1.onReady((data) => {
  // data es el valor que recibe de getValueThatMightBeCached.
  // esta funcion declarada se guarda en el array watchers para que luego se ejecute con el callback degetValueThatMightBeCached
  console.log("1. watcher ready " + data);
  const watcher2 = createDataWatcher("myKey");
  watcher2.onReady((data) => {
    console.log("2. watcher ready " + data);
  });
});
