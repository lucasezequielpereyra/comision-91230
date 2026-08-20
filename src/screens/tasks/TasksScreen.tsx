import { useCallback } from 'react'
import { View, Text, FlatList, StyleSheet } from 'react-native'
import { Task } from '../../types'
import { spacing, colors, screenStyles } from '../../theme'
import TaskItem from '../../components/TaskItem'
import EmptyState from '../../components/EmptyState'
import FilterBar from '../../components/FilterBar'
import TaskForm from '../../components/TaskForm'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { TaskStackParamList } from '../../navigation/types'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import {
  selectFilter,
  selectTaskStats,
  selectVisibleTasks,
  toggleTaskStatus
} from '../../features/tasks/tasksSlice'

type Props = NativeStackScreenProps<TaskStackParamList, 'Tasks'>

const keyExtractor = (item: Task) => item.id

const TasksScreen = ({ navigation }: Props) => {
  const dispatch = useAppDispatch()

  // La pantalla ya no es dueña de las tareas: las lee del store.
  const tasks = useAppSelector(selectVisibleTasks)
  const filter = useAppSelector(selectFilter)
  const { pending, total } = useAppSelector(selectTaskStats)

  const toggleTask = useCallback(
    (id: string) => {
      dispatch(toggleTaskStatus(id))
    },
    [dispatch]
  )

  const openDetail = useCallback(
    (task: Task) => {
      // Pasamos solo el id: el detalle busca la tarea en el store,
      // así nunca navega con una "foto vieja" del objeto.
      navigation.navigate('TaskDetail', { taskId: task.id })
    },
    [navigation]
  )

  const renderItem = useCallback(
    ({ item }: { item: Task }) => {
      return (
        <TaskItem task={item} onToggle={toggleTask} onPress={openDetail} />
      )
    },
    [toggleTask, openDetail]
  )

  return (
    <View style={screenStyles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.brand}>TaskFlow</Text>
          <Text style={styles.appSubtitle}>Estado global con Redux Toolkit</Text>
        </View>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Mis tareas</Text>
          <View style={styles.counter}>
            <Text style={styles.counterText}>{pending}</Text>
          </View>
        </View>
        <Text style={styles.subtitle}>
          {pending === 0 && total > 0
            ? '¡Todo completado! 🎉'
            : 'Tocá una tarea para ver su detalle'}
        </Text>
        <FilterBar />
      </View>
      <FlatList
        data={tasks}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<EmptyState filter={filter} />}
        initialNumToRender={8}
        windowSize={7}
        maxToRenderPerBatch={8}
      />

      <TaskForm />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: spacing.lg
  },
  header: {
    gap: spacing.sm
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.ink
  },
  counter: {
    backgroundColor: colors.primarySoft,
    minWidth: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm
  },
  counterText: {
    color: colors.primary,
    fontWeight: '800',
    fontSize: 15
  },
  subtitle: {
    fontSize: 14,
    color: colors.muted
  },
  listContent: {
    paddingBottom: spacing.xl,
    flexGrow: 1
  },
  brand: {
    fontSize: 24,
    fontWeight: "900",
    color: colors.ink,
    letterSpacing: -0.5,
  },

  appSubtitle: {
    fontSize: 14,
    color: colors.muted,
    marginTop: spacing.xs,
  },
})

export default TasksScreen