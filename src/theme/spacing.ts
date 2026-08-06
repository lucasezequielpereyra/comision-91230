/* ════════════════════════════════════════════════════════════════════════════
 * src/theme/spacing.ts · ESCALA DE ESPACIADOS
 * ════════════════════════════════════════════════════════════════════════════
 *
 * ¿Por qué no escribir `padding: 15` y listo?
 *
 * Porque cuando cada pantalla elige su número a ojo, terminás con paddings de
 * 12, 14, 15, 16 y 18 conviviendo en la misma app. Nadie sabe decir por qué,
 * pero se ve desprolijo. Una ESCALA fija resuelve eso: todos los espacios de
 * la app salen de estos 6 valores, y el resultado se ve intencional.
 *
 * Los valores van (aproximadamente) de a saltos, no de a 1 en 1: la diferencia
 * entre 15 y 16 no se percibe, la diferencia entre 12 y 16 sí.
 *
 * ⚠️ Estos números NO son píxeles físicos: son "density-independent pixels".
 * React Native los multiplica por la densidad de cada pantalla, así que 16
 * se ve del mismo tamaño en un iPhone y en un Android barato.
 * ════════════════════════════════════════════════════════════════════════════ */

export const spacing = {
  /** 4 · separaciones mínimas: entre un ícono y su texto. */
  xs: 4,
  /** 8 · separación entre elementos muy relacionados (título y su badge). */
  sm: 8,
  /** 12 · separación media. */
  md: 12,
  /** 16 · EL valor por defecto. Padding de tarjetas y márgenes de pantalla. */
  lg: 16,
  /** 24 · separación entre bloques distintos de una pantalla. */
  xl: 24,
  /** 32 · aire grande: estados vacíos, respiro al final de una lista. */
  xxl: 32
} as const

/* ════════════════════════════════════════════════════════════════════════════
 * RADIOS DE BORDE
 * ════════════════════════════════════════════════════════════════════════════
 * Misma idea que el spacing, aplicada al redondeo de las esquinas. Mantener
 * una escala corta hace que todas las tarjetas "se vean de la misma familia".
 * ════════════════════════════════════════════════════════════════════════════ */

export const radius = {
  /** 8 · inputs de texto. */
  sm: 8,
  /** 12 · tarjetas de tarea, botones. */
  md: 12,
  /** 16 · contenedores grandes (barra de tabs, hero del detalle). */
  lg: 16,

  /** 999 · el truco de la "píldora".
   *
   *  No existe un `borderRadius: '50%'` confiable en React Native, así que
   *  usamos un número absurdamente grande: el motor lo recorta al máximo
   *  posible, que es exactamente la mitad de la altura. Resultado: los
   *  extremos quedan perfectamente redondeados sin importar cuánto mida el
   *  elemento. Es el estándar para chips y badges. */
  pill: 999
} as const
