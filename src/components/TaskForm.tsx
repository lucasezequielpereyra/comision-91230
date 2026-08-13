import React, { useState } from 'react'
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { CATEGORIES, Category, createId, DueDate, DUE_DATES, Task } from '../types'
import { colors, radius, shadow, spacing } from '../theme'

type Props = {
  onAdd: (task: Task) => void
}

const CATEGORY_KEYS = Object.keys(CATEGORIES) as Category[]
const DATE_KEYS = Object.keys(DUE_DATES) as DueDate[]

export default function TaskForm({ onAdd }: Props) {
  const insets = useSafeAreaInsets()
  const [open, setOpen] = useState(false)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<Category>('personal')
  const [date, setDate] = useState<DueDate>('today')

  const canSubmit = title.trim().length > 0 && description.trim().length > 0
  const close = () => setOpen(false)

  const handleSubmit = () => {
    if (!canSubmit) return
    onAdd({
      id: createId(),
      title: title.trim(),
      description: description.trim(),
      category,
      date,
      completed: false
    })
    setTitle('')
    setDescription('')
    setCategory('personal')
    setDate('today')
    close()
  }

  return (

    <>
      <TouchableOpacity style={styles.fabRow} onPress={() => setOpen(true)} activeOpacity={0.8}>
        <Text style={styles.fabPlus}>＋</Text>
        <Text style={styles.fabText}>Nueva tarea</Text>
      </TouchableOpacity>
      <Modal
        visible={open}
        transparent
        animationType="slide"
        onRequestClose={close}
      >
        <KeyboardAvoidingView
          style={styles.overlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <Pressable style={styles.backdrop} onPress={close} />
          <View style={[styles.sheet, { paddingBottom: spacing.lg + insets.bottom }]}>
            <View style={styles.grabber} />

            <View style={styles.headerRow}>
              <Text style={styles.heading}>Nueva tarea</Text>
              <TouchableOpacity onPress={close} hitSlop={8}>
                <Text style={styles.close}>✕</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="¿Qué hay que hacer?"
              placeholderTextColor={colors.muted}
              value={title}
              onChangeText={setTitle}
              autoFocus
              returnKeyType="next"
            />
            <TextInput
              style={[styles.input, styles.textarea]}
              placeholder="Descripción de la tarea"
              placeholderTextColor={colors.muted}
              value={description}
              onChangeText={setDescription}
              multiline
            />
            <Text style={styles.label}>Categoría</Text>
            <View style={styles.chipRow}>
              {CATEGORY_KEYS.map((key) => {
                const cat = CATEGORIES[key]
                const active = category === key

                return (
                  <TouchableOpacity
                    key={key} 
                    style={[
                      styles.chip,
                      { borderColor: cat.color },
                      active && { backgroundColor: cat.color }
                    ]}
                    onPress={() => setCategory(key)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        { color: active ? colors.surface : cat.color }
                      ]}
                    >
                      {cat.emoji} {cat.label}
                    </Text>
                  </TouchableOpacity>
                )
              })}
            </View>
            <Text style={styles.label}>¿Para cuándo?</Text>
            <View style={styles.chipRow}>
              {DATE_KEYS.map((key) => {
                const active = date === key
                return (
                  <TouchableOpacity
                    key={key}
                    style={[styles.chip, styles.chipNeutral, active && styles.chipNeutralActive]}
                    onPress={() => setDate(key)}
                  >
                    <Text style={[styles.chipText, { color: active ? colors.surface : colors.ink }]}>
                      {DUE_DATES[key]}
                    </Text>
                  </TouchableOpacity>
                )
              })}
            </View>
            <TouchableOpacity
              style={[styles.submit, !canSubmit && styles.submitDisabled]}
              onPress={handleSubmit}
              disabled={!canSubmit}
              activeOpacity={0.85}
            >
              <Text style={styles.submitText}>Agregar tarea</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  fabRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    paddingVertical: spacing.md + 2,
    boxShadow: shadow.raised
  },
  fabPlus: {
    color: colors.surface,
    fontSize: 18,
    fontWeight: '800'
  },
  fabText: {
    color: colors.surface,
    fontSize: 15,
    fontWeight: '800'
  },

  overlay: {
    flex: 1, 
    justifyContent: 'flex-end'
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(42, 16, 8, 0.45)'
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.lg + 8,
    borderTopRightRadius: radius.lg + 8,
    padding: spacing.lg,
    gap: spacing.sm,
    boxShadow: '0px -6px 24px rgba(42, 16, 8, 0.18)'
  },
  grabber: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.border,
    marginBottom: spacing.xs
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  heading: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.ink
  },
  close: {
    fontSize: 16,
    color: colors.muted,
    fontWeight: '700'
  },

  input: {
    backgroundColor: colors.canvas,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    fontSize: 14,
    color: colors.ink
  },
  textarea: {
    minHeight: 64,
    textAlignVertical: 'top'
  },
  label: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: spacing.xs
  },

  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm
  },
  chip: {
    borderWidth: 1.5,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2
  },
  chipNeutral: {
    borderColor: colors.border,
    backgroundColor: colors.canvas
  },
  chipNeutralActive: {
    backgroundColor: colors.dark,
    borderColor: colors.dark
  },
  chipText: {
    fontSize: 13,
    fontWeight: '700'
  },
  submit: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.sm
  },
  submitDisabled: {
    opacity: 0.4
  },
  submitText: {
    color: colors.surface,
    fontSize: 15,
    fontWeight: '800'
  }
})