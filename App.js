import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import DashboardScreen from './screens/DashboardScreen';
import ChatScreen from './screens/ChatScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Driver Login' }} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'Airport Queue Union' }} />
        <Stack.Screen name="Chat" component={ChatScreen} options={{ title: 'Secret Discussion' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
