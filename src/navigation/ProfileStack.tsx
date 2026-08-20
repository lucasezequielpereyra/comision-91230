import { createNativeStackNavigator } from '@react-navigation/native-stack'
import ProfileScreen from '../screens/profile/ProfileScreen'

import { ProfileStackParamList } from './types'

const Stack = createNativeStackNavigator<ProfileStackParamList>()

const ProfileStack = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}>
            <Stack.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    title:"Mi perfil"
                }}
            />
        </Stack.Navigator>
    )
}

export default ProfileStack