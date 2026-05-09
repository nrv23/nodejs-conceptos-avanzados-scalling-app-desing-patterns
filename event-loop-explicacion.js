// ============================================================================
//  EVENT LOOP, CALL STACK, HEAP Y MÁS — EXPLICACIÓN CON EJEMPLOS
//  Ejecutá este archivo con: node event-loop-explicacion.js
// ============================================================================


// ╔══════════════════════════════════════════════════════════════════════════╗
// ║  1. ¿QUÉ ES EL CALL STACK? (Pila de llamadas)                         ║
// ╚══════════════════════════════════════════════════════════════════════════╝
//
//  El Call Stack es una ESTRUCTURA DE DATOS tipo PILA (LIFO - Last In First Out)
//  donde JavaScript lleva el registro de qué función se está ejecutando
//  en este momento y cuáles están esperando.
//
//  Imaginátelo como una PILA DE PLATOS:
//    - Cuando llamás una función → se AGREGA un plato arriba (push)
//    - Cuando la función termina → se QUITA el plato de arriba (pop)
//    - Solo se puede trabajar con el plato de ARRIBA (la función actual)
//
//  JavaScript es SINGLE-THREADED, o sea, solo tiene UN call stack.
//  Solo puede hacer UNA cosa a la vez.

// las funciones que retornan callback no son asincronas son sincronas, solo que retornan un callback.
// Para que un callback sea asincrono se necesita pasarselo a una funcion asincrona como setTimeout, setInterval, fs.readFile, etc.
// o usar process.nextTick, o Promise.resolve().then().


function ejemplo1_callStack() {
  console.log('\n=== EJEMPLO 1: CALL STACK ===\n');

  function tercera() {
    console.log('3️⃣  Ejecutando tercera() — está en el TOPE del stack');
    // Cuando termina, se quita del stack
  }

  function segunda() {
    console.log('2️⃣  Ejecutando segunda() — llama a tercera()');
    tercera();
    console.log('2️⃣  tercera() ya terminó, segunda() vuelve al tope');
  }

  function primera() {
    console.log('1️⃣  Ejecutando primera() — llama a segunda()');
    segunda();
    console.log('1️⃣  segunda() ya terminó, primera() vuelve al tope');
  }

  primera();

  // ─────────────────────────────────────────────────────────────
  // ¿CÓMO SE ENCOLAN Y BORRAN LOS MÉTODOS EN EL CALL STACK?
  // ─────────────────────────────────────────────────────────────
  // El Call Stack se ve así paso a paso (PUSH para encolar, POP para borrar):
  //
  //  Paso 1:  | primera()  |   ← PUSH: primera() se apila (encola) en el stack
  //
  //  Paso 2:  | segunda()  |   ← PUSH: primera() llama a segunda(), se apila ENCIMA
  //           | primera()  |
  //
  //  Paso 3:  | tercera()  |   ← PUSH: segunda() llama a tercera(), se apila ENCIMA
  //           | segunda()  |
  //           | primera()  |   (En este punto el Call Stack tiene 3 métodos acumulados)
  //
  //  Paso 4:  | segunda()  |   ← POP: tercera() TERMINÓ, se borra (desapila) del stack
  //           | primera()  |
  //
  //  Paso 5:  | primera()  |   ← POP: segunda() TERMINÓ, se borra del stack
  //
  //  Paso 6:  |  (vacío)   |   ← POP: primera() TERMINÓ, el stack queda vacío
}


// ╔══════════════════════════════════════════════════════════════════════════╗
// ║  2. ¿QUÉ ES EL HEAP? (Montículo de memoria)                           ║
// ╚══════════════════════════════════════════════════════════════════════════╝
//
//  El Heap es un área de memoria NO ESTRUCTURADA donde se almacenan
//  los OBJETOS y DATOS complejos.
//
//  - Las variables PRIMITIVAS (number, string, boolean) → van al STACK
//  - Los OBJETOS, arrays, funciones → van al HEAP
//  - En el stack solo se guarda una REFERENCIA (puntero) al objeto en el heap
//
//  Pensá en el Heap como un BODEGA GRANDE desordenada donde se guardan
//  las cajas (objetos), y en el stack solo tenés una ETIQUETA que dice
//  "tu caja está en la posición X de la bodega".

