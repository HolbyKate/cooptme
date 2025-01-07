import axios, { AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthResponse } from '../types';

const CONFIG = {
  API_URL: 'http://10.0.2.2:3000/api',
  API_TIMEOUT: 30000,
  AUTH_ENDPOINTS: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    GOOGLE: '/auth/google',
    APPLE: '/auth/apple',
    FORGOT_PASSWORD: '/auth/forgot-password'
  },
  STORAGE_KEYS: {
    USER_TOKEN: 'userToken',
    USER_DATA: 'userData'
  },
  JWT_SECRET: process.env.JWT_SECRET,
  DATABASE_URL: process.env.DATABASE_URL
};

export const apiClient = axios.create({
  baseURL: CONFIG.API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: CONFIG.API_TIMEOUT,
});

// Intercepteur pour ajouter le token d'authentification
apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem(CONFIG.STORAGE_KEYS.USER_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  response => response,
  error => {
    console.error('Erreur API interceptée:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      isAxiosError: error.isAxiosError
    });
    
    if (error.message === 'Network Error') {
      throw new Error('Erreur de connexion au serveur. Vérifiez que le serveur est démarré et accessible.');
    }
    
    return Promise.reject(error);
  }
);

export { CONFIG };