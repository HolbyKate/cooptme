import { PrismaClient } from '@prisma/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthResponse } from '../types';

const prisma = new PrismaClient();

class AuthService {
  async handleAuth0Login(userData: {
    email: string;
    firstName: string;
    lastName: string;
    auth0Id: string;
  }): Promise<AuthResponse> {
    try {
      let user = await prisma.user.findUnique({
        where: { email: userData.email }
      });

      if (!user) {
        user = await prisma.user.create({
          data: {
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            auth0Id: userData.auth0Id,
            password: '' // Champ vide car nous utilisons Auth0
          }
        });
      }

      const response: AuthResponse = {
        success: true,
        token: userData.auth0Id, // Utiliser l'ID Auth0 comme token
        user: {
          id: user.id.toString(),
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName
        }
      };

      if (!response.token || !response.user) {
        throw new Error('Données de réponse invalides');
      }

      await AsyncStorage.multiSet([
        ['userToken', response.token],
        ['userData', JSON.stringify(response.user)]
      ]);

      return response;
    } catch (error: any) {
      console.error('Erreur de connexion:', error);
      return {
        success: false,
        error: error.message || 'Erreur de connexion'
      };
    }
  }

  async logout(): Promise<void> {
    await AsyncStorage.multiRemove(['userToken', 'userData']);
  }
}

export default new AuthService();
