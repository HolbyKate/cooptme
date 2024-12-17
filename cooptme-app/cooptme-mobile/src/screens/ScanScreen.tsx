import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Alert, 
  SafeAreaView, 
  TouchableOpacity 
} from 'react-native';
import { Camera } from 'expo-camera';
import { X, Menu } from "lucide-react-native";
import { useNavigation, DrawerActions } from '@react-navigation/native';
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

type RootStackParamList = {
  Profile: { profileData: { url: string; timestamp: string } };
  QRScanner: undefined;
};

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'QRScanner'>;
};

export default function ScanScreen({ navigation }: Props) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState<boolean>(false);
  const cameraRef = useRef<Camera | null>(null);

  const handleMenuPress = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    try {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    } catch (error) {
      console.error("Erreur lors de la demande de permission:", error);
      setHasPermission(false);
    }
  };

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    if (scanned) return;
    
    setScanned(true);
    try {
      if (data.includes('linkedin.com')) {
        parseLinkedInData(data);
      } else {
        Alert.alert("Erreur", "Ce QR code n'est pas un profil LinkedIn valide");
      }
    } catch (error) {
      Alert.alert("Erreur", "Impossible de lire les données du QR code");
    }
  };

  const parseLinkedInData = (url: string) => {
    const profileData = {
      url,
      timestamp: new Date().toISOString()
    };
    
    console.log("Données LinkedIn scannées:", profileData);
    navigation.navigate('Profile', { profileData });
  };

  return (
    <SafeAreaView style={styles.container}>
      {hasPermission === null ? (
        <View>
          <Text style={styles.text}>Demande d'accès à la caméra...</Text>
        </View>
      ) : hasPermission === false ? (
        <View>
          <Text style={styles.text}>Pas d'accès à la caméra</Text>
          <TouchableOpacity style={styles.button} onPress={requestPermissions}>
            <Text style={styles.buttonText}>Demander l'accès</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <Camera
            ref={cameraRef}
            style={styles.camera}
            type="back"
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          >
            <View style={styles.overlay}>
              <View style={styles.scanArea} />
            </View>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => navigation.goBack()}
            >
              <X color="#FFFFFF" size={24} />
            </TouchableOpacity>
          </Camera>

          <View style={styles.guideContainer}>
            <Text style={styles.guideText}>
              Placez le QR code LinkedIn dans le cadre
            </Text>
          </View>

          {scanned && (
            <TouchableOpacity
              style={styles.button}
              onPress={() => setScanned(false)}
            >
              <Text style={styles.buttonText}>Scanner à nouveau</Text>
            </TouchableOpacity>
          )}
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 50,
    zIndex: 1,
  },
  menuButton: {
    padding: 8,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    backgroundColor: 'transparent',
  },
  text: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 50,
  },
  button: {
    backgroundColor: '#4247BD',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    marginTop: 20,
    alignSelf: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  guideContainer: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
    padding: 20,
  },
  guideText: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    padding: 10,
  },
});