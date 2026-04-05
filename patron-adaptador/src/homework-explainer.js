/**
 * ~~~~~~~~~~~~~~~~ HOMEWORK STEPS FOR ADAPTER PATTERN ~~~~~~~~~~~~~~~~
 *
 * 1) Understand the old code that directly calls localStorage:
 *    - The existing index.js references localStorage length, getItem, and setItem.
 *    - It's using localStorage as if it were the browser's localStorage.
 *
 * 2) Create a new localStorage adapter (a .js file) that uses Node’s fs module:
 *    - This file-based adapter should have:
 *      - A "length" property (returning how many items are stored).
 *      - A "getItem(key)" method to fetch a value from a JSON file or an in-memory object.
 *      - A "setItem(key, value)" method to update the in-memory object and persist it to a JSON file.
 *
 * 3) In your adapter:
 *    - Read or create a JSON file on startup to populate an internal items = {} object.
 *    - For .length, return Object.keys(items).length.
 *    - For setItem, after assigning items[key] = value, write the updated items back to the file.
 *    - For getItem, return items[key] or null if missing.
 *
 * 4) Replace the old usage in index.js:
 *    - Instead of referencing the original localStorage, require/import your new module (e.g. `require("./localStorage")`).
 *    - Keep the original calls in index.js (like localStorage.length, getItem, setItem) the same. The adapter ensures the behavior is preserved.
 *
 * 5) Test:
 *    - Run your updated index.js.
 *    - Confirm it reads from a JSON file if it exists, or creates one if not.
 *    - Confirm length, getItem, and setItem work as expected.
 *
 * 6) This is the essence of the Adapter Pattern:
 *    - We do not change the client code (index.js) that calls localStorage.
 *    - We simply adapt it under the hood to Node’s fs system via our module.
 *
 * ------------------------------------------------------------
 */
