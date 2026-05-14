// Danger: Sometimes async, sometimes sync
const dataCache = new Map();

export function getValueThatMightBeCached(key, callback) {
  if (dataCache.has(key)) {
    // Synchronous path
    callback(dataCache.get(key)); // por ser sincrono, sejecuta primero que el evento onready por eso no se ve en el log
  } else {
    // Asynchronous path
    setTimeout(() => {
      const fakeData = `Fetched data with key=${key}`;
      dataCache.set(key, fakeData);
      callback(fakeData);
    }, 500);
  }
}
