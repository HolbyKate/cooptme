import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LinkedInProfile {
  firstName: string;
  lastName: string;
  profession: string;
  profileUrl: string;
  scannedAt: string;
}

const STORAGE_KEY = 'linkedin_profiles';

// Script d'injection pour extraire les données
const INJECTION_SCRIPT = `
  (function() {
    try {
      const nameElement = document.querySelector('.text-heading-xlarge');
      const titleElement = document.querySelector('.text-body-medium');
      
      if (!nameElement || !titleElement) return null;
      
      const fullName = nameElement.textContent.trim();
      const nameParts = fullName.split(' ');
      
      const data = {
        firstName: nameParts[0],
        lastName: nameParts.slice(1).join(' '),
        profession: titleElement.textContent.trim(),
        profileUrl: window.location.href,
        scannedAt: new Date().toISOString()
      };
      
      window.ReactNativeWebView.postMessage(JSON.stringify(data));
    } catch (error) {
      window.ReactNativeWebView.postMessage(JSON.stringify({ error: error.message }));
    }
  })();
`;

// Composant WebView pour le scraping
export const LinkedInScanner: React.FC<{
  profileUrl: string;
  onScanComplete: (profile: LinkedInProfile) => void;
  onError: (error: string) => void;
}> = ({ profileUrl, onScanComplete, onError }) => {
  const handleMessage = async (event: { nativeEvent: { data: string } }) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      
      if (data.error) {
        onError(data.error);
        return;
      }
      
      await saveProfile(data);
      onScanComplete(data);
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Une erreur est survenue');
    }
  };

  return (
    <WebView
      source={{ uri: profileUrl }}
      injectedJavaScript={INJECTION_SCRIPT}
      onMessage={handleMessage}
      style={{ display: 'none' }}
    />
  );
};

// Fonctions de stockage
export const saveProfile = async (profile: LinkedInProfile) => {
  try {
    const existingData = await AsyncStorage.getItem(STORAGE_KEY);
    const profiles = existingData ? JSON.parse(existingData) : [];
    
    // Vérifier si le profil existe déjà
    const existingIndex = profiles.findIndex(
      (p: LinkedInProfile) => p.profileUrl === profile.profileUrl
    );
    
    if (existingIndex >= 0) {
      profiles[existingIndex] = profile;
    } else {
      profiles.push(profile);
    }
    
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
    return true;
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error);
    throw error;
  }
};

export const getProfiles = async (): Promise<LinkedInProfile[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Erreur lors de la récupération:', error);
    return [];
  }
};