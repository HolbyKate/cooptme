import React, { useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Animated,
} from "react-native";
import { Video, ResizeMode } from 'expo-av';
import QRCode from "react-native-qrcode-svg";
import * as Linking from "expo-linking";
import { StatusBar } from "expo-status-bar";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation, DrawerActions } from '@react-navigation/native';


type RootStackParamList = {
  Login: undefined;
  Home: undefined;
};

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Home">;
};

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const HomeScreen = ({ navigation }: HomeScreenProps) => {
  const video = useRef<any>(null);
  const contactUrl = "https://www.linkedin.com/in/cathyaugustin/";
  const qrSlideAnim = useRef(new Animated.Value(200)).current;
  const qrOpacityAnim = useRef(new Animated.Value(0)).current;
  const textOpacityAnim = useRef(new Animated.Value(0)).current;
  const [isQRVisible, setIsQRVisible] = useState(false);

  const toggleQRCode = () => {
    if (!isQRVisible) {
      setIsQRVisible(true);
      Animated.parallel([
        Animated.timing(qrSlideAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(qrOpacityAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(textOpacityAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(qrSlideAnim, {
          toValue: 200,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(qrOpacityAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(textOpacityAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start(() => setIsQRVisible(false));
    }
  };

  const handleQRPress = () => {
    Linking.openURL(contactUrl);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={styles.loginButtonText}>Login / Sign In</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Video
            ref={video}
            style={styles.logo}
            resizeMode={ResizeMode.CONTAIN}
            source={require("../../assets/logo_blue_video.mp4")}
            shouldPlay
            isLooping
            isMuted
            useNativeControls={false}
          />
        </View>

        <Animated.Text style={[styles.text, { opacity: textOpacityAnim }]}>
          Scan it, you'll be coopted
        </Animated.Text>

        <TouchableOpacity style={styles.qrButton} onPress={toggleQRCode}>
          <Text style={styles.qrButtonText}>
            {isQRVisible ? "Hide QR Code" : "Show QR Code"}
          </Text>
        </TouchableOpacity>

        <Animated.View
          style={[
            styles.qrContainer,
            {
              transform: [{ translateX: qrSlideAnim }],
              opacity: qrOpacityAnim,
            },
          ]}
        >
          <TouchableOpacity onPress={handleQRPress}>
            <View style={styles.qrBackground}>
              <QRCode
                value={contactUrl}
                size={120}
                color="black"
                backgroundColor="white"
              />
            </View>
          </TouchableOpacity>
        </Animated.View>
      </View>
      <StatusBar style="light" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#4247BD",
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 1,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
    paddingTop: 60,
  },
  logoContainer: {
    width: windowWidth * 0.9,
    height: windowHeight * 0.55,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -60,
  },
  logo: {
    width: "100%",
    height: "100%",
  },
  text: {
    fontFamily: "Quicksand-Bold",
    fontSize: 18,
    color: "#FFFFFF",
    position: "absolute",
    top: "65%",
  },
  loginButton: {
    position: "absolute",
    top: 50,
    right: 20,
    backgroundColor: "#fef9f9",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    zIndex: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loginButtonText: {
    fontFamily: "Quicksand-Bold",
    color: "#4247BD",
    fontSize: 14,
  },
  qrButton: {
    position: "absolute",
    bottom: 40,
    backgroundColor: "#FF8F66",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  qrButtonText: {
    fontFamily: "Quicksand-Bold",
    color: "#FFFFFF",
    fontSize: 14,
  },
  qrContainer: {
    position: "absolute",
    bottom: 100,
    zIndex: 3,
  },
  qrBackground: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default HomeScreen;
