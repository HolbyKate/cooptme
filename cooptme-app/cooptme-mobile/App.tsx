import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator, DrawerScreenProps } from '@react-navigation/drawer';
import { Home, Mail, Users, Calendar, MessageCircle, ScanLine } from 'lucide-react-native';
import { Link } from "expo-router";
import { NavigatorScreenParams } from '@react-navigation/native';

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
import ScanScreen from './src/screens/scanner/ScanScreen';

import 'react-native-gesture-handler';

// Types de navigation
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
  Profiles: { userId?: string; linkedInUrl?: string };
  Calendar: undefined;
  Chat: undefined;
  Scan: undefined;
};

export type DrawerParamList = {
  MainTabs: NavigatorScreenParams<TabParamList>;
  Events: undefined;
  ProfilesDrawer: undefined;
};

// Types des props pour les écrans du Drawer
type ProfilesScreenDrawerProps = DrawerScreenProps<DrawerParamList, 'ProfilesDrawer'>;
type EventsScreenDrawerProps = DrawerScreenProps<DrawerParamList, 'Events'>;
type TabNavigatorDrawerProps = DrawerScreenProps<DrawerParamList, 'MainTabs'>;

// Création des navigateurs
const RootStack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();
const Drawer = createDrawerNavigator<DrawerParamList>();

// Wrappers des composants avec les types corrects
const ProfilesScreenWrapper: React.FC<ProfilesScreenDrawerProps> = (props) => (
  <ProfilesScreen {...props} />
);

const EventsScreenWrapper: React.FC<EventsScreenDrawerProps> = (props) => (
  <EventsScreen {...props} />
);

// Tab Navigator avec types corrects
function TabNavigator({ navigation, route }: TabNavigatorDrawerProps) {
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

const TabNavigatorWrapper: React.FC<TabNavigatorDrawerProps> = (props) => (
  <TabNavigator {...props} />
);

// Drawer Navigator avec les wrappers
function DrawerNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Drawer.Screen
        name="MainTabs"
        component={TabNavigatorWrapper}
        options={{ title: 'Home' }}
      />
      <Drawer.Screen
        name="Events"
        component={EventsScreenWrapper}
      />
      <Drawer.Screen
        name="ProfilesDrawer"
        component={ProfilesScreenWrapper}
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

// App principal
export default function App() {
  return (
    <NavigationContainer>
      <RootStack.Navigator
        screenOptions={{
          headerShown: false
        }}
      >
        <RootStack.Screen name="AuthStack" component={AuthNavigator} />
        <RootStack.Screen name="AppStack" component={DrawerNavigator} />
        <RootStack.Screen name="ChatConversation" component={ChatConversationScreen} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}