function ejemplo2_heap() {
  console.log('\n=== EJEMPLO 2: HEAP ===\n');

  // 'nombre' es un primitivo → se guarda directo en el stack
  const nombre = 'Carlos';

  // 'usuario' es un objeto → el OBJETO se guarda en el HEAP
  // y en el stack solo se guarda la REFERENCIA (dirección de memoria)
  const usuario = { nombre: 'Carlos', edad: 25 };

  // 'lista' es un array (objeto) → también va al HEAP
  const lista = [1, 2, 3, 4, 5];

  //  STACK (referencias)          HEAP (objetos reales)
  //  ┌──────────────────┐         ┌─────────────────────────────┐
  //  │ nombre = 'Carlos'│         │ { nombre: 'Carlos', edad: 25}│ ← usuario apunta acá
  //  │ usuario = 0xABC  │────────>│                              │
  //  │ lista   = 0xDEF  │────┐    └─────────────────────────────┘
  //  └──────────────────┘    │    ┌─────────────────────────────┐
  //                          └───>│ [1, 2, 3, 4, 5]             │ ← lista apunta acá
  //                               └─────────────────────────────┘

  // Por eso cuando hacés esto:
  const otroUsuario = usuario;
  otroUsuario.edad = 30;

  // ¡AMBOS cambian! Porque apuntan al MISMO objeto en el heap
  console.log(`usuario.edad = ${usuario.edad}`);         // 30
  console.log(`otroUsuario.edad = ${otroUsuario.edad}`);  // 30
  console.log('👆 Ambos apuntan al mismo objeto en el Heap\n');
}


// ╔══════════════════════════════════════════════════════════════════════════╗
// ║  3. ¿QUÉ ES EL EVENT LOOP? (Bucle de eventos)                         ║
// ╚══════════════════════════════════════════════════════════════════════════╝
//
//  El Event Loop es el MECANISMO que permite a JavaScript (siendo
//  single-threaded) manejar operaciones ASÍNCRONAS sin bloquearse.
//
//  ANALOGÍA DEL RESTAURANTE:
//    - El MESERO es el Call Stack (solo puede atender UNA mesa a la vez)
//    - La COCINA son las Web APIs / libuv (trabajan en segundo plano)
//    - La BARRA DE PEDIDOS LISTOS es la Callback Queue
//    - El EVENT LOOP es el mesero mirando si hay pedidos listos cuando
//      ya no tiene mesas que atender
//
//  FLUJO:
//    1. El código síncrono se ejecuta en el Call Stack
//    2. Las operaciones async (setTimeout, fetch, fs.readFile) se
//       DELEGAN a las APIs del sistema operativo (cocina)
//    3. Cuando terminan, su callback se pone en una COLA (queue)
//    4. El Event Loop revisa: "¿El call stack está vacío?"
//       - SI → toma el primer callback de la cola y lo pone en el stack
//       - NO → espera a que se vacíe
//
//  DIAGRAMA SIMPLIFICADO:
//
//    ┌─────────────────┐
//    │   CALL STACK     │  ← Código ejecutándose AHORA
//    │   (una sola      │
//    │    cosa a la vez)│
//    └────────┬─────────┘
//             │
//             │ ¿Operación async?
//             ▼ SI → se delega
//    ┌─────────────────┐
//    │  Web APIs /      │  ← Temporizadores, I/O, network
//    │  libuv (Node.js) │     trabajan en OTRO hilo
//    └────────┬─────────┘
//             │
//             │ Cuando termina
//             ▼
//    ┌─────────────────┐
//    │  CALLBACK QUEUE  │  ← Callbacks esperando turno
//    │  (Task Queue)    │
//    └────────┬─────────┘
//             │
//             │ Event Loop: "¿Stack vacío?"
//             ▼ SI → mueve callback al stack
//    ┌─────────────────┐
//    │   CALL STACK     │  ← Ahora ejecuta el callback
//    └─────────────────┘

