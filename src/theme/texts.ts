/* ════════════════════════════════════════════════════════════════════════════
 * src/theme/texts.ts · ESCALA TIPOGRÁFICA
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Los tamaños de texto de la app, definidos en un solo lugar (mismo criterio
 * que `colors` y `spacing`).
 *
 * La idea de una escala tipográfica es que los tamaños comuniquen JERARQUÍA:
 * el usuario entiende qué es título y qué es detalle sin leer una palabra,
 * solo por el tamaño. Para que eso funcione, los saltos tienen que ser
 * claramente perceptibles — de ahí 24 / 20 / 16 / 14 y no 16 / 15 / 14 / 13.
 *
 * Lo usa `HomeScreen` (la pantalla de la Clase 2). Las pantallas de la Clase 4
 * escriben el `fontSize` directo en sus estilos; unificar todo bajo esta escala
 * es un buen ejercicio para practicar en casa.
 * ════════════════════════════════════════════════════════════════════════════ */

export const textSize = {
  /** 24 · título principal de una pantalla. */
  title: 24,
  /** 20 · subtítulos y encabezados de sección. */
  subtitle: 20,
  /** 16 · texto de lectura (el cuerpo, lo que más se lee). */
  description: 16,
  /** 14 · texto auxiliar: fechas, aclaraciones, etiquetas. */
  small: 14
} as const
