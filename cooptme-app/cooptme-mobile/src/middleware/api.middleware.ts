import axios, { AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthResponse } from '../types';

const CONFIG = {
  API_URL: 'http://192.168.31.149:3000/api',
  API_TIMEOUT: 10000,
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

export { CONFIG }; 