function ejemplo3_eventLoop() {
  console.log('\n=== EJEMPLO 3: EVENT LOOP ===\n');

  console.log('1️⃣  Primero — soy código SÍNCRONO (voy directo al stack)');

  setTimeout(() => {
    console.log('3️⃣  Tercero — soy un callback de setTimeout');
    console.log('   (Esperé a que el stack se vaciara, aunque el delay sea 0ms)');
  }, 0);

  console.log('2️⃣  Segundo — también soy SÍNCRONO');

  // SALIDA:
  //   1️⃣  Primero
  //   2️⃣  Segundo
  //   3️⃣  Tercero   ← ¡AUNQUE setTimeout tiene 0ms, va DESPUÉS!
  //
  // ¿Por qué? Porque setTimeout SIEMPRE pasa por la cola.
  // El event loop solo lo ejecuta cuando el stack está vacío.
}


// ╔══════════════════════════════════════════════════════════════════════════╗
// ║  4. OPERACIONES "CARAS" (Expensive) EN EL CALL STACK                   ║
// ╚══════════════════════════════════════════════════════════════════════════╝
//
//  Como el Call Stack es SINGLE-THREADED, si ponés una operación que
//  tarda mucho (un loop pesado, cálculo matemático intenso, etc.),
//  TODO lo demás se BLOQUEA hasta que termine.
//
//  En el navegador → la página se CONGELA (no responde a clicks)
//  En Node.js → el servidor NO puede atender otras peticiones
//
//  Esto se llama "BLOCKING THE EVENT LOOP" y es el PEOR error
//  que podés cometer en Node.js.

function ejemplo4_expensiveOperations() {
  console.log('\n=== EJEMPLO 4: OPERACIONES COSTOSAS ===\n');

  // ❌ MALO — Esto BLOQUEA el call stack
  function operacionCostosa() {
    console.log('⏳ Iniciando operación costosa...');
    const inicio = Date.now();

    // Simulamos trabajo pesado (bucle de ~500ms)
    let resultado = 0;
    for (let i = 0; i < 50_000_000; i++) {
      resultado += Math.sqrt(i);
    }

    const duracion = Date.now() - inicio;
    console.log(`🔴 Operación costosa terminó en ${duracion}ms`);
    console.log('   ¡Durante ese tiempo NADA más se pudo ejecutar!\n');
    return resultado;
  }

  // Mientras esta función está en el stack, el event loop está BLOQUEADO
  operacionCostosa();

  // ✅ SOLUCIÓN — Partir el trabajo en pedazos con setImmediate o Workers
  //
  // En producción usarías:
  //   - Worker Threads para cálculos pesados
  //   - Streams para procesar datos grandes
  //   - child_process para delegar a otro proceso

  console.log('💡 Tip: Nunca pongas loops pesados en el hilo principal de Node.js');
  console.log('   Usá Worker Threads, Streams, o child_process para eso.\n');
}


// ╔══════════════════════════════════════════════════════════════════════════╗
// ║  5. ORDEN DE EJECUCIÓN DEL CÓDIGO EN JS / NODE.JS                      ║
// ╚══════════════════════════════════════════════════════════════════════════╝
//
//  Node.js tiene VARIAS COLAS (queues) con DIFERENTES PRIORIDADES.
//  El Event Loop las procesa en este ORDEN en cada "tick":
//
//  ┌──────────────────────────────────────────────────────────────┐
//  │                    ORDEN DE PRIORIDAD                        │
//  │                                                              │
//  │  1. 🔴 process.nextTick()    ← MÁXIMA prioridad (microtask) │
//  │  2. 🟡 Promesas (.then)      ← Microtask queue              │
//  │  3. 🟢 setTimeout/setInterval← Timer queue (macrotask)      │
//  │  4. 🔵 I/O callbacks         ← I/O queue                    │
//  │  5. 🟣 setImmediate()        ← Check queue                  │
//  │  6. ⚪ close callbacks        ← Close queue                  │
//  └──────────────────────────────────────────────────────────────┘
//
//  REGLA CLAVE:
//  Las MICROTASKS (nextTick + Promesas) se ejecutan SIEMPRE antes
//  que las MACROTASKS (setTimeout, setImmediate, I/O), incluso si
//  la macrotask llegó primero a la cola.

