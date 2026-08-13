
import { useCallback, useState } from 'react'
import { View, Text, FlatList, StyleSheet } from 'react-native'
import { Task } from '../../types'
import { spacing, colors, screenStyles } from '../../theme'
import TaskItem from '../../components/TaskItem'
import EmptyState from '../../components/EmptyState'
import { SEED_TASKS } from "../../data/seed";
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../navigation/types'
import TaskForm from '../../components/TaskForm'


type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Tasks'
>

const keyExtractor = (item: Task) => item.id

const TasksScreen = ({ navigation }: { navigation: NavigationProp }) => {
  const [tasks, setTasks] = useState<Task[]>(SEED_TASKS);
  const pending = tasks.filter((t) => !t.completed).length

  const addTask = useCallback((task: Task) => {
    setTasks((prev) => [task, ...prev]);
  }, []);

  const toggleTask = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  }, []);

  const openDetail = useCallback(
    (task: Task) => {
      navigation.navigate("TaskDetail", { task });
    },
    [navigation],
  );

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
          <Text style={styles.appSubtitle}>Listas, formulario y detalle</Text>
        </View>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Mis tareas</Text>
          <View style={styles.counter}>
            <Text style={styles.counterText}>{pending}</Text>
          </View>
        </View>
        <Text style={styles.subtitle}>
          {pending === 0 && tasks.length > 0
            ? '¡Todo completado! 🎉'
            : 'Tocá una tarea para ver su detalle'}
        </Text>
      </View>
      <FlatList
        data={tasks}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<EmptyState />}
        initialNumToRender={8}
        windowSize={7}
        maxToRenderPerBatch={8}
      />

      <TaskForm onAdd={addTask} />
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