/* ════════════════════════════════════════════════════════════════════════════
 * src/theme/colors.ts · LA PALETA DE LA APP
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Una sola fuente de verdad para los colores. La regla es simple:
 *
 *   ❌ backgroundColor: '#FF5A2D'     ← número mágico repetido en 12 archivos
 *   ✅ backgroundColor: colors.primary ← si cambia la marca, tocás UNA línea
 *
 * Además el editor te autocompleta los nombres, así que no hay riesgo de
 * escribir '#FF5A2E' por error en una pantalla y romper la coherencia visual.
 * ════════════════════════════════════════════════════════════════════════════ */

export const colors = {
  /* ─── Superficies ─────────────────────────────────────────────────────── */

  /** Fondo general de la app (el "lienzo"). Un beige cálido, no blanco puro:
   *  hace que las tarjetas blancas se despeguen del fondo sin necesidad de
   *  bordes marcados. */
  canvas: '#F6F1E7',

  /** Fondo de los elementos que "flotan" sobre el canvas: tarjetas, el bottom
   *  sheet del formulario, la tarjeta de detalle. */
  surface: '#FFFFFF',

  /* ─── Texto ───────────────────────────────────────────────────────────── */

  /** Color del texto principal ("ink" = tinta). Ojo: NO es negro puro (#000).
   *  Un marrón muy oscuro cansa menos la vista y se ve más prolijo que el
   *  negro absoluto sobre fondo claro. */
  ink: '#211710',

  /** Texto secundario: subtítulos, fechas, placeholders. Más claro = el ojo
   *  entiende solo que es información de apoyo, sin necesidad de leerlo. */
  muted: '#8A7F72',

  /* ─── Bordes y marca ──────────────────────────────────────────────────── */

  /** Líneas divisorias y bordes de inputs en reposo. */
  border: '#E8DFD0',

  /** Color de marca: botón principal, contador de pendientes, tab activa. */
  primary: '#FF5A2D',

  /** El mismo naranja, pero pastel: fondos de badges y contadores.
   *  Patrón útil: color fuerte para el TEXTO, versión "soft" para el FONDO.
   *  Así el contraste siempre queda legible. */
  primarySoft: '#FFE9E1',

  /** Marrón casi negro: fondo de la barra de tabs y de los chips activos. */
  dark: '#2A1008',

  /* ─── Colores semánticos (comunican estado, no decoran) ───────────────── */

  /** Verde: tarea completada, contador "sano" de ítems montados. */
  success: '#2FA36B',
  successSoft: '#E3F4EB',

  /** Rojo: eliminar, advertencias, contador "problemático". */
  danger: '#D64545',
  dangerSoft: '#FBE9E9',

  /* ─── Compatibilidad con la Clase 2 ───────────────────────────────────── */

  /** Fondo de tarjeta usado por los componentes originales de la Clase 2
   *  (`CardTask` y `Header`). Lo dejamos para que ese código siga funcionando
   *  y puedan compararlo con la versión nueva. */
  cardBackgroundColor: '#bbc19e'
} as const

/* ¿Qué hace ese `as const` del final?
 *
 * Sin él, TypeScript infiere que `colors.primary` es de tipo `string`.
 * Con él, infiere el tipo literal `'#FF5A2D'` y además marca todo el objeto
 * como de solo lectura: si alguien escribe `colors.primary = 'blue'` en medio
 * de un componente, el compilador lo frena. El tema es una constante de
 * diseño, no una variable que se toquetea en runtime. */