function ejemplo5_ordenDeEjecucion() {
  console.log('\n=== EJEMPLO 5: ORDEN DE EJECUCIÓN ===\n');

  console.log('1️⃣  Código síncrono — se ejecuta PRIMERO (está en el stack)');

  setTimeout(() => {
    console.log('5️⃣  setTimeout — macrotask, va DESPUÉS de las microtasks');
  }, 0);

  setImmediate(() => {
    console.log('6️⃣  setImmediate — check phase, va después de timers*');
  });

  Promise.resolve().then(() => {
    console.log('3️⃣  Promise.then — microtask, prioridad ALTA');
  });

  process.nextTick(() => {
    console.log('2️⃣  process.nextTick — microtask con la MÁXIMA prioridad');
  });

  Promise.resolve().then(() => {
    console.log('4️⃣  Otra Promise.then — después de nextTick pero antes de macrotasks');
  });

  console.log('1️⃣  Más código síncrono — también PRIMERO');

  // SALIDA ESPERADA (en Node.js):
  //   1️⃣  Código síncrono
  //   1️⃣  Más código síncrono
  //   2️⃣  process.nextTick       ← microtask (máxima prioridad)
  //   3️⃣  Promise.then           ← microtask
  //   4️⃣  Otra Promise.then      ← microtask
  //   5️⃣  setTimeout             ← macrotask (timer)
  //   6️⃣  setImmediate           ← macrotask (check phase)
  //
  //  * Nota: El orden entre setTimeout(0) y setImmediate puede variar
  //    dependiendo de la fase del event loop, pero en general setTimeout
  //    tiende a ir primero cuando están en el main module.
}


// ╔══════════════════════════════════════════════════════════════════════════╗
// ║  6. setTimeout vs setInterval vs process.nextTick                      ║
// ╚══════════════════════════════════════════════════════════════════════════╝

// ─────────────────────────────────────────
//  6a. setTimeout — Ejecutar UNA VEZ después de X milisegundos
// ─────────────────────────────────────────
//
//  setTimeout(callback, delay)
//    - Ejecuta el callback UNA SOLA VEZ
//    - Después de (al menos) 'delay' milisegundos
//    - El delay NO es exacto — es un MÍNIMO. El callback se ejecuta
//      cuando el stack esté vacío Y hayan pasado al menos 'delay' ms.

function ejemplo6a_setTimeout() {
  console.log('\n=== EJEMPLO 6a: setTimeout ===\n');

  console.log('⏱️  Programando tarea para 1 segundo...');

  setTimeout(() => {
    console.log('✅ ¡Pasó ~1 segundo! Esta tarea se ejecutó UNA sola vez.');
  }, 1000);

  // Se puede cancelar con clearTimeout:
  const timerId = setTimeout(() => {
    console.log('❌ Esto NUNCA se va a imprimir');
  }, 2000);

  clearTimeout(timerId); // Cancelamos antes de que se ejecute
  console.log('🚫 El segundo setTimeout fue CANCELADO con clearTimeout');
}

// ─────────────────────────────────────────
//  6b. setInterval — Ejecutar REPETIDAMENTE cada X milisegundos
// ─────────────────────────────────────────
//
//  setInterval(callback, delay)
//    - Ejecuta el callback CADA 'delay' milisegundos
//    - Se repite INFINITAMENTE hasta que lo cancelés con clearInterval
//    - ⚠️ CUIDADO: Si el callback tarda más que el intervalo,
//      los callbacks se van a ACUMULAR en la cola

function ejemplo6b_setInterval() {
  console.log('\n=== EJEMPLO 6b: setInterval ===\n');

  let contador = 0;

  const intervalId = setInterval(() => {
    contador++;
    console.log(`🔄 Tick #${contador} — se ejecuta cada 500ms`);

    // Paramos después de 3 repeticiones
    if (contador >= 3) {
      clearInterval(intervalId);
      console.log('🛑 Intervalo detenido con clearInterval\n');

      // Continuar con el siguiente ejemplo después de que este termine
      ejemplo6c_processNextTick();
    }
  }, 500);
}

