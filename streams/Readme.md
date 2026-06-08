# Multiplexing y Demultiplexing Streams

## Multiplexing (MUX)

El multiplexing es una técnica que permite transportar múltiples flujos lógicos a través de un único canal físico. Cada mensaje o chunk enviado incluye una etiqueta que identifica a qué flujo pertenece.

### Flujo

```text
Chat --------\
Video --------> Multiplexer ---> Canal único
Audio -------/
```

### Ejemplo

```js
{
    channel: "chat",
    payload: "Hola"
}

{
    channel: "video",
    payload: videoChunk
}
```

### Objetivo

* Compartir una única conexión.
* Reducir el número de canales físicos.
* Mantener la identidad de cada flujo mediante etiquetas.

---

## Demultiplexing (DEMUX)

El demultiplexing es el proceso inverso al multiplexing. Consiste en recibir un flujo combinado y separar cada mensaje según su etiqueta para enviarlo al consumidor correcto.

### Flujo

```text
Canal único ---> Demultiplexer
                     |
        +------------+------------+
        |            |            |
      Chat        Video        Audio
```

### Ejemplo

```js
switch(packet.channel) {

    case "chat":
        chatStream.write(packet.payload);
        break;

    case "video":
        videoStream.write(packet.payload);
        break;

    case "audio":
        audioStream.write(packet.payload);
        break;
}
```

### Objetivo

* Reconstruir los flujos originales.
* Redirigir cada mensaje a su consumidor correspondiente.
* Permitir múltiples canales lógicos sobre una sola conexión.

---

## Diferencia con Merge Streams

### Merge

Combina varios streams en uno solo.

```text
Stream A
      \
       \
        ---> Output
       /
      /
Stream B
```

Los datos se mezclan y normalmente se pierde la identidad de origen.

### Multiplexing

Combina varios streams en uno solo, pero conserva la identidad mediante etiquetas.

```text
[A] dato1
[B] dato2
[A] dato3
```

Posteriormente un Demultiplexer puede reconstruir los canales originales.

---

## Problemas Potenciales

Si un canal produce demasiados datos (por ejemplo, video o archivos grandes), puede monopolizar el canal compartido y retrasar los demás flujos.

Ejemplo:

```text
Video: 100000 chunks
Chat:  2 mensajes
```

Sin control de flujo:

```text
Video1
Video2
Video3
...
Video100000
Chat1
```

El mensaje de chat deberá esperar.

---

## Soluciones Comunes

Los multiplexadores modernos suelen implementar:

* Colas por canal.
* Prioridades.
* Round Robin.
* Control de flujo.
* Backpressure.
* Cuotas de ancho de banda.

Ejemplo:

```text
Video1
Chat1
Video2
Notification1
Video3
Chat2
```

De esta forma ningún flujo monopoliza la conexión.

---

## Casos de Uso

### HTTP/2

Multiplexa múltiples peticiones y respuestas sobre una única conexión TCP.

### WebSockets

Permite transportar varios canales lógicos:

```text
chat
notifications
presence
events
```

sobre un único socket.

### gRPC

Utiliza multiplexing sobre HTTP/2 para ejecutar múltiples RPC simultáneamente.

### Streaming Multimedia

Transporta audio, video y subtítulos utilizando un único canal de comunicación.

---

## Resumen

### Multiplexing

```text
N canales lógicos
        ↓
     1 canal físico
```

Combina múltiples flujos conservando su identidad mediante etiquetas.

### Demultiplexing

```text
1 canal físico
        ↓
N canales lógicos
```

Lee las etiquetas y reconstruye los flujos originales.
