import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const API_URL = 'http://192.168.31.149:3000/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authService = {
  async login(email: string, password: string) {
    try {
      // Pour le développement, simulons une réponse
      console.log('Tentative de connexion:', email);
      return { token: 'fake-token-123', success: true };
    } catch (error: any) {
      throw new Error(error.message || 'Erreur de connexion');
    }
  },

  async register(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) {
    try {
      // Pour le développement, simulons une réponse
      console.log('Tentative d\'inscription:', data);
      return { token: 'fake-token-123', success: true };
    } catch (error: any) {
      throw new Error(error.message || 'Erreur d\'inscription');
    }
  },

  async socialLogin(data: {
    type: 'google' | 'apple';
    token: string;
    email: string;
    firstName?: string;
    lastName?: string;
  }) {
    try {
      // Pour le développement, simulons une réponse
      console.log('Tentative de connexion sociale:', data);
    return { success: true, token: 'fake-token-123' };
  } catch (error: any) {
    throw new Error(error.message || 'Erreur de connexion sociale');
  }
  },

  async logout() {
    try {
      await AsyncStorage.removeItem('userToken');
      return { success: true };
    } catch (error: any) {
      throw new Error(error.message || 'Erreur de déconnexion');
    }
  }
};