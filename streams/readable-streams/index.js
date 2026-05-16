import ArrayStream from "./ArrayStream.js"

const rivers = [
    'Nile',
    'Amazon',
    'Yangtze',
    'Mississippi',
    'Yellow River',
    'Ob',
    'Yenisei',
    'Lena',
    'Congo',
    'Mekong',
    'Tárcoles'
]



const riversStream = new ArrayStream(rivers);

// streams usa el evente emitter para emitir los eventos 

riversStream.on("data", chunk => {
    console.log("Reading chunk...");
    console.log({ chunk });
});

riversStream.on("end", () => console.log("stream ended"));
riversStream.on("error", error => console.log("error reading stream ", error));
