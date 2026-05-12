class EmisorDeEventos {
    constructor() {
        // Aquí guardaremos los eventos y sus funciones asociadas
        this.eventos = {};
    }

    // Método para SUSCRIBIRSE a un evento (on)
    on(nombreEvento, callback) {
        if (!this.eventos[nombreEvento]) {
            this.eventos[nombreEvento] = []; // Si no existe el evento, creamos el arreglo
        }
        this.eventos[nombreEvento].push(callback); // Guardamos la función
    }

    // Método para DISPARAR un evento (emit)
    emit(nombreEvento, datos) {
        const callbacks = this.eventos[nombreEvento];
        if (callbacks) {
            callbacks.forEach(callback => callback(datos)); // Ejecutamos todas las funciones suscritas
        }
    }
}

// --- USO DEL PATRÓN ---

const timbre = new EmisorDeEventos();

// 1. Suscribimos reacciones al evento 'tocarTimbre'
timbre.on('tocarTimbre', (datos) => {
    console.log(`🐶 El perro ladra porque llegó: ${datos}`);
});

timbre.on('tocarTimbre', (datos) => {
    console.log(`🚪 El dueño abre la puerta para: ${datos}`);
});

// 2. El programa sigue su curso
console.log("La casa está en silencio...");

// 3. ¡Disparamos el evento! (Alguien tocó el timbre)
console.log("¡Toc, toc!");
timbre.emit('tocarTimbre', 'El cartero');