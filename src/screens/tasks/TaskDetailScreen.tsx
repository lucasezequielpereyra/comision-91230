import React from 'react'
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { CATEGORIES, DUE_DATES } from '../../types'
import { colors, radius, shadow, spacing, screenStyles } from '../../theme'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { TaskStackParamList } from '../../navigation/types'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { deleteTask, selectTaskById, toggleTaskStatus } from '../../features/tasks/tasksSlice'

type Props = NativeStackScreenProps<TaskStackParamList, 'TaskDetail'>

export default function TaskDetailScreen({ navigation, route }: Props) {
  const { taskId } = route.params
  const dispatch = useAppDispatch()

  // La tarea se lee del store: si se completa o edita desde otra pantalla,
  // este detalle se re-renderiza solo con el dato fresco.
  const task = useAppSelector(selectTaskById(taskId))

  // Si la tarea fue eliminada mientras el detalle estaba abierto,
  // mostramos un estado de salida en lugar de romper.
  if (!task) {
    return (
      <View style={[screenStyles.container, styles.missing]}>
        <Text style={styles.missingEmoji}>🗑️</Text>
        <Text style={styles.missingTitle}>Esta tarea ya no existe</Text>
        <TouchableOpacity style={[styles.action, styles.actionDone]} onPress={() => navigation.goBack()}>
          <Text style={styles.actionText}>Volver a la lista</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const cat = CATEGORIES[task.category]

  const handleToggle = () => {
    dispatch(toggleTaskStatus(task.id))
  }

  const handleDelete = () => {
    dispatch(deleteTask(task.id))
    navigation.goBack()
  }

  return (
    <View style={screenStyles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} hitSlop={8}>
        <Text style={styles.backText}>‹ Volver a la lista</Text>
      </TouchableOpacity>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.hero, { backgroundColor: cat.soft }]}>
          <Text style={styles.heroEmoji}>{cat.emoji}</Text>
          <View style={[styles.categoryBadge, { backgroundColor: cat.color }]}>
            <Text style={styles.categoryText}>{cat.label}</Text>
          </View>
        </View>
        <Text style={[styles.title, task.completed && styles.titleCompleted]}>{task.title}</Text>
        <View style={styles.metaCard}>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Estado</Text>
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
        <Text style={styles.description}>
          {task.description ||
            'Esta tarea no tiene descripción. Podés agregarla desde el formulario al crear la próxima.'}
        </Text>
        <TouchableOpacity
          style={[styles.action, task.completed ? styles.actionUndo : styles.actionDone]}
          onPress={handleToggle}
          activeOpacity={0.85}
        >
          <Text style={styles.actionText}>
            {task.completed ? 'Marcar como pendiente' : 'Marcar como completada ✓'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.action, styles.actionDelete]}
          onPress={handleDelete}
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
    alignSelf: 'flex-start'
  },
  backText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary
  },
  content: {
    gap: spacing.md,
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
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  metaLabel: {
    fontSize: 13,
    color: colors.muted,
    fontWeight: '600'
  },
  metaValue: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.ink
  },
  metaId: {
    fontSize: 12,
    color: colors.muted,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace'
  },
  divider: {
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
    lineHeight: 23,
    color: colors.ink
  },
  missing: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  missingEmoji: {
    fontSize: 48
  },
  missingTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.ink
  },
  action: {
    borderRadius: radius.md,
    paddingVertical: spacing.md + 2,
    alignItems: 'center',
    marginTop: spacing.sm
  },
  actionDone: {
    backgroundColor: colors.success
  },
  actionUndo: {
    backgroundColor: colors.dark
  },
  actionDelete: {
    backgroundColor: colors.dangerSoft,
    marginTop: 0
  },
  actionText: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.surface
  }
})