import React from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import { colors, radius, shadow, spacing, screenStyles } from '../../theme'
import { useAppSelector } from '../../store/hooks'
import { FILTERS, selectFilter, selectTaskStats } from '../../features/tasks/tasksSlice'
import { name } from '../../data'

const avatar = require('../../assets/avatar.webp')

// Esta pantalla vive en OTRO tab y sin embargo lee el mismo store:
// completá una tarea en la lista y mirá cómo estos números se
// actualizan solos. Eso es el estado global en acción.
const ProfileScreen = () => {
  const { total, completed, pending } = useAppSelector(selectTaskStats)
  const filter = useAppSelector(selectFilter)
  const progress = total === 0 ? 0 : Math.round((completed / total) * 100)

  return (
    <View style={screenStyles.container}>
      <View style={styles.card}>
        <Image source={avatar} style={styles.avatar} />
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.role}>Estudiante de Desarrollo de Apps</Text>
      </View>

      <Text style={styles.sectionLabel}>Mis números (en vivo, desde el store)</Text>
      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{total}</Text>
          <Text style={styles.statLabel}>Tareas</Text>
        </View>
        <View style={styles.stat}>
          <Text style={[styles.statValue, { color: colors.primary }]}>{pending}</Text>
          <Text style={styles.statLabel}>Pendientes</Text>
        </View>
        <View style={styles.stat}>
          <Text style={[styles.statValue, { color: colors.success }]}>{completed}</Text>
          <Text style={styles.statLabel}>Completadas</Text>
        </View>
      </View>

      <View style={styles.progressCard}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>Progreso general</Text>
          <Text style={styles.progressValue}>{progress}%</Text>
        </View>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.filterNote}>
          Filtro activo en la lista: <Text style={styles.filterValue}>{FILTERS[filter]}</Text>
        </Text>
      </View>
    </View>
  )
}

export default ProfileScreen

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.xs,
    boxShadow: shadow.card
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    marginBottom: spacing.sm
  },
  name: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.ink
  },
  role: {
    fontSize: 14,
    color: colors.muted
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md
  },
  stat: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    gap: spacing.xs,
    boxShadow: shadow.card
  },
  statValue: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.ink
  },
  statLabel: {
    fontSize: 12,
    color: colors.muted,
    fontWeight: '600'
  },
  progressCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.lg,
    gap: spacing.sm,
    boxShadow: shadow.card
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  progressLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.ink
  },
  progressValue: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.success
  },
  progressTrack: {
    height: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.border,
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    borderRadius: radius.pill,
    backgroundColor: colors.success
  },
  filterNote: {
    fontSize: 12,
    color: colors.muted,
    marginTop: spacing.xs
  },
  filterValue: {
    fontWeight: '800',
    color: colors.ink
  }
})
