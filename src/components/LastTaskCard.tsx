/* ════════════════════════════════════════════════════════════════════════════
 * src/components/LastTaskCard.tsx · TARJETA DE LA ÚLTIMA TAREA CREADA
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Muestra UNA sola tarea: la última que creó el usuario.
 *
 * ¿Para qué sirve si ya tenemos la lista completa? Es una herramienta didáctica.
 * Cuando armamos el formulario (antes de tener FlatList), esta tarjeta era la
 * prueba visible de que el "lifting state up" funcionaba: tocás "Agregar",
 * el formulario llama a `onAdd`, `App.tsx` guarda la tarea en su estado, y
 * ACÁ aparece. Sin esta tarjeta, el dato se guardaba pero no se veía nada.
 *
 * Es también el componente más simple del proyecto: recibe una tarea y la
 * dibuja. Sin estado, sin efectos, sin lógica. A eso se le dice COMPONENTE DE
 * PRESENTACIÓN, y es el tipo de componente que más conviene tener: es
 * predecible, fácil de testear y fácil de reutilizar.
 * ════════════════════════════════════════════════════════════════════════════ */

import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { CATEGORIES, DUE_DATES, Task } from '../types'
import { colors, radius, shadow, spacing } from '../theme'

type Props = {
  /** La tarea a mostrar. Una sola, no un array: este componente no sabe nada
   *  de listas. */
  task: Task
}

export default function LastTaskCard({ task }: Props) {
  /* Buscamos los datos visuales de la categoría (color, emoji, etiqueta).
   *
   * `task.category` es 'trabajo' | 'personal' | 'estudio' | 'hogar', y
   * CATEGORIES es un Record con exactamente esas claves. Por eso TypeScript
   * sabe que esta búsqueda NUNCA puede devolver `undefined` y nos deja usar
   * `cat.color` directamente, sin chequear antes. Ese es el pago por haber
   * tipado bien el modelo: menos código defensivo. */
  const cat = CATEGORIES[task.category]

  return (
    <View style={styles.card}>
      {/* Fila superior: categoría a la izquierda, fecha a la derecha. */}
      <View style={styles.metaRow}>
        {/* Badge de categoría: fondo pastel (`soft`) + texto en el color
            fuerte de la misma familia. Los colores salen del DATO, no de un
            `if` con cuatro ramas. Si agregás una categoría, esto funciona
            solo — no hay que tocar este archivo. */}
        <View style={[styles.badge, { backgroundColor: cat.soft }]}>
          <Text style={[styles.badgeText, { color: cat.color }]}>
            {cat.emoji} {cat.label}
          </Text>
        </View>

        {/* Traducimos la clave técnica al texto en español. */}
        <Text style={styles.date}>{DUE_DATES[task.date]}</Text>
      </View>

      <Text style={styles.title}>{task.title}</Text>

      {/* ─── RENDERIZADO CONDICIONAL con && ─────────────────────────────────
          La descripción es opcional, así que solo dibujamos el <Text> si hay
          algo que mostrar.

          Cómo funciona: si la condición es `false`, la expresión entera vale
          `false`, y React ignora los `false` (no dibuja nada). Si es `true`,
          vale el elemento de la derecha y se dibuja.

          ⚠️ TRAMPA CLÁSICA: usamos `.length > 0` y no solo `.length`.
          Si escribiéramos `{task.description.length && <Text>...}` y el largo
          fuera 0, la expresión valdría el NÚMERO 0 — que React sí intenta
          renderizar. En React Native eso revienta con el error
          "Text strings must be rendered within a <Text> component".
          Regla: en la izquierda del && poné siempre un booleano. */}
      {task.description.length > 0 && <Text style={styles.description}>{task.description}</Text>}

      {/* Mostramos el id solo con fines didácticos: sirve para ver que cada
          tarea nueva recibe uno distinto (generado por `createId()`). En una
          app real esto no se le muestra al usuario. */}
      <Text style={styles.id}>id: {task.id}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.sm, // separa título, descripción e id sin margins sueltos
    boxShadow: shadow.card
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    /* `justifyContent: 'space-between'` empuja el primer hijo al inicio y el
       último al final, repartiendo todo el espacio sobrante en el medio.
       Es el truco estándar para "una cosa a la izquierda, otra a la derecha"
       sin calcular anchos ni usar `flex: 1` de relleno. */
    justifyContent: 'space-between'
  },
  badge: {
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs
    // Ojo: el `backgroundColor` no está acá. Se aplica inline en el JSX
    // porque depende de la categoría, que solo se conoce en runtime.
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '800'
  },
  date: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.muted
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.ink
  },
  description: {
    fontSize: 14,
    /* `lineHeight` (alto de renglón) es lo que más impacta en la legibilidad
       de un párrafo. La regla práctica: entre 1.4 y 1.5 veces el fontSize.
       Acá 14 × 1.43 ≈ 20. Sin esto, los renglones quedan apretados. */
    lineHeight: 20,
    color: colors.muted
  },
  id: {
    fontSize: 11,
    color: colors.muted,
    opacity: 0.7 // aún más apagado: es un detalle técnico, no contenido
  }
})
