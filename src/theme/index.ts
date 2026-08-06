/* ════════════════════════════════════════════════════════════════════════════
 * src/theme/index.ts · EL "BARRIL" (barrel file) DEL TEMA
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Este archivo no define nada propio: junta lo que exportan sus vecinos y lo
 * vuelve a exportar desde un único punto de entrada.
 *
 * Gracias a esto, en cualquier componente podemos escribir:
 *
 *     import { colors, spacing, radius, shadow } from '../theme'
 *
 * en lugar de cuatro imports separados:
 *
 *     import { colors } from '../theme/colors'
 *     import { spacing } from '../theme/spacing'
 *     ...
 *
 * ¿Por qué basta con poner '../theme' y no '../theme/index'?
 * Porque cuando un import apunta a una CARPETA, el empaquetador (Metro) busca
 * automáticamente el archivo `index` dentro de ella. Es la misma convención
 * que usamos en `src/types` y en `src/data`.
 * ════════════════════════════════════════════════════════════════════════════ */

// Paleta de colores.
export { colors } from './colors'

// Escala de espaciados y radios de borde.
export { spacing, radius } from './spacing'

// `shadow` es la escala nueva (Clase 4); `shadows` la de la Clase 2.
export { shadow, shadows } from './shadows'

// Escala tipográfica.
export { textSize } from './texts'
