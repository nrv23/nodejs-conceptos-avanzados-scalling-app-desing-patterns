import { CancelError } from '../cancelError.js';

// 1. La función asíncrona recibe la 'señal' (AbortSignal) como parámetro
async function procesoLargo(datos, signal) {
  return new Promise((resolve, reject) => {
    
    // Si la señal ya venía cancelada desde antes de empezar, cortamos de inmediato.
    if (signal?.aborted) {
      return reject(new CancelError());
    }

    console.log(`[Proceso] Empezando a trabajar con: "${datos}"...`);

    // Simulamos un trabajo pesado o una petición HTTP que toma 5 segundos
    const temporizador = setTimeout(() => {
      console.log("[Proceso] ✅ Trabajo terminado con éxito.");
      resolve("Resultado final de los datos");
    }, 5000); 

    // 2. Nos suscribimos para escuchar si en algún momento alguien "aprieta el botón de cancelar"
    if (signal) {
      signal.addEventListener('abort', () => {
        console.log("[Proceso] 🛑 ¡Alerta! Se detectó la señal de cancelación.");
        
        // Limpiamos los recursos (en este caso, detenemos el setTimeout)
        clearTimeout(temporizador); 
        
        // Rechazamos la promesa usando la clase que tú creaste
        reject(new CancelError());  
      });
    }
  });
}

// Función principal para probar la lógica
async function main() {
  console.log("=== Iniciando Demostración de Cancelación ===\n");
  
  // Creamos el "control remoto"
  const controller = new AbortController();
  
  // Extraemos el "cable" para pasarlo a la función
  const signal = controller.signal;

  try {
    // Simulamos que el usuario presiona "Cancelar" o hay un timeout a los 2 segundos
    setTimeout(() => {
      console.log("\n[Main] ⏳ Pasaron 2 segundos. Simulando cancelación del usuario...");
      // Ejecutar .abort() es como apretar el botón de apagado
      controller.abort(); 
    }, 2000);

    // Arrancamos la tarea y le pasamos el signal (el cable)
    console.log("[Main] Llamando a la función procesoLargo...");
    const resultado = await procesoLargo("Datos confidenciales", signal);
    
    // Esta línea no llegará a ejecutarse porque cancelaremos antes de los 5 segundos
    console.log("\n[Main] El resultado es:", resultado); 

  } catch (error) {
    // Aquí usamos el polimorfismo y tu clase para saber exactamente por qué falló
    if (error instanceof CancelError) {
      console.log("\n[Main] Manejo de error: ✅ La tarea fue cancelada a propósito. Flujo controlado exitosamente.");
    } else {
      console.error("\n[Main] Manejo de error: ❌ Hubo un error real en el sistema:", error);
    }
  }
}

// Ejecutamos el programa
main();
