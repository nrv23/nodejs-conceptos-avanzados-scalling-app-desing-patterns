import { once } from "events";
import { messageService } from "./messageService.js";


async function init() {

    messageService.authenticate(); // 1. Inicia la autenticación
    await once(messageService, "authenticated"); // 2. Espera a que termine

}


async function notifyUser() {
    await messageService.sendMessage("Hello dude :)"); // 3. Envía el mensaje
}

//await init(); // 4. Espera a que termine init()
// await sin async solo en nuevas versiones de node (v22+)

init()
    .then(async () => {
        await notifyUser();
    })
    .catch(console.log);