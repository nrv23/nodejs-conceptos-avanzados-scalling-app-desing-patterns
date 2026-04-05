/**
 ** ~~~~~~~~~~~~~~~~ HOMEWORK STEPS FOR THE PROXY PATTERN IN NODE.JS ~~~~~~~~~~~~~~~~

1. Intro to the Proxy Pattern  
   - A Proxy class stands in for the real object (`fs` in this case), controlling or modifying how methods work.

2. Study the “Before” Code 
   - `index.js` uses `fs.readFile` on `.txt` and `.json`.  
   - We want a Proxy to limit reading to `.txt` only.

3. Plan the Proxy 
   - Make a `FS_Proxy.js` (or similar) that wraps `fs`.  
   - `readFile(path, format, cb)`: check if `path` ends with `.txt`; if not, `cb` an error.

4. Implement 
   - In `index.js`, require your Proxy, passing the real `fs` to its constructor.  
   - Replace direct calls to `fs.readFile` with calls to the Proxy.  
   - Leave most of `index.js` unchanged, just reference your `new FS_Proxy(require("fs"))`.

5. Test 
   - Try reading `.txt` and `.json`. `.json` should now be blocked.  
   - Confirm the `.txt` read still works.

 */
