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
      return { success: true };
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
      return { success: true };
    } catch (error: any) {
      throw new Error(error.message || 'Erreur d\'inscription');
    }
  },
};