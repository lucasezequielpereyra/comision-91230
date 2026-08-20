import { configureStore } from '@reduxjs/toolkit'
import tasksReducer from '../features/tasks/tasksSlice'

export const store = configureStore({
  reducer: {
    tasks: tasksReducer
    // acá se irán sumando más slices (auth, ui, etc.) a medida que crezca la app
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
