/* ════════════════════════════════════════════════════════════════════════════
 * src/theme/shadows.ts · SOMBRAS
 * ════════════════════════════════════════════════════════════════════════════
 *
 * IMPORTANTE (y es novedad de Expo SDK 54 / React Native 0.81):
 *
 * Antes había que escribir sombras DISTINTAS para cada plataforma:
 *
 *   shadowColor / shadowOffset / shadowOpacity / shadowRadius  → solo iOS
 *   elevation                                                  → solo Android
 *
 * Con la Nueva Arquitectura existe `boxShadow`, con la misma sintaxis que CSS
 * en la web, y funciona en iOS, Android y web con una sola línea. De hecho
 * Expo trae una regla de lint (`expo/prefer-box-shadow`) que recomienda usarla
 * en lugar de las props viejas.
 *
 * Sintaxis:  'desplazamientoX  desplazamientoY  desenfoque  color'
 *
 *   '0px 2px 8px rgba(42, 16, 8, 0.08)'
 *     │    │    │         └── color con transparencia (el 0.08 es el alpha)
 *     │    │    └── blur: cuánto se difumina el borde de la sombra
 *     │    └── se corre 2px hacia ABAJO (simula una luz cenital)
 *     └── no se corre hacia los costados
 * ════════════════════════════════════════════════════════════════════════════ */

export const shadow = {
  /** Sombra sutil para tarjetas apoyadas sobre el fondo.
   *  Opacidad bajísima (8%): no se "ve" la sombra, se percibe el relieve.
   *  Ese es el objetivo — si notás la sombra, está de más. */
  card: '0px 2px 8px rgba(42, 16, 8, 0.08)',

  /** Sombra más marcada para lo que debe leerse como "flotando por encima":
   *  el botón de nueva tarea. Más desplazamiento + más blur + más opacidad
   *  = el ojo lo interpreta como más cercano. */
  raised: '0px 4px 14px rgba(42, 16, 8, 0.14)'
} as const

/** Sombra original de la Clase 2, conservada para que `CardTask` y `Header`
 *  (los componentes de esa clase) sigan funcionando sin cambios. */
export const shadows = {
  cardShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)'
} as const
