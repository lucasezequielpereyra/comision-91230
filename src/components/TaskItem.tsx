/* ════════════════════════════════════════════════════════════════════════════
 * src/components/TaskItem.tsx · UNA FILA DE LA LISTA
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Cada tarea de la lista se dibuja con este componente. Lo usan LAS DOS
 * pantallas (la de FlatList y la de ScrollView) — y eso es a propósito: si el
 * ítem fuera distinto en cada una, la comparación de rendimiento no valdría
 * nada. Misma fila, mismos datos, distinto contenedor.
 *
 * Tiene DOS zonas táctiles anidadas, y esa es la parte interesante:
 *
 *   ┌──────────────────────────────────────────────┐
 *   │  ( ✓ )   Comprar pan                      ›  │  ← tocar la tarjeta: detalle
 *   │   └── tocar el círculo: completar/descompletar│
 *   └──────────────────────────────────────────────┘
 * ════════════════════════════════════════════════════════════════════════════ */

import React, { memo, useEffect } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { CATEGORIES, DUE_DATES, Task } from '../types'
import { colors, radius, shadow, spacing } from '../theme'

type Props = {
  /** La tarea a dibujar. */
  task: Task

  /** Avisa que hay que cambiar el estado completada/pendiente.
   *  Mandamos solo el `id`: es todo lo que `App.tsx` necesita para encontrarla. */
  onToggle: (id: string) => void

  /** Avisa que el usuario quiere ver el detalle.
   *  Acá mandamos la tarea ENTERA, no el id, porque quien recibe el aviso va a
   *  guardarla en `selectedTask` para mostrarla. */
  onPress: (task: Task) => void

  /** Registra el montaje del ítem y devuelve su función de limpieza.
   *
   *  Es el instrumento de medición de la clase: gracias a esto podemos contar
   *  cuántos ítems existen en memoria y comparar FlatList contra ScrollView.
   *
   *  El `?` la marca como OPCIONAL: el componente funciona igual sin ella.
   *  Es lo correcto para algo que solo sirve a la demostración. */
  onMountChange?: () => () => void
  /*                 │        └── la función de limpieza que devuelve
  *                  └── la función en sí (no recibe parámetros) */
}

/* ─── ¿POR QUÉ ESTE COMPONENTE ESTÁ EN SU PROPIO ARCHIVO? ─────────────────────
 *
 * Es una de las mejores prácticas centrales de la clase. La alternativa sería
 * escribirlo dentro del `renderItem` de la pantalla:
 *
 *     renderItem={({ item }) => (
 *       <TouchableOpacity>...</TouchableOpacity>   // ❌
 *     )}
 *
 * Eso funciona, pero en cada render de la pantalla se crea un componente NUEVO
 * (una función distinta). React compara por referencia, ve algo distinto y
 * vuelve a dibujar TODAS las filas — aunque los datos sean idénticos.
 *
 * Con el componente afuera, la referencia es estable y podemos usar memo().
 *
 * ─── ¿QUÉ HACE memo()? ───────────────────────────────────────────────────────
 *
 * Envuelve al componente y le agrega un filtro: antes de re-renderizar, compara
 * las props nuevas con las viejas. Si son las mismas, se saltea el render y
 * reutiliza lo que ya había dibujado.
 *
 * Traducido a esta app: si tenés 14 tareas y tocás el check de UNA, sin memo()
 * se redibujan las 14. Con memo(), solo la que cambió.
 *
 * ⚠️ La comparación es SUPERFICIAL (shallow): compara con `===`, no mira dentro
 * de los objetos. Por eso memo() solo sirve si las props llegan estables — de
 * ahí que en las pantallas envolvamos `renderItem` con `useCallback` y que
 * `onToggle` / `onSelect` estén memorizadas en `App.tsx`. Si una sola de esas
 * piezas falla, memo() no filtra nada. Van todas juntas o ninguna sirve. */
