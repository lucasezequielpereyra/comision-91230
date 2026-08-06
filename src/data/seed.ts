/* ════════════════════════════════════════════════════════════════════════════
 * src/data/seed.ts · TAREAS INICIALES ("semilla")
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Una "semilla" (seed) son los datos con los que arranca la app antes de que el
 * usuario haga nada. Sirven para dos cosas:
 *
 *   1. Poder ver y probar la interfaz sin tener que cargar 10 tareas a mano.
 *   2. En esta clase específicamente: tener SUFICIENTES ítems como para que se
 *      note la diferencia entre FlatList y ScrollView. Con 3 tareas las dos se
 *      comportan igual; con 14 ya se ve que FlatList monta solo las visibles.
 *
 * ⚠️ Estos datos viven solo en memoria. Al cerrar la app, las tareas que hayas
 * creado desaparecen y todo vuelve a este seed. Guardarlas de verdad requiere
 * almacenamiento persistente (AsyncStorage / SQLite), que se ve más adelante.
 * ════════════════════════════════════════════════════════════════════════════ */

import type { Task } from '../types'

/* ─── Los datos crudos, en formato compacto ───────────────────────────────────
 *
 * En vez de escribir 14 objetos completos (con sus 6 propiedades y sus llaves),
 * los guardamos como TUPLAS: arrays de posición fija donde cada lugar significa
 * siempre lo mismo.
 *
 *   Array<[string, string, Task['category'], Task['date'], boolean]>
 *            │        │           │                │          └─ completed
 *            │        │           │                └─ date
 *            │        │           └─ category
 *            │        └─ description
 *            └─ title
 *
 * Fijate en `Task['category']`: eso es un LOOKUP TYPE. Significa "el tipo que
 * tiene la propiedad `category` dentro de `Task`", o sea `Category`. La ventaja
 * de escribirlo así es que si mañana cambiamos el modelo, este archivo se
 * actualiza solo — nunca queda desincronizado.
 *
 * 💡 Para ver el "estado vacío" (EmptyState) en clase: dejá este array en [].
 */
const raw: Array<[string, string, Task['category'], Task['date'], boolean]> = [
  ['Preparar la clase 4', 'Armar los ejemplos de FlatList y ScrollView', 'trabajo', 'today', false],
  ['Responder mails', 'Contestar las consultas de los estudiantes', 'trabajo', 'today', true],
  ['Corregir entregas', 'Revisar los proyectos del checkpoint 3', 'trabajo', 'tomorrow', false],
  ['Repasar useState', 'Volver a ver el ejemplo del contador', 'estudio', 'today', false],
  ['Leer sobre FlatList', 'Documentación oficial de React Native', 'estudio', 'tomorrow', false],
  ['Practicar TypeScript', 'Ejercicios de union types y Record', 'estudio', 'nextWeek', false],
  ['Comprar pan', 'Ir a la panadería a comprar 1kg de pan', 'hogar', 'today', true],
  ['Comprar leche', 'Dos litros en el supermercado', 'hogar', 'today', false],
  ['Comprar huevos', 'Una docena', 'hogar', 'tomorrow', false],
  ['Sacar la basura', 'Antes de las 21hs', 'hogar', 'today', false],
  ['Llamar a mamá', 'Preguntarle cómo salió el estudio', 'personal', 'today', false],
  ['Turno con el dentista', 'Pedirlo por la app de la obra social', 'personal', 'tomorrow', false],
  ['Ir al gimnasio', 'Rutina de piernas', 'personal', 'today', false],
  ['Renovar la SUBE', 'Cargarla antes del lunes', 'personal', 'nextWeek', false]
]

/* ─── De tuplas a objetos Task ────────────────────────────────────────────────
 *
 * `.map()` recorre el array y devuelve UNO NUEVO con el resultado de transformar
 * cada elemento. Es el método que más vas a usar en React: transformar datos en
 * otros datos (acá) o en componentes (en las pantallas).
 *
 * El `([title, description, category, date, completed], i)` de los parámetros es
 * DESESTRUCTURACIÓN de array: en vez de recibir la tupla entera y escribir
 * `t[0]`, `t[1]`, `t[2]`..., le ponemos nombre a cada posición al vuelo.
 * El segundo parámetro (`i`) es el índice, que `.map()` siempre te pasa.
 *
 * ¿Por qué el id es `seed-1`, `seed-2`... y no usamos `createId()`?
 * Porque `createId()` usa la hora actual y un número al azar: cada vez que
 * arrancara la app, las tareas iniciales tendrían ids distintos. Estos ids en
 * cambio son DETERMINÍSTICOS (siempre los mismos), que es lo que corresponde
 * para datos fijos. `createId()` queda para las tareas que crea el usuario. */
export const SEED_TASKS: Task[] = raw.map(([title, description, category, date, completed], i) => ({
  id: `seed-${i + 1}`,
  title,
  description,
  category,
  date,
  completed
}))
