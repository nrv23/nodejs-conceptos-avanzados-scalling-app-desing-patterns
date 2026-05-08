/*import { messageService } from "./messageService.js";

messageService.sendMessage("Hello dude :)");
messageService.authenticate();*/

import { messageService } from "./queueMessageService.js";
import { messageService as statefulMessageService } from "./states/statefulMessageService.js";

// state pattern
statefulMessageService.authenticate();
statefulMessageService.sendMessage("First message");
setTimeout(() => {
    statefulMessageService.sendMessage("Second message");
}, 1100);


// comand pattern 
// los mensajes se encolan y cuando autentique reenvia los mensajes encolados
messageService.sendMessage("Hello dude :)");
messageService.sendMessage("Hello dude :)");
messageService.sendMessage("Hello dude :)");
messageService.sendMessage("Hello dude :)");
messageService.sendMessage("Hello dude :)");
messageService.sendMessage("Hello dude :)");
messageService.sendMessage("Hello dude :)");
messageService.sendMessage("Hello dude :)");
messageService.sendMessage("Hello dude :)");


setTimeout(() => {
    messageService.authenticate();

    // Esperar a que realmente esté autenticado
    messageService.once("authenticated", () => {
        messageService.sendMessage("Hello dude :) 1");
    });
}, 1100);

