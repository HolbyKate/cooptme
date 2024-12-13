<<<<<<< HEAD
import React, { useRef, useState } from "react";
=======
import { StatusBar } from "expo-status-bar";
>>>>>>> 2d25150 (Add .gitignore and configuration files for project setup)
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Animated,
} from "react-native";
<<<<<<< HEAD
=======
import { useRef, useEffect, useState } from "react";
>>>>>>> 2d25150 (Add .gitignore and configuration files for project setup)
import { Video, ResizeMode } from "expo-av";
import QRCode from "react-native-qrcode-svg";
import * as Linking from "expo-linking";
import { LinearGradient } from "expo-linear-gradient";
<<<<<<< HEAD
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
=======
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
>>>>>>> 2d25150 (Add .gitignore and configuration files for project setup)

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function HomeScreen({ navigation }: HomeScreenProps) {
<<<<<<< HEAD
  const video = useRef(null);
  const contactUrl = "https://www.linkedin.com/in/cathyaugustin/";
  const [isQRVisible, setIsQRVisible] = useState(false);

=======
  const video = useRef<Video>(null);
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

>>>>>>> 2d25150 (Add .gitignore and configuration files for project setup)
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#4247BD", "#4247BD", "#4247BD"]}
<<<<<<< HEAD
        style={styles.background}
      />

=======
        locations={[0, 0.5, 1]}
        style={styles.background}
      />
>>>>>>> 2d25150 (Add .gitignore and configuration files for project setup)
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
<<<<<<< HEAD
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
=======
            resizeMode={ResizeMode.CONTAIN}
            shouldPlay={true}
            isLooping={true}
            isMuted={true}
            useNativeControls={false}
            source={require("../../assets/logo_bleu_video.mp4") }
          />
        </View>

        <Animated.Text style={[styles.text, { opacity: textOpacityAnim }]}>
          Scan it, you'll be coopted
        </Animated.Text>

        <TouchableOpacity style={styles.qrButton} onPress={toggleQRCode}>
>>>>>>> 2d25150 (Add .gitignore and configuration files for project setup)
          <Text style={styles.qrButtonText}>
            {isQRVisible ? "Hide QR Code" : "Show QR Code"}
          </Text>
        </TouchableOpacity>

<<<<<<< HEAD
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
=======
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
      <StatusBar style="auto" />
>>>>>>> 2d25150 (Add .gitignore and configuration files for project setup)
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
<<<<<<< HEAD
=======
    zIndex: 1,
>>>>>>> 2d25150 (Add .gitignore and configuration files for project setup)
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
<<<<<<< HEAD
  },
  logoContainer: {
    width: windowWidth * 0.9,
    height: windowHeight * 0.5,
    justifyContent: "center",
    alignItems: "center",
=======
    zIndex: 2,
  },
  logoContainer: {
    width: windowWidth * 0.9,
    height: windowHeight * 0.55,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -60,
>>>>>>> 2d25150 (Add .gitignore and configuration files for project setup)
  },
  logo: {
    width: "100%",
    height: "100%",
<<<<<<< HEAD
=======
    resizeMode: "contain",
  },
  text: {
    fontFamily: "Quicksand-Bold",
    fontSize: 18,
    color: "#FFFFFF",
    position: "absolute",
    top: "65%",
>>>>>>> 2d25150 (Add .gitignore and configuration files for project setup)
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
<<<<<<< HEAD
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
=======
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
>>>>>>> 2d25150 (Add .gitignore and configuration files for project setup)
    backgroundColor: "#FF8F66",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 20,
<<<<<<< HEAD
    marginTop: 20,
  },
  qrButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  qrContainer: {
    marginTop: 20,
=======
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
>>>>>>> 2d25150 (Add .gitignore and configuration files for project setup)
  },
  qrBackground: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 15,
<<<<<<< HEAD
=======
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
>>>>>>> 2d25150 (Add .gitignore and configuration files for project setup)
    elevation: 5,
  },
});
