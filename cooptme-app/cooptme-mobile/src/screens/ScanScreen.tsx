import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Linking,
  Alert,
  SafeAreaView,
} from 'react-native';
import { Camera } from 'expo-camera';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { X } from 'lucide-react-native';

export default function ScanScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    try {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    } catch (error) {
      console.error('Erreur lors de la demande de permission:', error);
      setHasPermission(false);
    }
  };

  const handleBarCodeScanned = async ({ type, data }: { type: string; data: string }) => {
    setScanned(true);
    
    try {
      // Vérifier si c'est un lien LinkedIn
      if (data.includes('linkedin.com')) {
        Alert.alert(
          'Profil LinkedIn détecté',
          'Voulez-vous ouvrir ce profil ?',
          [
            {
              text: 'Annuler',
              style: 'cancel',
              onPress: () => setScanned(false),
            },
            {
              text: 'Ouvrir',
              onPress: async () => {
                try {
                  await Linking.openURL(data);
                } catch (error) {
                  Alert.alert('Erreur', "Impossible d'ouvrir le lien");
                }
                setScanned(false);
              },
            },
          ]
        );
      } else {
        // Gérer d'autres types de QR codes ici
        Alert.alert(
          'QR Code scanné',
          `Contenu: ${data}`,
          [
            {
              text: 'OK',
              onPress: () => setScanned(false),
            },
          ]
        );
      }
    } catch (error) {
      console.error('Erreur lors du traitement du QR code:', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors du scan');
      setScanned(false);
    }
  };

  if (hasPermission === null) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.text}>Demande d'accès à la caméra...</Text>
      </SafeAreaView>
    );
  }

  if (hasPermission === false) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.text}>Pas d'accès à la caméra</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={requestPermissions}
        >
          <Text style={styles.buttonText}>Demander l'accès</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={styles.camera}
      >
        <View style={styles.overlay}>
          <View style={styles.scanArea} />
        </View>
      </BarCodeScanner>
      
      {!scanned && (
        <View style={styles.guideContainer}>
          <Text style={styles.guideText}>
            Placez un QR code dans le cadre pour le scanner
          </Text>
        </View>
      )}

      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => setScanned(false)}
      >
        <X color="#FFFFFF" size={24} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
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
    fontFamily: 'Quicksand-Regular',
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
    fontFamily: 'Quicksand-Bold',
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
    fontFamily: 'Quicksand-Regular',
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