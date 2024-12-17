import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Home, Mail, Users, Calendar, MessageCircle, ScanLine } from 'lucide-react-native';

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import EventsScreen from './src/screens/EventsScreen';
import CalendarScreen from './src/screens/CalendarScreen';
import ChatScreen from './src/screens/ChatScreen';
import ChatConversationScreen from './src/screens/ChatConversationScreen';
import ContactsScreen from './src/screens/ContactsScreen';
import ProfilesScreen from './src/screens/ProfilesScreen';
import ScanScreen from './src/screens/ScanScreen';

import 'react-native-gesture-handler';

// Types
export type RootStackParamList = {
  AuthStack: undefined;
  AppStack: undefined;
  ChatConversation: {
    chatId: string;
    name: string;
  };
};

export type AuthStackParamList = {
  Home: undefined;
  Login: undefined;
};

export type TabParamList = {
  Dashboard: undefined;
  Contacts: undefined;
  Profiles: { userId?: string };
  Calendar: undefined;
  Chat: undefined;
  Scan: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();
const Drawer = createDrawerNavigator();

// Tab Navigator
function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          switch (route.name) {
            case 'Dashboard':
              return <Home color={color} size={size} />;
            case 'Contacts':
              return <Mail color={color} size={size} />;
            case 'Profiles':
              return <Users color={color} size={size} />;
            case 'Calendar':
              return <Calendar color={color} size={size} />;
            case 'Chat':
              return <MessageCircle color={color} size={size} />;
            case 'Scan':
              return <ScanLine color={color} size={size} />;
          }
        },
        tabBarActiveTintColor: '#4247BD',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          height: 60,
          paddingBottom: 5,
          paddingTop: 5,
        },
        tabBarLabelStyle: {
          fontFamily: 'Quicksand-Medium',
          fontSize: 12,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Contacts" component={ContactsScreen} />
      <Tab.Screen name="Profiles" component={ProfilesScreen} />
      <Tab.Screen name="Calendar" component={CalendarScreen} />
      <Tab.Screen name="Chat" component={ChatScreen} />
      <Tab.Screen name="Scan" component={ScanScreen} />
    </Tab.Navigator>
  );
}

// Drawer Navigator
function DrawerNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Drawer.Screen 
        name="MainTabs" 
        component={TabNavigator}
        options={{ title: 'Home' }}
      />
      <Drawer.Screen name="Events" component={EventsScreen} />
      <Drawer.Screen 
        name="ProfilesDrawer" 
        component={ProfilesScreen}
        options={{ title: 'Profiles' }}
      />
    </Drawer.Navigator>
  );
}

// Auth Navigator
function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Home" component={HomeScreen} />
      <AuthStack.Screen name="Login" component={LoginScreen} />
    </AuthStack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false
        }}
      >
        <Stack.Screen name="AuthStack" component={AuthNavigator} />
        <Stack.Screen name="AppStack" component={DrawerNavigator} />
        <Stack.Screen name="ChatConversation" component={ChatConversationScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}