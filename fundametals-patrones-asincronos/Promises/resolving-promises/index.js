

var wait = sec =>

    new Promise((resolve, _) => {
        setTimeout(() => {
            return resolve('1 second');
        }, sec);
    });

var waitCallback = (sec, callback) => setTimeout(callback, sec);

// versiones legacy no permite awaiting fuera de una funcion async
wait(1)
    .then(data => data)
    .then(console.log)
    .then(() => console.log("Promise then legacy mode"))
// nuevas versiones de nodejs 
waitCallback(2000, () => console.log("2 seconds of delay"));
console.log(await wait(1));
console.log("Primer tick ejecutado");