// ─────────────────────────────────────────
//  6c. process.nextTick — Ejecutar ANTES de todo lo demás async
// ─────────────────────────────────────────
//
//  process.nextTick(callback)
//    - Ejecuta el callback al FINAL de la operación actual
//    - ANTES de que el event loop continúe a la siguiente fase
//    - Tiene la prioridad MÁS ALTA de todas las colas async
//    - NO tiene delay — se ejecuta lo antes posible
//    - ⚠️ Solo existe en Node.js (no en el navegador)
//
//  ¿Cuándo usarlo en la vida real?
//    1. Para emitir eventos justo después de que el constructor termine.
//    2. Para mantener la CONSISTENCIA en funciones asíncronas (No liberar a Zalgo).
//       - Regla de oro: Una función debe ser 100% síncrona o 100% asíncrona.
//       - Si tu función hace I/O (ej. lee una DB), su contrato es asíncrono.
//       - Si hacés una validación rápida en memoria al principio, NO podés 
//         devolver el error de forma síncrona (rompe el contrato). 
//         Usás nextTick para devolverlo asíncronamente lo más rápido posible.
//
//  ⚠️ PELIGRO: Si llamás process.nextTick recursivamente, podés
//     "MATAR DE HAMBRE" (starve) al event loop porque las microtasks
//     de nextTick SIEMPRE se procesan antes que todo lo demás.

function ejemplo6c_processNextTick() {
  console.log('\n=== EJEMPLO 6c: process.nextTick y Consistencia ===\n');

  // Ejemplo de validación para no romper el contrato asíncrono
  function buscarUsuario(id, callback) {
    if (typeof id !== 'number') {
      // ✅ BIEN: Devolvemos el error asíncronamente usando nextTick
      return process.nextTick(() => {
        callback(new Error('El ID debe ser un número'));
      });
    }
    // Si la validación pasa, haríamos el I/O real (acá simulado)
    setTimeout(() => callback(null, { nombre: 'Carlos' }), 10);
  }

  buscarUsuario('Letra_A', (err) => {
    if (err) console.log(`   🚫 Error de validación recibido de forma ASÍNCRONA: ${err.message}`);
  });

  // Demostración de prioridades:
  setTimeout(() => {
    console.log('   3️⃣  setTimeout — llega DESPUÉS de nextTick');
  }, 0);

  process.nextTick(() => {
    console.log('   1️⃣  process.nextTick suelto — ¡PRIMERA microtask!');
  });

  Promise.resolve().then(() => {
    console.log('   2️⃣  Promise — después de nextTick, antes de setTimeout');
  });

  console.log('   0️⃣  Código síncrono — esto siempre va PRIMERO');
}

// ─────────────────────────────────────────
//  6d. setImmediate vs setTimeout(0) — La pregunta de entrevista
// ─────────────────────────────────────────
//
//  La gran diferencia está en el CONTEXTO y la FASE.
//  - setTimeout(0) va a la fase de Timers (y tiene ~1ms de delay mínimo)
//  - setImmediate va a la fase Check (inmediatamente después de I/O)
//
//  1. En el hilo principal (No determinista 🎲):
//     El orden varía porque depende de qué tan rápido inicie el Event Loop.
//  2. Dentro de un callback de I/O (Determinista 🎯):
//     setImmediate SIEMPRE gana.
//
//  ¿POR QUÉ GANA SIEMPRE DESPUÉS DE I/O? (La respuesta para la entrevista)
//  El Event Loop es como una ruta de colectivo con paradas fijas:
//    Parada 1: Timers (setTimeout)
//    Parada 2: ... (otras fases menores) ...
//    Parada 3: Poll / I/O (Acá se ejecutan fs.readFile, peticiones HTTP, etc.)
//    Parada 4: Check (Acá se ejecuta EXCLUSIVAMENTE setImmediate)
//
//  Cuando estás dentro del callback de fs.readFile(), el loop está "estacionado"
//  en la Parada 3 (Poll). Si ahí adentro registrás un setTimeout y un setImmediate, 
//  al terminar el callback, el loop se mueve a la PARADA INMEDIATAMENTE SIGUIENTE, 
//  que es la Parada 4 (Check). ¡Por eso setImmediate se ejecuta primero!
//  Para ejecutar el setTimeout, el loop tiene que dar TODA LA VUELTA entera
//  para volver a empezar desde la Parada 1 (Timers).

function ejemplo6d_setImmediateVsSetTimeout() {
  console.log('\n=== EJEMPLO 6d: setImmediate vs setTimeout(0) ===\n');

  // En el hilo principal (no podemos garantizar el orden acá)
  setTimeout(() => console.log('   (Principal) ⏱️  setTimeout — orden no garantizado'), 0);
  setImmediate(() => console.log('   (Principal) ⚡ setImmediate — orden no garantizado'));

  // Pero dentro de una operación de I/O... ¡Es determinista!
  const fs = require('fs');
  fs.readFile(__filename, () => {
    console.log('\n   📂 --- Dentro del callback de lectura de archivo (I/O) ---');

    setTimeout(() => console.log('   📂 ⏱️  setTimeout I/O — Siempre va SEGUNDO'), 0);
    setImmediate(() => console.log('   📂 ⚡ setImmediate I/O — ¡Siempre gana el PRIMER LUGAR!'));
  });
}

