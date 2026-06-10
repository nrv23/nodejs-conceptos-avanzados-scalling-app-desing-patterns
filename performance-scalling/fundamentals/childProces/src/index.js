const { fork } = require("node:child_process");
const os = require("node:os");






const processes = os.cpus().map((_, idx) => {
    fork("./src/app.js", ["500" + (idx + 1).toString()])
})

console.log(`FOrked : ${processes.length}  processes`);