/*

1. Introducción al patrón Command  
   - El patrón encapsula una petición (como “crear archivo” o “salir”) dentro de un objeto comando con un método `execute()`.  
   - Generalmente hay un “invoker” o un “receiver” que llama a `execute()`.

2. Revisar el código “Antes”  
   - Existe un `invoker` que ejecuta los comandos, y cada comando tiene un método `execute()`.  
   - Pero queremos mejorarlo para que haya un objeto “receiver” separado que llame a `execute()`, en lugar de que el `invoker` lo haga directamente.

3. Código deseado  
   - El nuevo código usa `receiver.run(new Create(...))` o `receiver.run(new Exit())`.  
   - `commands.js` contiene las clases `Create` y `Exit` con un método `execute()`.  
   - `receiver.js` tiene una función `run(command)` que imprime el nombre del comando y luego llama a `command.execute()`.

4. Pasos para implementar  
   1. Crear un nuevo módulo (o renombrar el `invoker`) que actúe como “receiver” y que llame a `command.execute()`.  
   2. Ajustar los comandos (`Create`, `Exit`) para que tengan un `get name()` y un método `execute()`.  
   3. En `index.js`, eliminar el uso del `invoker` y en su lugar importar el nuevo módulo “receiver”.  
   4. Cambiar el switch-case para que llame a `receiver.run(...)` pasando una nueva instancia del comando, por ejemplo `new Create(fileName, fileContent)`.  
   5. Probar escribiendo comandos como `create archivo.txt texto` o `exit` para verificar que todo funcione.

5. Validación  
   - El `receiver` debe imprimir el nombre del comando y ejecutar `.execute()`.  
   - Los comandos deben realizar su tarea (crear archivo o salir).  
   - El resto de la aplicación queda más simple y desacoplada.

*/
