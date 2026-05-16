
import { Readable } from 'stream';

class ArrayStream extends Readable { // se debe sobreescribir la funcion _read de Readable
    #array;
    #index;
    constructor(array) {
        //super(); // esto inicializa el readable stream, modo por default es binary mode
        // stream por defecto usan el binary mode, o sea el buffer.
        // pero se puede cambiar a object mode donde se puede ver la informacion legible.
        /*super({
            encoding: 'utf-8' // modo legible
        });
        */
        super({
            objectMode: true
        })
        this.#array = array;
        this.#index = 0;
    }

    _read() {
        if (this.#index < this.#array.length) { // seguir leyendo datos
            // const chunk = this.#array[this.#index];
            const chunk = { // modo object mode
                data: this.#array[this.#index],
                index: this.#index
            }
            //this.push(chunk, 'utf-8'); // se agrega una parte de los datos al stream para que lea pedazo a pedazo
            this.push(chunk); // object mode
            this.#index++;
        } else { // aqui ya no hay mas que leer
            this.push(null);
        }
    }
}

export default ArrayStream;