import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const API_URL = 'http://192.168.31.149:3000/api';

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: User;
  error?: string;
}

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Pour simuler les réponses en développement
export const authApi = {
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      console.log('Tentative de connexion:', email);
      return {
        success: true,
        token: 'fake-token-123',
        user: {
          id: '1',
          email,
          firstName: '',
          lastName: ''
        }
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Erreur de connexion'
      };
    }
  },

  async register(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }): Promise<AuthResponse> {
    try {
      console.log('Tentative d\'inscription:', data);
      return {
        success: true,
        token: 'fake-token-123',
        user: {
          id: '1',
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName
        }
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Erreur d\'inscription'
      };
    }
  },

  async socialLogin(data: {
    type: 'google' | 'apple';
    token: string;
    email: string;
    firstName?: string;
    lastName?: string;
  }): Promise<AuthResponse> {
    try {
      console.log('Tentative de connexion sociale:', data);
      return {
        success: true,
        token: 'fake-token-123',
        user: {
          id: '1',
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName
        }
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Erreur de connexion sociale'
      };
    }
  },

  async logout(): Promise<{ success: boolean; error?: string }> {
    try {
      await AsyncStorage.removeItem('userToken');
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Erreur de déconnexion'
      };
    }
  }
};