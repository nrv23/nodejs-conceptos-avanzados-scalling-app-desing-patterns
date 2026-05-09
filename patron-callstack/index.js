

function toSecretString(str, cb) {

    process.nextTick(() => { // 1. Pasamos el callback a la cola de nextTick y convierte el metood en asincrono
        if (typeof str != 'string') return cb(new Error("typeError"), null)
        return cb(null, str.replace(/[a-zA-Z]/g, "*"));
    })
}

function delay(seg, callback) {
    setTimeout(callback, seg * 1000);
}

delay(2, () => {
    console.log("delay function is executed");
});

toSecretString(123, (err, data) => {
    if (err) {
        console.error("error", err.message);
        return;
    }
    console.log(data);
});

console.log("End");