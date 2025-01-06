import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  createDrawerNavigator,
  DrawerScreenProps,
} from "@react-navigation/drawer";
import {
  Home,
  Mail,
  Users,
  Calendar,
  MessageCircle,
  ScanLine,
} from "lucide-react-native";
import { NavigatorScreenParams } from "@react-navigation/native";
import { AuthProvider } from './src/contexts/AuthContext';

// Import screens
import HomeScreen from "./src/screens/HomeScreen";
import LoginScreen from "./src/screens/LoginScreen";
import DashboardScreen from "./src/screens/DashboardScreen";
import EventsScreen from "./src/screens/EventsScreen";
import CalendarScreen from "./src/screens/CalendarScreen";
import ChatScreen from "./src/screens/ChatScreen";
import ChatConversationScreen from "./src/screens/ChatConversationScreen";
import ContactsScreen from "./src/screens/ContactsScreen";
import ProfilesScreen from "./src/screens/ProfilesScreen";
import ProfileDetailScreen from "./src/screens/ProfileDetailScreen";
import ScanScreen from "./src/screens/scanner/ScanScreen";
import TestScreen from "./src/screens/scanner/TestScreen";
import { Contact } from "./src/screens/ProfileGenerator";

import "react-native-gesture-handler";

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
  ProfileDetail: { contact: Contact };
  Calendar: undefined;
  Chat: undefined;
  Scan: undefined;
  Test: undefined;
};

export type DrawerParamList = {
  MainTabs: NavigatorScreenParams<TabParamList>;
  Events: undefined;
  ProfilesDrawer: TabParamList["Profiles"];
};

type TabScreenProps<T extends keyof TabParamList> = {
  navigation: any;
  route: { name: T; params?: TabParamList[T] };
};

type ProfilesScreenDrawerProps = DrawerScreenProps<DrawerParamList, "ProfilesDrawer">;
type EventsScreenDrawerProps = DrawerScreenProps<DrawerParamList, "Events">;
type TabNavigatorDrawerProps = DrawerScreenProps<DrawerParamList, "MainTabs">;

const RootStack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();
const Drawer = createDrawerNavigator<DrawerParamList>();

const DashboardScreenWrapper: React.FC<TabScreenProps<"Dashboard">> = (props) => 
  <DashboardScreen {...(props as any)} />;

const ContactsScreenWrapper: React.FC<TabScreenProps<"Contacts">> = (props) => 
  <ContactsScreen {...(props as any)} />;

const ProfilesTabScreenWrapper: React.FC<TabScreenProps<"Profiles">> = (props) => 
  <ProfilesScreen {...(props as any)} />;

const ProfileDetailScreenWrapper: React.FC<TabScreenProps<"ProfileDetail">> = (props) =>
  <ProfileDetailScreen {...(props as any)} />;

const CalendarScreenWrapper: React.FC<TabScreenProps<"Calendar">> = (props) => 
  <CalendarScreen {...(props as any)} />;

const ChatScreenWrapper: React.FC<TabScreenProps<"Chat">> = (props) => 
  <ChatScreen {...(props as any)} />;

const ScanScreenWrapper: React.FC<TabScreenProps<"Scan">> = (props) => 
  <ScanScreen {...(props as any)} />;

const TestScreenWrapper: React.FC<TabScreenProps<"Test">> = (props) =>
  <TestScreen {...(props as any)} />;

function TabNavigator({ navigation, route }: TabNavigatorDrawerProps) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          switch (route.name) {
            case "Dashboard": return <Home color={color} size={size} />;
            case "Contacts": return <Mail color={color} size={size} />;
            case "Profiles": return <Users color={color} size={size} />;
            case "Calendar": return <Calendar color={color} size={size} />;
            case "Chat": return <MessageCircle color={color} size={size} />;
            case "Scan": return <ScanLine color={color} size={size} />;
            case "Test": return <Users color={color} size={size} />;
            default: return null;
          }
        },
        tabBarActiveTintColor: "#4247BD",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          height: 60,
          paddingBottom: 5,
          paddingTop: 5,
        },
        tabBarLabelStyle: {
          fontFamily: "Quicksand-Medium",
          fontSize: 12,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreenWrapper as any} />
      <Tab.Screen name="Contacts" component={ContactsScreenWrapper as any} />
      <Tab.Screen name="Profiles" component={ProfilesTabScreenWrapper as any} />
      <Tab.Screen name="Calendar" component={CalendarScreenWrapper as any} />
      <Tab.Screen name="Chat" component={ChatScreenWrapper as any} />
      <Tab.Screen name="Scan" component={ScanScreenWrapper as any} />
      <Tab.Screen name="Test" component={TestScreenWrapper as any} />
      <Tab.Screen
        name="ProfileDetail"
        component={ProfileDetailScreenWrapper as any}
        options={{
          tabBarButton: () => null,
          tabBarStyle: { display: 'none' },
        }}
      />
    </Tab.Navigator>
  );
}

const EventsScreenWrapper: React.FC<EventsScreenDrawerProps> = (props) =>
  <EventsScreen {...(props as any)} />;

const ProfilesDrawerScreenWrapper: React.FC<ProfilesScreenDrawerProps> = (props) =>
  <ProfilesScreen {...(props as any)} />;

const TabNavigatorWrapper: React.FC<TabNavigatorDrawerProps> = (props) =>
  <TabNavigator {...props} />;

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
        options={{ title: "Home" }}
      />
      <Drawer.Screen name="Events" component={EventsScreenWrapper} />
      <Drawer.Screen
        name="ProfilesDrawer"
        component={ProfilesDrawerScreenWrapper}
        options={{ title: "Profiles" }}
      />
    </Drawer.Navigator>
  );
}

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
      <AuthProvider>
        <RootStack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          <RootStack.Screen name="AuthStack" component={AuthNavigator} />
          <RootStack.Screen name="AppStack" component={DrawerNavigator} />
          <RootStack.Screen
            name="ChatConversation"
            component={ChatConversationScreen}
          />
        </RootStack.Navigator>
      </AuthProvider>
    </NavigationContainer>
  );
}