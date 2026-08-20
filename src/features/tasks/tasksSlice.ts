import { createSelector, createSlice, nanoid, type PayloadAction } from '@reduxjs/toolkit'
import type { Task } from '../../types'
import { SEED_TASKS } from '../../data/seed'
import type { RootState } from '../../store'

export type TaskFilter = 'all' | 'pending' | 'completed'

export const FILTERS: Record<TaskFilter, string> = {
  all: 'Todas',
  pending: 'Pendientes',
  completed: 'Completadas'
}

// Lo que el formulario aporta para crear una tarea: el id y el completed
// los pone la acción, no el componente.
export type NewTaskInput = Omit<Task, 'id' | 'completed'>

type TasksState = {
  items: Task[]
  filter: TaskFilter
}

const initialState: TasksState = {
  items: SEED_TASKS,
  filter: 'all'
}

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    // prepare genera el id único FUERA del reducer: los reducers son
    // funciones puras y no pueden producir valores aleatorios.
    addTask: {
      prepare: (input: NewTaskInput) => ({
        payload: { id: nanoid(), completed: false, ...input } as Task
      }),
      reducer: (state, action: PayloadAction<Task>) => {
        state.items.unshift(action.payload)
      }
    },
    toggleTaskStatus: (state, action: PayloadAction<string>) => {
      const task = state.items.find((t) => t.id === action.payload)
      if (task) {
        task.completed = !task.completed
      }
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((t) => t.id !== action.payload)
    },
    setFilter: (state, action: PayloadAction<TaskFilter>) => {
      state.filter = action.payload
    }
  }
})

export const { addTask, toggleTaskStatus, deleteTask, setFilter } = tasksSlice.actions
export default tasksSlice.reducer

// ── Selectores ───────────────────────────────────────────────────────────
// Cada pantalla lee del store SOLO lo que necesita a través de estos.

export const selectAllTasks = (state: RootState) => state.tasks.items
export const selectFilter = (state: RootState) => state.tasks.filter

export const selectTaskById = (id: string) => (state: RootState) =>
  state.tasks.items.find((t) => t.id === id)

// createSelector memoiza: la lista filtrada solo se recalcula cuando
// cambian items o filter, evitando re-renders por referencias nuevas.
export const selectVisibleTasks = createSelector(
  [selectAllTasks, selectFilter],
  (items, filter) => {
    switch (filter) {
      case 'pending':
        return items.filter((t) => !t.completed)
      case 'completed':
        return items.filter((t) => t.completed)
      default:
        return items
    }
  }
)

export const selectTaskStats = createSelector([selectAllTasks], (items) => {
  const completed = items.filter((t) => t.completed).length
  return { total: items.length, completed, pending: items.length - completed }
})
