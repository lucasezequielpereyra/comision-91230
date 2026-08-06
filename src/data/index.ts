/* ════════════════════════════════════════════════════════════════════════════
 * src/data/index.ts · DATOS DE LA CLASE 2
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Este es el archivo con el que trabajamos en la Clase 2, cuando la lista era
 * fija y se dibujaba con `.map()` dentro de `HomeScreen`.
 *
 * Lo conservamos por dos motivos:
 *   1. `HomeScreen` (la pantalla de aquella clase) lo sigue usando.
 *   2. Sirve para comparar: acá los datos son CONSTANTES (nunca cambian),
 *      mientras que en la Clase 4 pasan a vivir en el ESTADO de `App.tsx`
 *      con `useState`, y por eso la app puede agregar, completar y borrar.
 *
 * Esa es exactamente la diferencia entre "una pantalla que muestra datos" y
 * "una aplicación": el estado.
 *
 * ⚠️ Los objetos fueron actualizados al modelo nuevo de `Task`
 * (`completed` en vez de `done`, `date` en vez de `time`, y ahora con
 * `category`), para que todo el proyecto hable un único idioma.
 * ════════════════════════════════════════════════════════════════════════════ */

import type { Task } from '../types'

/** Lista fija de tareas. Notá que es `const`: nada en la app la modifica.
 *  Para cambiar algo hay que editar este archivo y recargar. */
export const tasks: Task[] = [
  {
    id: '1',
    title: 'Comprar pollo',
    description: 'Ir a la polleria a comprar 2kg de pechuga de pollo',
    category: 'hogar',
    date: 'nextWeek',
    completed: false
  },
  {
    id: '2',
    title: 'Comprar pan',
    description: 'Ir a la panaderia a comprar 1kg de pan',
    category: 'hogar',
    date: 'today',
    completed: true
  },
  {
    id: '3',
    title: 'Comprar leche',
    description: 'Ir al supermercado a comprar 2 litros de leche',
    category: 'hogar',
    date: 'tomorrow',
    completed: false
  },
  {
    id: '4',
    title: 'Comprar huevos',
    description: 'Ir al supermercado a comprar 12 huevos',
    category: 'hogar',
    date: 'nextWeek',
    completed: false
  }
]

/** Nombre del usuario. En una app real vendría del login o de un perfil
 *  guardado; acá está hardcodeado porque todavía no tenemos backend. */
export const name = 'Lucas Pereyra'
