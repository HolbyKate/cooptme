import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Video, ResizeMode } from "expo-av";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  Home,
  MessageCircle,
  Calendar,
  Scan,
  Users,
} from "lucide-react-native";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const Tab = createBottomTabNavigator();

// Composants placeholder pour les autres écrans
const ContactsScreen = () => (
  <View style={{ flex: 1 }}>
    <Text>Contacts</Text>
  </View>
);
const EventScreen = () => (
  <View style={{ flex: 1 }}>
    <Text>Events</Text>
  </View>
);
const ChatScreen = () => (
  <View style={{ flex: 1 }}>
    <Text>Chat</Text>
  </View>
);
const ScanScreen = () => (
  <View style={{ flex: 1 }}>
    <Text>Scan</Text>
  </View>
);

const CategoriesScreen = () => {
  const categories = [
    { id: 1, title: "Catégorie 1", color: "#FF8F66" },
    { id: 2, title: "Catégorie 2", color: "#4247BD" },
    { id: 3, title: "Catégorie 3", color: "#FF8F66" },
    { id: 4, title: "Catégorie 4", color: "#4247BD" },
    { id: 5, title: "Catégorie 5", color: "#FF8F66" },
    { id: 6, title: "Catégorie 6", color: "#4247BD" },
  ];

  return (
    <View style={styles.container}>
      {/* Logo en haut */}
      <View style={styles.logoContainer}>
        <Video
          style={styles.logo}
          source={require("../../assets/logo_bleu_video.mp4")}
          resizeMode={ResizeMode.CONTAIN}
          shouldPlay={true}
          isLooping={true}
          isMuted={true}
          useNativeControls={false}
        />
      </View>

      {/* Grille de catégories */}
      <View style={styles.categoriesGrid}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[styles.categoryBlock, { backgroundColor: category.color }]}
          >
            <Text style={styles.categoryText}>{category.title}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <StatusBar style="auto" />
    </View>
  );
};

// Composant principal avec la navigation par onglets
export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: "#4247BD",
        tabBarInactiveTintColor: "#9E9E9E",
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={CategoriesScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Contacts"
        component={ContactsScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Users color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Events"
        component={EventScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Calendar color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MessageCircle color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Scan"
        component={ScanScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Scan color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  logoContainer: {
    height: windowHeight * 0.15,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  logo: {
    width: windowWidth * 0.4,
    height: "100%",
  },
  categoriesGrid: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  categoryBlock: {
    width: windowWidth * 0.4,
    height: windowWidth * 0.4,
    margin: 10,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  categoryText: {
    fontFamily: "Quicksand-Bold",
    color: "#FFFFFF",
    fontSize: 16,
  },
  tabBar: {
    height: 60,
    paddingBottom: 5,
    paddingTop: 5,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
});
