import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import EventsScreen from './src/screens/EventsScreen';
import CalendarScreen from './src/screens/CalendarScreen';
import ChatScreen from './src/screens/ChatScreen';
import ChatConversationScreen from './src/screens/ChatConversationScreen';
import ContactsScreen from './src/screens/ContactsScreen';
import ProfilesScreen from './src/screens/ProfilesScreen';
import ScanScreen from './src/screens/ScanScreen';

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Events: undefined;
  Calendar: undefined;
  Chat: undefined;
  ChatConversation: {
    chatId: string;
    name: string;
  };
  Contacts: undefined;
  Profiles: {
    userId?: string;
  };
  Scan: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Events" component={EventsScreen} />
        <Stack.Screen name="Calendar" component={CalendarScreen} />
        <Stack.Screen name="Chat" component={ChatScreen} />
        <Stack.Screen name="ChatConversation" component={ChatConversationScreen} />
        <Stack.Screen name="Contacts" component={ContactsScreen} />
        <Stack.Screen name="Profiles" component={ProfilesScreen} />
        <Stack.Screen name="Scan" component={ScanScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}