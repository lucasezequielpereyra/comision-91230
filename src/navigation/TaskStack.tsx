import { createNativeStackNavigator } from '@react-navigation/native-stack'

import TasksScreen from '../screens/tasks/TasksScreen'
import TaskDetailScreen from '../screens/tasks/TaskDetailScreen'

import {RootStackParamList} from './types'

const Stack = createNativeStackNavigator<RootStackParamList>()

const TaskStack = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}>
            <Stack.Screen
                name="Tasks"
                component={TasksScreen}
                options={{
                    title:"Mis tareas"
                }}
            />
            <Stack.Screen
                name="TaskDetail"
                component={TaskDetailScreen}
                options={{
                    title:"Detalles de la tarea"
                }}
            />
        </Stack.Navigator>
    )
}

export default TaskStack