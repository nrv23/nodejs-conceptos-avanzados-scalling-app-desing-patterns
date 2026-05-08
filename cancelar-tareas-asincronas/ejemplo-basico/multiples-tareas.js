import { CancelError } from '../cancelError.js';

// Una función genérica para simular cualquier tarea que toma tiempo
async function tarea(nombre, tiempo, signal) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) return reject(new CancelError());

    console.log(`[${nombre}] Iniciando... tardará ${tiempo / 1000}s`);

    const temporizador = setTimeout(() => {
      console.log(`[${nombre}] ✅ Terminada con éxito.`);
      resolve(`${nombre} OK`);
    }, tiempo);

    if (signal) {
      signal.addEventListener('abort', () => {
        console.log(`[${nombre}] 🛑 Cancelada.`);
        clearTimeout(temporizador);
        reject(new CancelError());
      });

      resolve(`tarea ${nombre} ejecutada con éxito`);
    }
  });
}

async function main() {
  // =========================================================
  // ESCENARIO 1: Un mismo botón cancela MÚLTIPLES tareas
  // =========================================================
  console.log("=== ESCENARIO 1: Un controlador para todo ===");
  const controladorGlobal = new AbortController();

  // Iniciamos dos tareas y les pasamos EXACTAMENTE LA MISMA señal
  const p1 = tarea("Descarga SQL", 4000, controladorGlobal.signal).then(console.log).catch(console.log);
  const p2 = tarea("Renderizado", 5000, controladorGlobal.signal).then(console.log).catch(console.log);

  // A los 2 segundos apretamos el botón
  setTimeout(() => {
    console.log("\n💥 Apretando botón global...");
    controladorGlobal.abort();
  }, 2000);

  // Esperamos a que todo termine o se cancele
  // p1 y p2 son varuables que guardan las promesas pendientes , esto es para que Promise.all pueda esperar a que se resuelvan o se cancelen
  await Promise.all([p1, p2]);


  console.log("\n-------------------------------------------------\n");


  // =========================================================
  // ESCENARIO 2: Controles independientes para tareas distintas
  // =========================================================
  console.log("=== ESCENARIO 2: Controladores Independientes ===");

  const controladorA = new AbortController();
  const controladorB = new AbortController();

  // Cada tarea recibe su PROPIA señal (su propio cable)
  const p3 = tarea("Tarea Sacrificada", 4000, controladorA.signal).then(console.log).catch(console.log);
  const p4 = tarea("Tarea Salvada", 4000, controladorB.signal).then(console.log).catch(console.log);

  // A los 2 segundos, APRETAMOS SOLO EL BOTÓN A
  setTimeout(() => {
    console.log("\n💥 Apretando SOLO el botón del controlador A...");
    controladorA.abort();
    // Nunca hacemos controladorB.abort(), así que la tarea Salvada terminará felizmente.
  }, 2000);
  // p3 y p4 son varuables que guardan las promesas pendientes , esto es para que Promise.all pueda esperar a que se resuelvan o se cancelen
  await Promise.all([p3, p4]);
  console.log("\n=== Fin de la demostración ===");
}

main();
