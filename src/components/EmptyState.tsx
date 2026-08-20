import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { colors, spacing } from '../theme'
import type { TaskFilter } from '../features/tasks/tasksSlice'

type Props = {
  filter?: TaskFilter
}

// Con filtros globales, "lista vacía" puede significar dos cosas:
// no hay tareas, o no hay tareas EN ESTE filtro. El mensaje lo aclara.
const MESSAGES: Record<TaskFilter, { emoji: string; title: string; subtitle: string }> = {
  all: {
    emoji: '🗒️',
    title: '¡No tienes tareas pendientes!',
    subtitle: 'Empieza por crear una con el botón de abajo.'
  },
  pending: {
    emoji: '🎉',
    title: '¡Nada pendiente!',
    subtitle: 'Todas tus tareas están completadas.'
  },
  completed: {
    emoji: '💪',
    title: 'Todavía no completaste ninguna',
    subtitle: 'Marcá una tarea con el círculo para verla acá.'
  }
}

export default function EmptyState({ filter = 'all' }: Props) {
  const msg = MESSAGES[filter]
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>{msg.emoji}</Text>
      <Text style={styles.title}>{msg.title}</Text>
      <Text style={styles.subtitle}>{msg.subtitle}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: spacing.xxl * 2, // 64
    paddingHorizontal: spacing.xl,
    gap: spacing.sm
  },
  emoji: {
    fontSize: 48,
    marginBottom: spacing.sm
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.ink,
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 14,
    color: colors.muted,
    textAlign: 'center'
  }
})
