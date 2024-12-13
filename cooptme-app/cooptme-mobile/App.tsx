<<<<<<< HEAD
=======
import React from 'react';
>>>>>>> 2d25150 (Add .gitignore and configuration files for project setup)
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
<<<<<<< HEAD
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false
        }}
      >
=======
      <Stack.Navigator screenOptions={{ headerShown: false }}>
>>>>>>> 2d25150 (Add .gitignore and configuration files for project setup)
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> 2d25150 (Add .gitignore and configuration files for project setup)
