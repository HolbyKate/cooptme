import AsyncStorage from '@react-native-async-storage/async-storage';

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

const STORAGE_KEY = 'scanned_profiles';
const LINKEDIN_AUTH_KEY = 'linkedin_auth';

export interface LinkedInAuth {
  isLoggedIn: boolean;
  cookies?: string;
}

export const LINKEDIN_LOGIN_SCRIPT = `
(function() {
  // Vérifier si on est sur la page de login
  const emailInput = document.querySelector('input[name="session_key"]');
  const passwordInput = document.querySelector('input[name="session_password"]');
  if (emailInput && passwordInput) {
    window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'LOGIN_PAGE' }));
  }

  // Vérifier si on est connecté
  const nav = document.querySelector('.nav');
  if (nav) {
    window.ReactNativeWebView.postMessage(JSON.stringify({
      type: 'AUTH_STATUS',
      isLoggedIn: true
    }));
  }
})();
`;

export const LINKEDIN_SCRAPING_SCRIPT = `
(function() {
  try {
    const nameElement = document.querySelector('.text-heading-xlarge');
    const titleElement = document.querySelector('.text-body-medium');
    const companyElement = document.querySelector('.pv-text-details__right-panel-item-text');
    const locationElement = document.querySelector('.text-body-small');

    if (!nameElement || !titleElement) {
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: 'SCRAPING_ERROR',
        error: 'Profile elements not found'
      }));
      return;
    }

    const fullName = nameElement.textContent.trim();
    const nameParts = fullName.split(' ');

    const data = {
      type: 'PROFILE_DATA',
      profile: {
        id: 'li_' + Date.now(),
        firstName: nameParts[0],
        lastName: nameParts.slice(1).join(' '),
        title: titleElement.textContent.trim(),
        company: companyElement ? companyElement.textContent.trim() : '',
        location: locationElement ? locationElement.textContent.trim() : '',
        profileUrl: window.location.href,
        scannedAt: new Date().toISOString()
      }
    };

    window.ReactNativeWebView.postMessage(JSON.stringify(data));
  } catch (error) {
    window.ReactNativeWebView.postMessage(JSON.stringify({
      type: 'SCRAPING_ERROR',
      error: error.message
    }));
  }
})();
`;

export const saveLinkedInAuth = async (auth: LinkedInAuth): Promise<void> => {
  try {
    await AsyncStorage.setItem(LINKEDIN_AUTH_KEY, JSON.stringify(auth));
  } catch (error) {
    console.error('Error saving LinkedIn auth:', error);
  }
};

export const getLinkedInAuth = async (): Promise<LinkedInAuth | null> => {
  try {
    const data = await AsyncStorage.getItem(LINKEDIN_AUTH_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting LinkedIn auth:', error);
    return null;
  }
};

export const saveProfile = async (profile: LinkedInProfile): Promise<void> => {
  try {
    const existingData = await AsyncStorage.getItem(STORAGE_KEY);
    const profiles: LinkedInProfile[] = existingData ? JSON.parse(existingData) : [];

    const existingIndex = profiles.findIndex(p => p.profileUrl === profile.profileUrl);
    if (existingIndex >= 0) {
      profiles[existingIndex] = { ...profile, scannedAt: new Date().toISOString() };
    } else {
      profiles.push(profile);
    }

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
  } catch (error) {
    console.error('Error saving profile:', error);
    throw error;
  }
};

export const getProfiles = async (): Promise<LinkedInProfile[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting profiles:', error);
    return [];
  }
};