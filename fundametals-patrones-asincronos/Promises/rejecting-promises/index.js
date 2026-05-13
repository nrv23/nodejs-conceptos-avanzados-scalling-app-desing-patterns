

var wait = sec =>
    new Promise((resolve, reject) => {
        if (!sec || +sec === 0 || typeof sec !== "number") return reject("sec is not valid");
        setTimeout(() => {
            return resolve('1 second');
        }, sec);
    });

var waitCallback = (sec, callback) => setTimeout(callback, sec);

// versiones legacy no permite awaiting fuera de una funcion async
wait("1")
    .then(data => data)
    .then(console.log)
    .then(() => console.log("Promise then legacy mode"))
    .catch(console.log); // atrapa el error
console.log("Primer tick ejecutado");