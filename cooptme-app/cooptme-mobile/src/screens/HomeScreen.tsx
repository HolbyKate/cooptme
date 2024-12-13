import React, { useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Animated,
} from "react-native";
import { Video, ResizeMode } from "expo-av";
import QRCode from "react-native-qrcode-svg";
import * as Linking from "expo-linking";
import { LinearGradient } from "expo-linear-gradient";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const video = useRef(null);
  const contactUrl = "https://www.linkedin.com/in/cathyaugustin/";
  const [isQRVisible, setIsQRVisible] = useState(false);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#4247BD", "#4247BD", "#4247BD"]}
        style={styles.background}
      />

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
            source={require("../../assets/logo_bleu_video.mp4")}
            useNativeControls={false}
            resizeMode={ResizeMode.CONTAIN}
            isLooping
            shouldPlay
            isMuted
          />
        </View>

        <Text style={styles.text}>Scan it, you'll be coopted</Text>

        <TouchableOpacity
          style={styles.qrButton}
          onPress={() => setIsQRVisible(!isQRVisible)}
        >
          <Text style={styles.qrButtonText}>
            {isQRVisible ? "Hide QR Code" : "Show QR Code"}
          </Text>
        </TouchableOpacity>

        {isQRVisible && (
          <View style={styles.qrContainer}>
            <TouchableOpacity onPress={() => Linking.openURL(contactUrl)}>
              <View style={styles.qrBackground}>
                <QRCode
                  value={contactUrl}
                  size={120}
                  color="black"
                  backgroundColor="white"
                />
              </View>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logoContainer: {
    width: windowWidth * 0.9,
    height: windowHeight * 0.5,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: "100%",
    height: "100%",
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
    elevation: 5,
  },
  loginButtonText: {
    color: "#4247BD",
    fontSize: 14,
    fontWeight: "bold",
  },
  text: {
    fontSize: 18,
    color: "#FFFFFF",
    fontWeight: "bold",
    marginVertical: 20,
  },
  qrButton: {
    backgroundColor: "#FF8F66",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 20,
    marginTop: 20,
  },
  qrButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  qrContainer: {
    marginTop: 20,
  },
  qrBackground: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 15,
    elevation: 5,
  },
});
