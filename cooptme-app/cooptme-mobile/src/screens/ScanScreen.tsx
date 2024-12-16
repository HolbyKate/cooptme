import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from "react-native";
import { Camera, CameraType } from "expo-camera";
import { X } from "lucide-react-native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../App";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface Props {
  navigation: NavigationProp;
}

export default function ScanScreen({ navigation }: Props) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null); // Permission état
  const cameraRef = useRef<Camera>(null); // Référence pour la caméra
  const [type, setType] = useState(CameraType.back); // Type de caméra (avant/arrière)

  // Demande de permissions caméra au chargement
  useEffect(() => {
    requestPermissions();
  }, []);

  // Fonction pour demander les permissions
  const requestPermissions = async () => {
    try {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    } catch (error) {
      console.error("Erreur lors de la demande de permission:", error);
      setHasPermission(false);
    }
  };

  // Basculer entre caméra avant et arrière
  const toggleCameraType = () => {
    setType((prevType) =>
      prevType === CameraType.back ? CameraType.front : CameraType.back
    );
  };

  // Prendre une photo
  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        Alert.alert("Photo prise", "Photo capturée avec succès");
        // Vous pouvez ajouter ici une logique pour traiter la photo
        console.log(photo.uri);
      } catch (error) {
        Alert.alert("Erreur", "Impossible de prendre la photo");
      }
    }
  };

  // État initial : permissions en attente
  if (hasPermission === null) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.text}>Demande d'accès à la caméra...</Text>
      </SafeAreaView>
    );
  }

  // État où la permission est refusée
  if (hasPermission === false) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.text}>Pas d'accès à la caméra</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermissions}>
          <Text style={styles.buttonText}>Demander l'accès</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // Rendu principal lorsque la permission est accordée
  return (
    <SafeAreaView style={styles.container}>
      <Camera
        ref={cameraRef}
        style={styles.camera}
        type={type}
      >
        <View style={styles.overlay}>
          <View style={styles.scanArea} />
        </View>
      </Camera>

      {/* Guide pour l'utilisateur */}
      <View style={styles.guideContainer}>
        <Text style={styles.guideText}>Placez le QR code dans le cadre</Text>
      </View>

      {/* Bouton pour capturer une photo */}
      <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
        <View style={styles.captureButtonInner} />
      </TouchableOpacity>

      {/* Bouton pour fermer la caméra */}
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => navigation.goBack()}
      >
        <X color="#FFFFFF" size={24} />
      </TouchableOpacity>

      {/* Bouton pour basculer entre les caméras */}
      <TouchableOpacity style={styles.switchButton} onPress={toggleCameraType}>
        <Text style={styles.switchText}>Changer de caméra</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  scanArea: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    backgroundColor: "transparent",
  },
  text: {
    fontFamily: "Quicksand-Regular",
    fontSize: 18,
    color: "#FFFFFF",
    textAlign: "center",
    marginTop: 50,
  },
  button: {
    backgroundColor: "#4247BD",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    marginTop: 20,
    alignSelf: "center",
  },
  buttonText: {
    fontFamily: "Quicksand-Bold",
    fontSize: 16,
    color: "#FFFFFF",
  },
  guideContainer: {
    position: "absolute",
    bottom: 100,
    left: 0,
    right: 0,
    alignItems: "center",
    padding: 20,
  },
  guideText: {
    fontFamily: "Quicksand-Regular",
    fontSize: 16,
    color: "#FFFFFF",
    textAlign: "center",
  },
  closeButton: {
    position: "absolute",
    top: 50,
    right: 20,
    padding: 10,
  },
  captureButton: {
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FFFFFF",
  },
  switchButton: {
    position: "absolute",
    bottom: 100,
    right: 20,
    padding: 10,
    backgroundColor: "#4247BD",
    borderRadius: 20,
  },
  switchText: {
    fontFamily: "Quicksand-Regular",
    fontSize: 14,
    color: "#FFFFFF",
  },
});
