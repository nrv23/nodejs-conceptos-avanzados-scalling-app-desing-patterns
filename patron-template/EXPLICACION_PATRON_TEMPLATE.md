# Patrón Template Method 🧩

El **Template Method** es un patrón de diseño **comportamental** que define el **esqueleto de un algoritmo** en una clase base, dejando que las subclases implementen los pasos específicos sin cambiar la estructura general.

---

## La idea clave

> La clase base dice **"QUÉ"** hacer y en **QUÉ ORDEN**. Las subclases dicen **"CÓMO"** hacerlo.

---

## Cómo aplica en este código

```
ConfigManager (clase base - el "template")
├── loadConfig()   → lee archivo → llama a parse()   ← paso variable
├── saveConfig()   → llama a stringify() → escribe   ← paso variable
├── get() / set()  → lógica fija, igual para todos
├── parse()        → ⚠️ ABSTRACTO — lanza error si no se implementa
└── stringify()    → ⚠️ ABSTRACTO — lanza error si no se implementa
```

`ConfigManager` define el **flujo completo**:
1. Leer archivo como string
2. **Parsear** ese string → configData       ← cambia según formato
3. Modificar datos con `get`/`set`
4. **Serializar** → volver a string           ← cambia según formato
5. Escribir al disco

Los pasos 2 y 4 son los que **cambian** según el formato, por eso son abstractos.

---

## Las subclases solo implementan lo que cambia

**`JsonConfigManager`** — sabe hablar JSON:
```js
parse(data)     → JSON.parse(data)
stringify(data) → JSON.stringify(data, null, 2)
```

**`YamlConfigManager`** — sabe hablar YAML:
```js
parse(data)     → yaml.load(data)
stringify(data) → yaml.dump(data)
```

Ninguna de las dos repite `readFile`, `writeFile`, `get` ni `set`. **Cero duplicación.**

---

## Flujo en tiempo de ejecución (`index.js`)

```js
const jsonConfig = new JsonConfigManager();
await jsonConfig.loadConfig("config.json");
//   internamente: fs.readFile → this.parse() → JsonConfigManager.parse()

jsonConfig.set("appName", "MyApp");

await jsonConfig.saveConfig("config_modified.json");
//   internamente: this.stringify() → JsonConfigManager.stringify() → fs.writeFile
```

El llamador **no sabe ni le importa** si es JSON o YAML.
Siempre usa la misma interfaz: `loadConfig`, `set`, `saveConfig`.

---

## Analogía rápida

Imagina una receta base de pizza:
*"haz la masa → agrega salsa → agrega queso → agrega **toppings** → hornea"*

El paso de los toppings lo define cada pizzería diferente.
El Template Method es exactamente eso: **receta fija, ingrediente variable**.

---

## Beneficios que se ven en este ejemplo

| Beneficio            | Ejemplo en el código                                      |
|----------------------|-----------------------------------------------------------|
| **DRY**              | `readFile`/`writeFile` están en un solo lugar             |
| **Open/Closed**      | Puedes agregar `XmlConfigManager` sin tocar nada existente|
| **Sin condicionales**| No hay `if (format === 'json')` en ningún lado            |
| **Contrato claro**   | Si olvidas `parse()`, el error te avisa explícitamente    |
