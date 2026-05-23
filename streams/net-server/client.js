
import net from 'node:net';

process.stdin.pipe(net.connect(3000)).pipe(process.stdout); // lo que escribo en consola se envia por el socket al servidor y el servidor recibe 
// y devuelve lo que le voy enviando