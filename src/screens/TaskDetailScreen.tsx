/* ════════════════════════════════════════════════════════════════════════════
 * src/screens/TaskDetailScreen.tsx · PANTALLA DE DETALLE
 * ════════════════════════════════════════════════════════════════════════════
 *
 * ─── EL PATRÓN MASTER-DETAIL ─────────────────────────────────────────────────
 *
 * Es uno de los patrones más usados en apps móviles:
 *
 *     LISTA (master)                DETALLE
 *     ├── versión resumida          ├── el objeto completo
 *     ├── muchos elementos          ├── uno solo
 *     └── optimizada para escanear  └── optimizada para leer y actuar
 *
 * La lista muestra título, categoría y fecha. Acá mostramos todo, y sumamos
 * las acciones que no entran en una fila: completar y eliminar.
 *
 * ─── LA "NAVEGACIÓN" ESTÁ SIMULADA ───────────────────────────────────────────
 *
 * No hay React Navigation todavía (llega en el Módulo 5). El mecanismo es:
 *
 *   1. Tocás una fila       →  onSelect(task)  →  setSelectedTask(task)
 *   2. `selectedTask` deja de ser null
 *   3. El ternario de App.tsx renderiza ESTA pantalla en vez de la lista
 *   4. Tocás "Volver"       →  onBack()        →  setSelectedTask(null)
 *
 * O sea: "navegar" acá es cambiar un dato y dejar que React decida qué mostrar.
 * Cuando aparezca React Navigation vas a reconocer la misma idea, ya empaquetada
 * con historial, animaciones y el gesto de deslizar para volver.
 * ════════════════════════════════════════════════════════════════════════════ */

import React from 'react'
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { CATEGORIES, DUE_DATES, Task } from '../types'
import { colors, radius, shadow, spacing } from '../theme'

type Props = {
  /** La tarea a mostrar. No puede ser `null`: si esta pantalla está en
   *  pantalla, es porque hay una tarea seleccionada. El chequeo lo hace
   *  `App.tsx` antes de renderizarla, así que acá podemos usar `task.title`
   *  sin miedo. */
  task: Task
  /** Volver a la lista. No recibe parámetros: no hay nada que informar. */
  onBack: () => void
  /** Completar / descompletar. */
  onToggle: (id: string) => void
  /** Eliminar la tarea. */
  onDelete: (id: string) => void
}