const TaskItem = memo(function TaskItem({ task, onToggle, onPress, onMountChange }: Props) {
  /* ─── EL CICLO DE VIDA DEL ÍTEM ─────────────────────────────────────────────
   *
   * `useEffect` ejecuta código DESPUÉS de que el componente se dibujó en
   * pantalla. Y si la función que le pasás devuelve otra función, React guarda
   * esa segunda y la ejecuta cuando el componente se DESMONTA (desaparece).
   *
   *     useEffect(() => onMountChange?.(), [onMountChange])
   *                     └────────┬───────┘
   *          esto se ejecuta al montar, y lo que DEVUELVE
   *          (la función que resta 1) se ejecuta al desmontar
   *
   * Como `onMountChange` suma 1 al montar y su cleanup resta 1 al desmontar,
   * el contador refleja en todo momento cuántos ítems están vivos.
   *
   * El `?.` es OPTIONAL CHAINING: si `onMountChange` no existe (recordá que es
   * opcional), no la llama y devuelve `undefined` en lugar de romper con
   * "onMountChange is not a function". React acepta `undefined` como "sin
   * limpieza que hacer".
   *
   * Sobre el array de dependencias `[onMountChange]`: le dice a React "volvé a
   * ejecutar este efecto solo si esta función cambia". Como en `useMountCounter`
   * la memorizamos con `useCallback([])`, nunca cambia, y el efecto corre
   * exactamente una vez por montaje. Si no la hubiéramos memorizado, el efecto
   * se dispararía en cada render y el contador se rompería. */
  useEffect(() => onMountChange?.(), [onMountChange])

  // Datos visuales de la categoría (color, emoji, etiqueta).
  const cat = CATEGORIES[task.category]

  return (
    /* ─── ZONA TÁCTIL EXTERIOR: abre el detalle ────────────────────────────── */
    <TouchableOpacity
      // Estilo base + variante apagada si ya está completada.
      style={[styles.card, task.completed && styles.cardCompleted]}
      /* Mandamos la tarea COMPLETA hacia arriba. Es la diferencia con el
         toggle: allá alcanza con el id (hay que buscar y modificar), acá
         necesitamos el objeto entero (hay que mostrarlo). */
      onPress={() => onPress(task)}
      activeOpacity={0.75}
    >
      {/* ─── ZONA TÁCTIL INTERIOR: el checkbox ───────────────────────────────
          Un TouchableOpacity DENTRO de otro. Al tocar el círculo, React Native
          entrega el toque al hijo (el más específico) y NO dispara el del
          padre. Por eso tocar el check no abre el detalle. */}
      <TouchableOpacity
        style={[
          styles.checkbox,
          // El borde toma el color de la categoría.
          { borderColor: cat.color },
          // Y cuando está completada, ese color pasa a ser el relleno.
          task.completed && { backgroundColor: cat.color }
        ]}
        onPress={() => onToggle(task.id)}
        /* `hitSlop` agranda el área táctil SIN agrandar el dibujo. El círculo
           mide 24×24 (chico para un dedo); con 8px extra por lado, la zona
           sensible pasa a 40×40, que es el mínimo recomendado de accesibilidad.
           Visualmente no cambia nada, pero deja de fallar el toque. */
        hitSlop={8}
      >
        {/* El tilde solo existe si la tarea está completada. */}
        {task.completed && <Text style={styles.checkmark}>✓</Text>}
      </TouchableOpacity>

      {/* ─── CUERPO: título + metadatos ──────────────────────────────────── */}
      <View style={styles.body}>
        <Text
          style={[styles.title, task.completed && styles.titleCompleted]}
          /* `numberOfLines={1}` corta el texto largo con puntos suspensivos
             en lugar de dejar que empuje el layout y descuadre la fila.
             En una lista esto es casi obligatorio: garantiza que todas las
             filas midan lo mismo. */
          numberOfLines={1}
        >
          {task.title}
        </Text>

        <View style={styles.metaRow}>
          <View style={[styles.badge, { backgroundColor: cat.soft }]}>
            <Text style={[styles.badgeText, { color: cat.color }]}>
              {cat.emoji} {cat.label}
            </Text>
          </View>
          <Text style={styles.date}>{DUE_DATES[task.date]}</Text>
        </View>
      </View>

      {/* La flechita de la derecha: señal universal de "acá hay más para ver".
          Sin ella, el usuario no tiene forma de saber que la fila es tocable. */}
      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  )
})

export default TaskItem

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row', // checkbox | cuerpo | flecha, en fila
    alignItems: 'center', // los tres centrados verticalmente entre sí
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.lg,
    /* Separación entre filas. Acá usamos `marginBottom` y no `gap` porque el
       contenedor de la FlatList no es un flex container que podamos controlar
       desde el ítem: cada fila se encarga de su propio espacio inferior. */
    marginBottom: spacing.sm,
    boxShadow: shadow.card
  },
  cardCompleted: {
    /* Bajar la opacidad de TODA la tarjeta es más simple y más consistente que
       apagar cada texto por separado: con una línea, la fila entera "se corre
       a segundo plano". */
    opacity: 0.55
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: radius.pill, // círculo perfecto
    borderWidth: 2,
    alignItems: 'center', // centra el ✓ horizontalmente
    justifyContent: 'center' // y verticalmente
  },
  checkmark: {
    color: colors.surface, // blanco sobre el color de la categoría
    fontSize: 13,
    fontWeight: '800',
    /* Ajuste fino: el ✓ tiene espacio de sobra arriba y abajo dentro de su
       renglón, lo que lo deja visualmente descentrado. Bajar el `lineHeight`
       lo compensa. Este tipo de detalle es lo que separa una UI prolija de
       una "casi bien". */
    lineHeight: 15
  },
  body: {
    /* `flex: 1` = "ocupá TODO el espacio que sobre".
       El checkbox y la flecha miden lo suyo; el cuerpo se estira para llenar
       el resto. Es lo que hace que la flecha quede siempre pegada a la
       derecha, sin importar cuán largo sea el título. */
    flex: 1,
    gap: spacing.xs
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.ink
  },
  titleCompleted: {
    textDecorationLine: 'line-through', // tachado
    color: colors.muted
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.pill
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700'
  },
  date: {
    fontSize: 12,
    color: colors.muted
  },
  chevron: {
    fontSize: 22,
    color: colors.muted,
    marginTop: -2 // corrección óptica: el carácter › se ve caído sin esto
  }
})
