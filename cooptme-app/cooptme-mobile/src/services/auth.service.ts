import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { User, AuthResponse, SocialLoginData } from '../types';

const API_URL = 'http://192.168.31.149:3000/api';

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            await AsyncStorage.multiRemove(['userToken', 'userData']);
        }
        return Promise.reject(error);
    }
);

class AuthService {
    private async storeUserData(response: AuthResponse) {
        if (response.success && response.token) {
            try {
                await AsyncStorage.multiSet([
                    ['userToken', response.token],
                    ['userData', JSON.stringify(response.user || {})],
                ]);
            } catch (error) {
                console.error('Erreur lors du stockage des données:', error);
                throw error;
            }
        }
    }

    async login(email: string, password: string): Promise<AuthResponse> {
        try {
            // Pour le développement, utilisez cette réponse simulée
            const response: AuthResponse = {
                success: true,
                token: 'fake-token-123',
                user: { id: '1', email, firstName: '', lastName: '' }
            };

            await this.storeUserData(response);
            return response;
        } catch (error: any) {
            console.error('Erreur de connexion:', error);
            return {
                success: false,
                error: error.message || 'Erreur de connexion'
            };
        }
    }

    async register(userData: {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
    }): Promise<AuthResponse> {
        try {
            const response: AuthResponse = {
                success: true,
                token: 'fake-token-123',
                user: {
                    id: '1',
                    ...userData,
                }
            };

            await this.storeUserData(response);
            return response;
        } catch (error: any) {
            console.error('Erreur d\'inscription:', error);
            return {
                success: false,
                error: error.message || 'Erreur d\'inscription'
            };
        }
    }

    async socialLogin(socialData: SocialLoginData): Promise<AuthResponse> {
        try {
            if (!socialData.email) {
                throw new Error("L'email est requis pour la connexion sociale");
            }

            // Validation des données
            const userData: User = {
                id: crypto.randomUUID(), // Ou générez un ID unique d'une autre manière
                email: socialData.email,
                firstName: socialData.firstName || '',
                lastName: socialData.lastName || '',
                createdAt: new Date().toISOString()
            };

            const response: AuthResponse = {
                success: true,
                token: 'fake-token-123', // Remplacez par un vrai token en production
                user: userData
            };

            await this.storeUserData(response);
            return response;
        } catch (error: any) {
            console.error(`Erreur de connexion ${socialData.type}:`, error);
            return {
                success: false,
                error: error.message || `Erreur de connexion ${socialData.type}`
            };
        }
    }

    async logout(): Promise<{ success: boolean; error?: string }> {
        try {
            await AsyncStorage.multiRemove(['userToken', 'userData']);
            return { success: true };
        } catch (error: any) {
            console.error('Erreur de déconnexion:', error);
            return {
                success: false,
                error: error.message || 'Erreur de déconnexion'
            };
        }
    }

    async getCurrentUser(): Promise<User | null> {
        try {
            const userData = await AsyncStorage.getItem('userData');
            return userData ? JSON.parse(userData) : null;
        } catch (error) {
            console.error('Erreur lors de la récupération de l\'utilisateur:', error);
            return null;
        }
    }
}

export default new AuthService();
