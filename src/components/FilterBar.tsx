import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { colors, radius, spacing } from '../theme'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { FILTERS, selectFilter, setFilter, TaskFilter } from '../features/tasks/tasksSlice'

const FILTER_KEYS = Object.keys(FILTERS) as TaskFilter[]

// El filtro vive en el store, no en un useState de la pantalla:
// por eso sobrevive a la navegación entre tabs y stacks.
export default function FilterBar() {
  const dispatch = useAppDispatch()
  const active = useAppSelector(selectFilter)

  return (
    <View style={styles.row}>
      {FILTER_KEYS.map((key) => {
        const isActive = active === key
        return (
          <TouchableOpacity
            key={key}
            style={[styles.chip, isActive && styles.chipActive]}
            onPress={() => dispatch(setFilter(key))}
            activeOpacity={0.8}
          >
            <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
              {FILTERS[key]}
            </Text>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.sm
  },
  chip: {
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2
  },
  chipActive: {
    backgroundColor: colors.dark,
    borderColor: colors.dark
  },
  chipText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.ink
  },
  chipTextActive: {
    color: colors.surface
  }
})
