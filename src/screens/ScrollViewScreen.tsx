/* ════════════════════════════════════════════════════════════════════════════
 * src/screens/ScrollViewScreen.tsx · LA MISMA LISTA, HECHA "A LA WEB"
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Esta pantalla existe para COMPARAR, no como ejemplo a seguir.
 *
 * Muestra exactamente las mismas tareas, con exactamente el mismo `TaskItem`,
 * pero usando el patrón que traés de la web: un contenedor scrolleable y un
 * `.map()` adentro.
 *
 * Y funciona. Se ve idéntico. Ese es justamente el problema: con 14 tareas no
 * se nota nada. Por eso pusimos el contador de ítems montados — cambiá entre
 * las dos pestañas y mirá el número:
 *
 *     Tab ⚡ FlatList    →  8 de 14 montados   (virtualizado)
 *     Tab 🐢 ScrollView  → 14 de 14 montados   (todos en memoria)
 *
 * Con 14 tareas es una curiosidad. Con 5.000, la pestaña ScrollView tarda
 * segundos en abrir y puede tumbar la app por falta de memoria.
 *
 * ─── ¿ENTONCES SCROLLVIEW NO SIRVE? ──────────────────────────────────────────
 *
 * Sí sirve, para contenido CORTO Y CONOCIDO: un formulario largo, una pantalla
 * de "términos y condiciones", una vista de detalle (como la de esta app).
 * La regla práctica:
 *
 *     ¿La cantidad de elementos la decide el USUARIO o el servidor?  → FlatList
 *     ¿Está fija en el código y son pocos?                           → ScrollView
 * ════════════════════════════════════════════════════════════════════════════ */

import React from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { Task } from '../types'
import { colors, radius, spacing } from '../theme'
import TaskItem from '../components/TaskItem'
import EmptyState from '../components/EmptyState'
import MountBadge, { useMountCounter } from '../components/MountBadge'

type Props = {
  tasks: Task[]
  onToggle: (id: string) => void
  onSelect: (task: Task) => void
}

export default function ScrollViewScreen({ tasks, onToggle, onSelect }: Props) {
  /* Su PROPIO contador, independiente del de la otra pantalla. Recordá: cada
   * llamada a un custom hook crea su propio estado. Los hooks comparten la
   * lógica, no los datos. */
  const { mounted, onMountChange } = useMountCounter()

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>ScrollView + .map()</Text>
        <Text style={styles.subtitle}>La misma lista, sin virtualización</Text>
        {tasks.length > 0 && <MountBadge mounted={mounted} total={tasks.length} />}
      </View>

      {/* Cartel explicativo. Normalmente NO pondrías esto en una app real:
          está acá porque la app es material de clase y el cartel es parte de
          lo que se está enseñando. */}
      <View style={styles.warnCard}>
        <Text style={styles.warnTitle}>⚠️ ¿Por qué esto no escala?</Text>
        <Text style={styles.warnText}>
          ScrollView crea las {tasks.length} vistas nativas al montar la pantalla, estén visibles o
          no. Con 1.000 tareas serían 1.000 vistas en memoria. FlatList, en cambio, solo mantiene
          las que ves (+ un margen) y recicla el resto. Usalo únicamente para contenido corto:
          formularios, pantallas de texto.
        </Text>
      </View>

      {/* ─── EL ESTADO VACÍO, A MANO ──────────────────────────────────────────
          Otra diferencia práctica con FlatList: `ScrollView` no tiene
          `ListEmptyComponent`. Si no hay tareas, el `.map()` devuelve un array
          vacío y la pantalla queda en blanco. Hay que resolverlo vos con un
          ternario.

          Es una muestra concreta de todo lo que FlatList te da resuelto:
          estado vacío, separadores, encabezado, pie, pull-to-refresh,
          scroll infinito... con ScrollView, todo eso lo escribís a mano. */}
      {tasks.length === 0 ? (
        <EmptyState />
      ) : (
        <ScrollView
          contentContainerStyle={styles.listContent}
          /* Oculta la barrita de scroll. Es preferencia estética: en listas
             cortas la barra aparece y desaparece y distrae. */
          showsVerticalScrollIndicator={false}
        >
          {/* ═══ EL PATRÓN CLÁSICO DE LA WEB ═══════════════════════════════════
              `.map()` recorre el array y devuelve UN COMPONENTE por cada tarea.
              Todos se crean AHORA, en este mismo render, entren en pantalla o no.
              Ahí está la diferencia con FlatList, que decide sobre la marcha
              cuáles crear.

              La `key` sigue siendo obligatoria: es el "DNI" que le permite a
              React saber qué elemento es cuál entre un render y el siguiente.
              Y por las mismas razones de siempre: `task.id`, nunca el índice. */}
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={onToggle}
              onPress={onSelect}
              onMountChange={onMountChange}
            />
          ))}
        </ScrollView>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    // Igual que en FlatList: sin `flex: 1` el scroll no funciona. Un ScrollView
    // necesita un contenedor de altura acotada para saber cuánto puede scrollear.
    flex: 1,
    gap: spacing.lg
  },
  header: {
    gap: spacing.sm
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.ink
  },
  subtitle: {
    fontSize: 14,
    color: colors.muted
  },
  warnCard: {
    backgroundColor: colors.dangerSoft,
    /* La barra de color a la izquierda es el patrón visual estándar para
       "callout" o aviso. Se logra con un borde en un solo lado: más liviano
       que dibujar un ícono y se entiende igual. */
    borderLeftWidth: 4,
    borderLeftColor: colors.danger,
    borderRadius: radius.sm,
    padding: spacing.lg,
    gap: spacing.xs
  },
  warnTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.danger
  },
  warnText: {
    fontSize: 13,
    lineHeight: 19, // 13 × 1.46: párrafo de varios renglones, la altura importa
    color: colors.ink
  },
  listContent: {
    paddingBottom: spacing.xl
  }
})
