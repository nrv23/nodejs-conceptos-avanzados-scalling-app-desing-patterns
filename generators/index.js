// =============================================================
// GENERADORES EN JAVASCRIPT - Ejemplo paso a paso
// =============================================================
// Un generador se define con function* (asterisco)
// Cada vez que encuentra un 'yield', se PAUSA y entrega ese valor.
// La función NO CONTINÚA hasta que alguien llame .next()
// =============================================================


// ---------------------------------------------------------
// EJEMPLO 1: Generador básico - entendiendo el "puntero"
// ---------------------------------------------------------
function* contadorManual() {
  console.log("  [GEN] Inicio de la función"); // Corre al primer .next()

  yield 1; // ← SE PAUSA AQUÍ. Entrega 1 hacia afuera.

  console.log("  [GEN] Retomando después del yield 1..."); // Corre al segundo .next()

  yield 2; // ← SE PAUSA AQUÍ. Entrega 2 hacia afuera.

  console.log("  [GEN] Retomando después del yield 2..."); // Corre al tercer .next()

  yield 3; // ← SE PAUSA AQUÍ. Entrega 3 hacia afuera.

  console.log("  [GEN] Llegué al final de la función."); // Corre al cuarto .next()
  // Sin más yields → done: true
}

console.log("=== EJEMPLO 1: Generador básico ===\n");

// Llamar a la función NO la ejecuta, solo crea el objeto generador (el "puntero")
const gen = contadorManual();
console.log("Generador creado. La función aún NO empezó a ejecutarse.\n");

// Cada .next() avanza el puntero hasta el próximo yield
console.log("[Main] Llamando .next() #1:");
const r1 = gen.next();
console.log("[Main] Recibí:", r1); // { value: 1, done: false }

console.log("\n[Main] Llamando .next() #2:");
const r2 = gen.next();
console.log("[Main] Recibí:", r2); // { value: 2, done: false }

console.log("\n[Main] Llamando .next() #3:");
const r3 = gen.next();
console.log("[Main] Recibí:", r3); // { value: 3, done: false }

console.log("\n[Main] Llamando .next() #4 (ya no hay más yields):");
const { value, done } = gen.next();
console.log("[Main] Recibí:", value, done); // { value: undefined, done: true }


// ---------------------------------------------------------
// EJEMPLO 2: Recorrer un generador con for...of
// (En lugar de llamar .next() manualmente, JS lo hace por vos)
// ---------------------------------------------------------
console.log("\n\n=== EJEMPLO 2: for...of con un generador ===\n");

function* diasDeLaSemana() {
  yield "Lunes";
  yield "Martes";
  yield "Miércoles";
  yield "Jueves";
  yield "Viernes";
}

// for...of llama .next() automáticamente en cada iteración
// y se detiene cuando done: true
for (const dia of diasDeLaSemana()) {
  // el forof se eejucta gasta que diasDeLaSemana()) devuelva algo diferente a undefined
  console.log(" ->", dia);

}


// ---------------------------------------------------------
// EJEMPLO 3: Generador infinito (aquí brilla el patrón)
// Una función normal no puede retornar "infinitos" valores.
// Un generador SÍ puede, porque solo calcula el siguiente
// cuando se lo pedís.
// ---------------------------------------------------------
console.log("\n\n=== EJEMPLO 3: Generador infinito de IDs ===\n");

function* generadorDeIds() {
  let id = 1;
  while (true) { // ← Loop infinito. No explota porque yield lo pausa.
    yield id++;
  }
}

const ids = generadorDeIds();

console.log("ID generado:", ids.next().value); // 1
console.log("ID generado:", ids.next().value); // 2
console.log("ID generado:", ids.next().value); // 3
console.log("ID generado:", ids.next().value); // 4
console.log("(El generador puede seguir indefinidamente, pero nosotros decidimos cuándo parar)");