// ─────────────────────────────────────────
//  6e. COMPARACIÓN LADO A LADO
// ─────────────────────────────────────────
//
//  ┌───────────────────┬──────────────┬──────────────┬──────────────────┐
//  │                   │ setTimeout   │ setInterval  │ process.nextTick │
//  ├───────────────────┼──────────────┼──────────────┼──────────────────┤
//  │ ¿Se repite?       │ NO (1 vez)   │ SÍ (infinito)│ NO (1 vez)      │
//  │ ¿Tiene delay?     │ SÍ (mínimo)  │ SÍ (cada X)  │ NO (ASAP)       │
//  │ ¿Cancelable?      │ clearTimeout │ clearInterval│ NO              │
//  │ Tipo de tarea     │ Macrotask    │ Macrotask    │ Microtask       │
//  │ Prioridad         │ Baja         │ Baja         │ ¡LA MÁS ALTA!  │
//  │ ¿Existe en browser│ SÍ           │ SÍ           │ NO (solo Node)  │
//  │ Cola              │ Timer queue  │ Timer queue  │ nextTick queue  │
//  └───────────────────┴──────────────┴──────────────┴──────────────────┘
//
//  Equivalencia en el navegador para process.nextTick:
//    → queueMicrotask(callback) — hace algo similar


// ╔══════════════════════════════════════════════════════════════════════════╗
// ║  7. EJEMPLO FINAL INTEGRADOR                                           ║
// ╚══════════════════════════════════════════════════════════════════════════╝
//
//  Este ejemplo junta TODO: event loop, call stack, microtasks, macrotasks.
//  Intentá predecir el orden de ejecución antes de correrlo.

function ejemplo7_integrador() {
  console.log('\n=== EJEMPLO 7: INTEGRADOR — ¿Podés predecir el orden? ===\n');

  console.log('A — Síncrono');

  setTimeout(() => console.log('B — setTimeout 0ms'), 0);

  setImmediate(() => console.log('C — setImmediate'));

  Promise.resolve()
    .then(() => console.log('D — Promise 1'))
    .then(() => console.log('E — Promise 2 (encadenada)'));

  process.nextTick(() => {
    console.log('F — nextTick 1');
    process.nextTick(() => console.log('G — nextTick 2 (anidado)'));
  });

  console.log('H — Síncrono');

  // RESPUESTA:
  //   A — Síncrono
  //   H — Síncrono
  //   F — nextTick 1
  //   G — nextTick 2 (anidado)    ← los nextTick anidados van ANTES de las promesas
  //   D — Promise 1
  //   E — Promise 2 (encadenada)
  //   B — setTimeout 0ms
  //   C — setImmediate
  //
  // ¿Por qué G va antes de D?
  // Porque Node.js VACÍA TODA la cola de nextTick antes de pasar
  // a la cola de promesas. Y vacía TODAS las microtasks antes de
  // pasar a cualquier macrotask.
}


// ╔══════════════════════════════════════════════════════════════════════════╗
// ║  EJECUTAR TODOS LOS EJEMPLOS                                           ║
// ╚══════════════════════════════════════════════════════════════════════════╝

async function main() {
  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║  EVENT LOOP, CALL STACK, HEAP — GUÍA CON EJEMPLOS      ║');
  console.log('╚══════════════════════════════════════════════════════════╝');

  ejemplo1_callStack();
  ejemplo2_heap();
  ejemplo3_eventLoop();
  ejemplo4_expensiveOperations();
  ejemplo5_ordenDeEjecucion();
  ejemplo6a_setTimeout();
  ejemplo6d_setImmediateVsSetTimeout();

  // 6b usa setInterval, así que lo ejecutamos con un delay
  // para que no se mezcle con los demás
  setTimeout(() => {
    ejemplo6b_setInterval();
  }, 2000);

  // El ejemplo integrador lo corremos al final de todo
  setTimeout(() => {
    ejemplo7_integrador();
  }, 5000);
}

main();
