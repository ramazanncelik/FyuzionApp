import * as React from 'react';
import { useColorScheme } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import IconFA5 from 'react-native-vector-icons/FontAwesome5'
import IconMCI from 'react-native-vector-icons/MaterialCommunityIcons'
import IconII from 'react-native-vector-icons/Ionicons'
import Login from '../screens/Auth/Login';
import SignUp from '../screens/Auth/SignUp';
import ResetPassword from '../screens/Auth/ResetPassword';

const Tab = createBottomTabNavigator();

export default function App() {

    const isDarkMode = useColorScheme() === 'dark';

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    if (route.name === 'Login') {
                        return <IconMCI name='login' size={size} color={color} />;
                    } else if (route.name === 'SignUp') {
                        return <IconII name='md-person-add-sharp' size={size} color={color} />;
                    } else if (route.name === 'ResetPassword') {
                        return <IconMCI name='lock-reset' size={size} color={color} />;
                    }
                },
                tabBarActiveTintColor: '#f97316',
                tabBarInactiveTintColor: 'gray',
                tabBarStyle: {
                    backgroundColor: isDarkMode ? "#374151" : "white",
                },
            })}>
            <Tab.Screen name="Login" component={Login} options={{ headerShown: false, tabBarShowLabel: false }} />
            <Tab.Screen name="SignUp" component={SignUp} options={{ headerShown: false, tabBarShowLabel: false }} />
            <Tab.Screen name="ResetPassword" component={ResetPassword} options={{ headerShown: false, tabBarShowLabel: false }} />
        </Tab.Navigator>
    );
}