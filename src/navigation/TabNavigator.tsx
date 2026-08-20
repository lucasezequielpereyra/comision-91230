import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import ProfileStack from "./ProfileStack";
import TaskStack from "./TaskStack";
import Ionicons from "@react-native-vector-icons/ionicons";
import {colors} from "../theme/colors";
import { TabParamList } from "./types";

const Tab = createBottomTabNavigator<TabParamList>();

const TabNavigator = () => {
    return (
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={{
                    headerShown: false,
                    tabBarActiveTintColor: colors.primary,
                    tabBarInactiveTintColor: colors.muted,
                    tabBarShowLabel: false,
                }}
            >
                <Tab.Screen
                    name="TasksStack"
                    component={TaskStack}
                    options={{
                        tabBarIcon: ({color}) => <Ionicons 
                            name="checkmark-circle-outline" 
                            size={24}  
                            color={color}
                            />
                    }}
                />
                <Tab.Screen
                    name="ProfileStack"
                    component={ProfileStack}
                    options={{
                        tabBarIcon: ({color}) => <Ionicons 
                            name="person-outline" 
                            size={24}  
                            color={color}
                            />
                    }}
                />
            </Tab.Navigator>
        </NavigationContainer>    
    )
}

export default TabNavigator;