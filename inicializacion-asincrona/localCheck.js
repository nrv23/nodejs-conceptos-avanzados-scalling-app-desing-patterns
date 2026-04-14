// once() es una utilidad de Node.js que convierte un evento de EventEmitter en una Promise.
// Permite usar async/await para esperar que un evento ocurra, sin bloquear el Event Loop.
import { once } from "events";
import { messageService } from "./messageService.js";

// Disparamos la autenticación de inmediato.
// Esto arranca el proceso (simulado con setTimeout internamente),
// pero NO espera a que termine — regresa al instante y Node sigue ejecutando.
messageService.authenticate();

async function notifyUser() {
    // Verificamos si la autenticación ya completó.
    // Puede pasar si authenticate() terminó antes de que llegáramos aquí.
    if (!messageService.authenticated) {
        // Si aún no está autenticado, nos quedamos "escuchando" el evento "authenticated".
        // once() registra un listener en el EventEmitter de messageService y devuelve una Promise.
        // El await suspende SOLO esta función — Node sigue libre para procesar otras cosas
        // (como el setTimeout de authenticate() que está corriendo en background).
        // Cuando authenticate() llame a this.emit("authenticated"), esta Promise se resuelve
        // y la función se reanuda desde aquí.
        await once(messageService, "authenticated");
    }

    // En este punto tenemos garantía de que authenticated === true,
    // ya sea porque ya estaba listo, o porque esperamos el evento.
    await messageService.sendMessage("Hello dude :)");
}

// Llamamos a notifyUser sin await en el nivel superior.
// Node ejecuta la función de forma asíncrona y sigue con el Event Loop.
notifyUser();
