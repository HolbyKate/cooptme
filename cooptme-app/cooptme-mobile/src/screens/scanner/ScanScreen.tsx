import { useState } from "react";
import { Camera, CameraView } from "expo-camera";
import {
  AppState,
  Linking,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Button,
  View,
} from "react-native";
import { useEffect, useRef } from "react";
import { Overlay } from "./Overlay";
import LinkedInBrowser from "../../components/LinkedInBrowser";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { LinkedInProfile } from "../../utils/linkedinScraper";

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Scan'>;
};

export default function ScanScreen({ navigation }: Props) {
  const qrLock = useRef(false);
  const appState = useRef(AppState.currentState);
  const [isLinkedInBrowserVisible, setLinkedInBrowserVisible] = useState(false);
  const [profileUrl, setProfileUrl] = useState<string>("");

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        qrLock.current = false;
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const handleProfileScraped = (profile: LinkedInProfile) => {
    setLinkedInBrowserVisible(false);
    qrLock.current = false;
    // Optionnel : naviguer vers Profiles après le scraping
    navigation.navigate('Profiles', { userId: profile.id });
  };

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (data && !qrLock.current) {
      qrLock.current = true;
      if (data.includes('linkedin.com/in/')) {
        setProfileUrl(data);
        setLinkedInBrowserVisible(true);
      } else {
        setTimeout(async () => {
          await Linking.openURL(data);
        }, 500);
      }
    }
  };

  const handleTestLinkedIn = () => {
    // URL de test - à remplacer par une URL LinkedIn valide
    setProfileUrl('https://www.linkedin.com/in/satyanadella/');
    setLinkedInBrowserVisible(true);
  };

  return (
    <SafeAreaView style={StyleSheet.absoluteFillObject}>
      {Platform.OS === "android" ? <StatusBar hidden /> : null}
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        onBarcodeScanned={handleBarCodeScanned}
      />
      <Overlay />

      {/* Bouton de test */}
      <View style={styles.testButtonContainer}>
        <Button
          title="Test LinkedIn"
          onPress={handleTestLinkedIn}
          color="#4247BD"
        />
      </View>

      <LinkedInBrowser
        isVisible={isLinkedInBrowserVisible}
        profileUrl={profileUrl}
        onClose={() => {
          setLinkedInBrowserVisible(false);
          qrLock.current = false;
        }}
        onProfileScraped={handleProfileScraped}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  testButtonContainer: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});