// Danger: Sometimes async, sometimes sync
const dataCache = new Map();

export function getValueThatMightBeCachedAsync(key, callback) {
  if (dataCache.has(key)) {
    // Synchronous path
    // 3 formas de ejecutar el callback de forma asincrona
    process.nextTick(() => callback(dataCache.get(key)));
    //Promise.resolve().then(() => callback(dataCache.get(key)));
    //queueMicrotask(() => callback(dataCache.get(key)));
    // En este caso de uso el control flow es sincrono porque los callback se ejecutan de forma inmediata sin esperar los 500 ms
  } else {
    // Asynchronous path
    setTimeout(() => {
      const fakeData = `Fetched data with key=${key}`;
      dataCache.set(key, fakeData);
      callback(fakeData);
    }, 500);
  }
}
