import { useCallback, useEffect } from 'react'
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
  setTasks
} from '../../features/tasks/tasksSlice'

import { selectCurrentUser } from '../../features/auth/authSlice'

import {
  subscribeToTasks,
  updateTaskStatus
} from '../../services/tasks/tasksService'

type Props = NativeStackScreenProps<TaskStackParamList, 'Tasks'>

const keyExtractor = (item: Task) => item.id

const TasksScreen = ({ navigation }: Props) => {
  const dispatch = useAppDispatch()

  const user = useAppSelector(selectCurrentUser)

  const tasks = useAppSelector(selectVisibleTasks)
  const filter = useAppSelector(selectFilter)
  const { pending, total } = useAppSelector(selectTaskStats)

  useEffect(() => {
    if (!user) return

    const unsubscribe = subscribeToTasks(
      user.uid,
      (tasks) => {
        dispatch(setTasks(tasks))
      }
    )

    return unsubscribe
  }, [user, dispatch])

  const toggleTask = useCallback(
    async (id: string) => {
      const task = tasks.find((task) => task.id === id)

      if (!task) return

      try {
        await updateTaskStatus(
          task.id,
          !task.completed
        )
      } catch (error) {
        console.error(
          'Error al actualizar tarea:',
          error
        )
      }
    },
    [tasks]
  )

  const openDetail = useCallback(
    (task: Task) => {
      navigation.navigate('TaskDetail', {
        taskId: task.id
      })
    },
    [navigation]
  )

  const renderItem = useCallback(
    ({ item }: { item: Task }) => {
      return (
        <TaskItem
          task={item}
          onToggle={toggleTask}
          onPress={openDetail}
        />
      )
    },
    [toggleTask, openDetail]
  )

  return (
    <View style={screenStyles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.brand}>TaskFlow</Text>

          <Text style={styles.appSubtitle}>
            Estado global con Redux Toolkit
          </Text>
        </View>

        <View style={styles.titleRow}>
          <Text style={styles.title}>
            Mis tareas
          </Text>

          <View style={styles.counter}>
            <Text style={styles.counterText}>
              {pending}
            </Text>
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
        ListEmptyComponent={
          <EmptyState filter={filter} />
        }
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
    fontWeight: '900',
    color: colors.ink,
    letterSpacing: -0.5
  },

  appSubtitle: {
    fontSize: 14,
    color: colors.muted,
    marginTop: spacing.xs
  }
})

export default TasksScreen