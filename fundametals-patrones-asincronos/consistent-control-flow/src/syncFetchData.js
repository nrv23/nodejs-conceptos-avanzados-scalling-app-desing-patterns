// Danger: Sometimes async, sometimes sync
const dataCache = new Map();

export function getValueThatMightBeCachedSync(key, callback) {
  if (!dataCache.has(key)) {
    const fakeData = `Fetched data with key=${key}`;
    dataCache.set(key, fakeData);
  }
  return dataCache.get(key);
}
