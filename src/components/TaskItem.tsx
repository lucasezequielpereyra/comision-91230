import React, { memo, useEffect } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { CATEGORIES, DUE_DATES, Task } from '../types'
import { colors, radius, shadow, spacing } from '../theme'

type Props = {
  task: Task
  onToggle: (id: string) => void
  onPress: (task: Task) => void
  onMountChange?: () => () => void
}

const TaskItem = memo(function TaskItem({ task, onToggle, onPress }: Props) {
 
  const cat = CATEGORIES[task.category]

  return (
    <TouchableOpacity
      style={[styles.card, task.completed && styles.cardCompleted]}
      onPress={() => onPress(task)}
      activeOpacity={0.75}
    >

      <TouchableOpacity
        style={[
          styles.checkbox,
          { borderColor: cat.color },
          task.completed && { backgroundColor: cat.color }
        ]}
        onPress={() => onToggle(task.id)}
        hitSlop={8}
      >
        {task.completed && <Text style={styles.checkmark}>✓</Text>}
      </TouchableOpacity>
      <View style={styles.body}>
        <Text
          style={[styles.title, task.completed && styles.titleCompleted]}
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

      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  )
})

export default TaskItem

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.lg,
    marginBottom: spacing.sm,
    boxShadow: shadow.card
  },
  cardCompleted: {
    opacity: 0.55
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: radius.pill, 
    borderWidth: 2,
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  checkmark: {
    color: colors.surface, 
    fontSize: 13,
    fontWeight: '800',
    lineHeight: 15
  },
  body: {

    flex: 1,
    gap: spacing.xs
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.ink
  },
  titleCompleted: {
    textDecorationLine: 'line-through', 
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
    marginTop: -2
  }
})