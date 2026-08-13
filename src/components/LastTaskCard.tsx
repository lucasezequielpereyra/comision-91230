
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { CATEGORIES, DUE_DATES, Task } from '../types'
import { colors, radius, shadow, spacing } from '../theme'

type Props = {
  task: Task
}

export default function LastTaskCard({ task }: Props) {

  const cat = CATEGORIES[task.category]

  return (
    <View style={styles.card}>
      <View style={styles.metaRow}>
        <View style={[styles.badge, { backgroundColor: cat.soft }]}>
          <Text style={[styles.badgeText, { color: cat.color }]}>
            {cat.emoji} {cat.label}
          </Text>
        </View>
        <Text style={styles.date}>{DUE_DATES[task.date]}</Text>
      </View>

      <Text style={styles.title}>{task.title}</Text>
      {task.description.length > 0 && <Text style={styles.description}>{task.description}</Text>}
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
    gap: spacing.sm, 
    boxShadow: shadow.card
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  badge: {
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs
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
    lineHeight: 20,
    color: colors.muted
  },
  id: {
    fontSize: 11,
    color: colors.muted,
    opacity: 0.7
  }
})