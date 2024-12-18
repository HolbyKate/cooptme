// src/utils/linkedinProfileHandler.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import WebView from 'react-native-webview';

export interface LinkedInProfile {
  id: string;
  firstName: string;
  lastName: string;
  title: string;
  company: string;
  location: string;
  scannedAt: string;
  profileUrl: string;
}

const LINKEDIN_PROFILES_KEY = 'linkedin_profiles';

export const LINKEDIN_INJECTION_SCRIPT = `
  (function() {
    try {
      const nameElement = document.querySelector('.text-heading-xlarge');
      const titleElement = document.querySelector('.text-body-medium');
      const locationElement = document.querySelector('.text-body-small');
      const companyElement = document.querySelector('.pv-text-details__right-panel-item-text');
      
      if (!nameElement || !titleElement) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ error: 'Required elements not found' }));
        return;
      }
      
      const fullName = nameElement.textContent.trim();
      const nameParts = fullName.split(' ');
      
      const data = {
        firstName: nameParts[0],
        lastName: nameParts.slice(1).join(' '),
        title: titleElement.textContent.trim(),
        location: locationElement ? locationElement.textContent.trim() : '',
        company: companyElement ? companyElement.textContent.trim() : '',
        profileUrl: window.location.href,
        scannedAt: new Date().toISOString(),
        id: 'li_' + Date.now()
      };
      
      window.ReactNativeWebView.postMessage(JSON.stringify(data));
    } catch (error) {
      window.ReactNativeWebView.postMessage(JSON.stringify({ error: error.message }));
    }
  })();
`;

export const saveLinkedInProfile = async (profile: LinkedInProfile): Promise<void> => {
  try {
    const existingDataStr = await AsyncStorage.getItem(LINKEDIN_PROFILES_KEY);
    const existingData: LinkedInProfile[] = existingDataStr ? JSON.parse(existingDataStr) : [];
    
    // Vérifier si le profil existe déjà
    const profileIndex = existingData.findIndex(p => p.profileUrl === profile.profileUrl);
    
    if (profileIndex >= 0) {
      // Mettre à jour le profil existant
      existingData[profileIndex] = {
        ...existingData[profileIndex],
        ...profile,
        scannedAt: new Date().toISOString()
      };
    } else {
      // Ajouter le nouveau profil
      existingData.push(profile);
    }
    
    await AsyncStorage.setItem(LINKEDIN_PROFILES_KEY, JSON.stringify(existingData));
  } catch (error) {
    console.error('Erreur lors de la sauvegarde du profil:', error);
    throw new Error('Impossible de sauvegarder le profil');
  }
};

export const getLinkedInProfiles = async (): Promise<LinkedInProfile[]> => {
  try {
    const data = await AsyncStorage.getItem(LINKEDIN_PROFILES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Erreur lors de la récupération des profils:', error);
    return [];
  }
};

export const deleteLinkedInProfile = async (profileId: string): Promise<void> => {
  try {
    const profiles = await getLinkedInProfiles();
    const updatedProfiles = profiles.filter(profile => profile.id !== profileId);
    await AsyncStorage.setItem(LINKEDIN_PROFILES_KEY, JSON.stringify(updatedProfiles));
  } catch (error) {
    console.error('Erreur lors de la suppression du profil:', error);
    throw new Error('Impossible de supprimer le profil');
  }
};