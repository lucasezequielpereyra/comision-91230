import type { NavigatorScreenParams } from '@react-navigation/native'

// El detalle recibe SOLO el id: la tarea completa se busca en el store
// con useSelector. Así el detalle nunca queda con una "foto vieja" y
// cualquier cambio (toggle, delete) se refleja en todas las pantallas.
export type TaskStackParamList = {
  Tasks: undefined
  TaskDetail: {
    taskId: string
  }
}

export type ProfileStackParamList = {
  Profile: undefined
}

export type TabParamList = {
  TasksStack: NavigatorScreenParams<TaskStackParamList>
  ProfileStack: NavigatorScreenParams<ProfileStackParamList>
}
