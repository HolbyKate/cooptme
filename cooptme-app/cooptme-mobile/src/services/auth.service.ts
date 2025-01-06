import { apiClient, CONFIG } from '../middleware/api.middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as AppleAuthentication from 'expo-apple-authentication';
import { AuthResponse } from '../types';

const AUTH_CONFIG = {
  domain: process.env.AUTH0_DOMAIN,
  clientId: process.env.AUTH0_CLIENT_ID
};

class AuthService {
  async login(data: { email: string; password: string }): Promise<AuthResponse> {
    try {
      const response = await apiClient.post(CONFIG.AUTH_ENDPOINTS.LOGIN, data);
      if (response.data.token) {
        await AsyncStorage.setItem(CONFIG.STORAGE_KEYS.USER_TOKEN, response.data.token);
      }
      return response.data;
    } catch (error: any) {
      console.error('Erreur de connexion:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Erreur de connexion');
    }
  }

  async register(data: { email: string; password: string; name: string }): Promise<AuthResponse> {
    try {
      const response = await apiClient.post(CONFIG.AUTH_ENDPOINTS.REGISTER, data);
      if (response.data.token) {
        await AsyncStorage.setItem(CONFIG.STORAGE_KEYS.USER_TOKEN, response.data.token);
      }
      return response.data;
    } catch (error: any) {
      console.error('Erreur d\'inscription:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Erreur d\'inscription');
    }
  }

  async handleGoogleLogin(accessToken: string): Promise<AuthResponse> {
    try {
      const response = await apiClient.post(CONFIG.AUTH_ENDPOINTS.GOOGLE, { accessToken });
      await this.handleAuthResponse(response.data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Erreur de connexion Google');
    }
  }

  async handleAppleLogin(credential: AppleAuthentication.AppleAuthenticationCredential): Promise<AuthResponse> {
    try {
      const response = await apiClient.post(CONFIG.AUTH_ENDPOINTS.APPLE, { credential });
      await this.handleAuthResponse(response.data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Erreur de connexion Apple');
    }
  }

  async forgotPassword(email: string): Promise<void> {
    try {
      await apiClient.post(CONFIG.AUTH_ENDPOINTS.FORGOT_PASSWORD, { email });
    } catch (error: any) {
      throw new Error(error.message || 'Erreur lors de la réinitialisation du mot de passe');
    }
  }

  private async handleAuthResponse(data: AuthResponse) {
    if (data.token && data.user) {
      await AsyncStorage.multiSet([
        [CONFIG.STORAGE_KEYS.USER_TOKEN, data.token],
        [CONFIG.STORAGE_KEYS.USER_DATA, JSON.stringify(data.user)]
      ]);
    }
  }

  async logout(): Promise<void> {
    await AsyncStorage.multiRemove([
      CONFIG.STORAGE_KEYS.USER_TOKEN,
      CONFIG.STORAGE_KEYS.USER_DATA
    ]);
  }
}

export const authService = new AuthService();