export default function TaskDetailScreen({ task, onBack, onToggle, onDelete }: Props) {
  const cat = CATEGORIES[task.category]

  return (
    <View style={styles.container}>
      {/* ─── BOTÓN VOLVER ────────────────────────────────────────────────────
          Requisito del checkpoint. Sin él, el usuario entra al detalle y queda
          encerrado: no hay barra de navegación ni gesto de retroceso todavía.
          El símbolo ‹ + la palabra "Volver" es la convención universal. */}
      <TouchableOpacity style={styles.backButton} onPress={onBack} hitSlop={8}>
        <Text style={styles.backText}>‹ Volver a la lista</Text>
      </TouchableOpacity>

      {/* Usamos ScrollView (no FlatList) y está BIEN: el contenido es fijo y
          corto — unos pocos bloques que escribimos nosotros. Este es
          exactamente el caso de uso correcto para ScrollView. */}
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* ─── HERO ──────────────────────────────────────────────────────────
            El bloque de arriba, pintado con el color pastel de la categoría.
            Da identidad visual inmediata: antes de leer una palabra, el color
            y el emoji ya te dicen de qué tipo de tarea se trata. */}
        <View style={[styles.hero, { backgroundColor: cat.soft }]}>
          <Text style={styles.heroEmoji}>{cat.emoji}</Text>
          <View style={[styles.categoryBadge, { backgroundColor: cat.color }]}>
            <Text style={styles.categoryText}>{cat.label}</Text>
          </View>
        </View>

        {/* El título, tachado si la tarea está completada (mismo criterio
            visual que en la fila de la lista: la coherencia importa). */}
        <Text style={[styles.title, task.completed && styles.titleCompleted]}>{task.title}</Text>

        {/* ─── TARJETA DE METADATOS ───────────────────────────────────────────
            Estructura repetida: etiqueta a la izquierda, valor a la derecha,
            con una línea divisoria entre filas. */}
        <View style={styles.metaCard}>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Estado</Text>
            {/* Color Y símbolo cambian juntos: verde ● para completada,
                naranja ○ para pendiente. Usar dos señales en vez de solo el
                color es una buena práctica de accesibilidad — hay gente que
                no distingue verde de naranja. */}
            <Text
              style={[styles.metaValue, { color: task.completed ? colors.success : colors.primary }]}
            >
              {task.completed ? '● Completada' : '○ Pendiente'}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Fecha</Text>
            <Text style={styles.metaValue}>{DUE_DATES[task.date]}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>ID</Text>
            <Text style={styles.metaId}>{task.id}</Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>Descripción</Text>

        {/* ─── EL OPERADOR || COMO VALOR POR DEFECTO ──────────────────────────
            `a || b` devuelve `a` si es "verdadero", y `b` si no. Como el string
            vacío ('') es falsy, si no hay descripción se muestra el texto de
            reemplazo.

            Es más corto que un ternario y se lee natural: "la descripción, o
            este texto si no hay". Comparalo con el `&&` que usamos en
            LastTaskCard: allá queríamos NO mostrar nada; acá queremos mostrar
            algo alternativo. */}
        <Text style={styles.description}>
          {task.description ||
            'Esta tarea no tiene descripción. Podés agregarla desde el formulario al crear la próxima.'}
        </Text>

        {/* ─── ACCIÓN PRINCIPAL: completar / descompletar ─────────────────────
            El texto Y el color del botón dependen del estado actual: siempre
            ofrece la acción CONTRARIA a como está la tarea. Un botón que dice
            "Completada" cuando ya lo está confundiría: ¿es una etiqueta o un
            botón? Acá siempre es claro qué va a pasar si lo tocás. */}
        <TouchableOpacity
          style={[styles.action, task.completed ? styles.actionUndo : styles.actionDone]}
          onPress={() => onToggle(task.id)}
          activeOpacity={0.85}
        >
          <Text style={styles.actionText}>
            {task.completed ? 'Marcar como pendiente' : 'Marcar como completada ✓'}
          </Text>
        </TouchableOpacity>

        {/* ─── ACCIÓN DESTRUCTIVA: eliminar ───────────────────────────────────
            Va última y con estilo distinto (fondo pastel + texto rojo, no un
            botón rojo lleno). La jerarquía visual importa: la acción peligrosa
            no debe competir en peso con la principal, para que nadie la toque
            de apuro.

            💡 Para practicar: agregarle una confirmación con `Alert.alert()`
            antes de borrar. Hoy elimina de una, sin vuelta atrás. */}
        <TouchableOpacity
          style={[styles.action, styles.actionDelete]}
          onPress={() => onDelete(task.id)}
          activeOpacity={0.85}
        >
          <Text style={[styles.actionText, { color: colors.danger }]}>Eliminar tarea</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: spacing.lg
  },
  backButton: {
    // Sin esto el botón se estiraría a todo el ancho y su zona táctil abarcaría
    // la pantalla entera. Que ocupe solo lo que mide su texto.
    alignSelf: 'flex-start'
  },
  backText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary // color de marca = "esto es tocable"
  },
  content: {
    gap: spacing.md,
    // Aire generoso al final: en pantallas altas, el último botón no debe
    // quedar pegado al borde inferior (ni bajo la barra de gestos).
    paddingBottom: spacing.xxl
  },
  hero: {
    borderRadius: radius.lg,
    alignItems: 'center',
    paddingVertical: spacing.xl,
    gap: spacing.sm
  },
  heroEmoji: {
    fontSize: 44
  },
  categoryBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill
  },
  categoryText: {
    color: colors.surface,
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.ink,
    marginTop: spacing.xs
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: colors.muted
  },
  metaCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.lg,
    boxShadow: shadow.card
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between', // etiqueta ←→ valor
    alignItems: 'center'
  },
  metaLabel: {
    fontSize: 13,
    color: colors.muted, // gris: es el rótulo, no el dato
    fontWeight: '600'
  },
  metaValue: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.ink // oscuro: este SÍ es el dato
  },
  metaId: {
    fontSize: 12,
    color: colors.muted,
    /* Fuente monoespaciada para el id. Los identificadores se leen mejor en
       monoespaciada (todos los caracteres ocupan lo mismo, no confundís l con 1).
       El nombre de la fuente difiere por plataforma: iOS trae 'Courier',
       Android tiene un alias genérico 'monospace'. `Platform.OS` nos deja
       elegir en tiempo de ejecución. */
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace'
  },
  divider: {
    /* Una línea de 1px es simplemente un View de 1 de alto con color de fondo.
       En React Native no existe el <hr> — todo se construye con cajas. */
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.sm + 2
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: spacing.sm
  },
  description: {
    fontSize: 15,
    lineHeight: 23, // 15 × 1.53: este es el texto largo de la pantalla
    color: colors.ink
  },
  action: {
    borderRadius: radius.md,
    paddingVertical: spacing.md + 2,
    alignItems: 'center',
    marginTop: spacing.sm
  },
  actionDone: {
    backgroundColor: colors.success // verde: completar
  },
  actionUndo: {
    backgroundColor: colors.dark // oscuro neutro: reabrir no es "positivo"
  },
  actionDelete: {
    backgroundColor: colors.dangerSoft, // pastel, no rojo pleno
    marginTop: 0 // pegado al botón de arriba: el `gap` del padre ya separa
  },
  actionText: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.surface
  }
})
