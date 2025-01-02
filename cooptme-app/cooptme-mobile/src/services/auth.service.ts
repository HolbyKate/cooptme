import AsyncStorage from "@react-native-async-storage/async-storage";
import { encode as base64encode } from 'base-64';
import jwtDecode from "jwt-decode";
import { v4 as uuidv4 } from 'uuid';
import database, { User } from "../config/database";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import appleAuth from "@invertase/react-native-apple-authentication";
import { JWT_SECRET } from "@env";

export class AuthService {
  private generateToken(userId: string): string {
    // Créer un JWT simple pour React Native
    const header = {
      alg: 'HS256',
      typ: 'JWT'
    };
    
    const payload = {
      userId,
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 heures
    };
    
    const encodedHeader = base64encode(JSON.stringify(header));
    const encodedPayload = base64encode(JSON.stringify(payload));
    const signature = base64encode(
      JSON.stringify({ secret: JWT_SECRET })
    );
    
    return `${encodedHeader}.${encodedPayload}.${signature}`;
  }

  private async hashPassword(password: string): Promise<string> {
    // Simple hash pour React Native
    return base64encode(password + JWT_SECRET);
  }

  async createUser(userData: {
    email: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    authProvider?: string;
    authProviderId?: string;
  }): Promise<{ user: User; token: string }> {
    // Vérifier si l'email existe déjà
    const existingUsers = await database.query<User>("users", "SELECT");
    const userExists = existingUsers.rows.some(
      (user) => user.email === userData.email
    );

    if (userExists) {
      throw new Error("Cet email est déjà utilisé");
    }

    const passwordHash = userData.password
      ? await this.hashPassword(userData.password)
      : null;

    const newUser: User = {
      id: uuidv4(),
      email: userData.email,
      password_hash: passwordHash || undefined,
      firstName: userData.firstName,
      lastName: userData.lastName,
      auth_provider: userData.authProvider,
      auth_provider_id: userData.authProviderId,
      created_at: new Date().toISOString(),
    };

    await database.query<User>("users", "INSERT", [newUser]);
    const token = this.generateToken(newUser.id);

    return { user: newUser, token };
  }

  async loginWithEmail(email: string, password: string) {
    const users = await database.query<User>("users", "SELECT");
    const user = users.rows.find((u) => u.email === email);

    if (!user || !user.password_hash) {
      throw new Error("Email ou mot de passe incorrect");
    }

    const hashedPassword = await this.hashPassword(password);
    const isValid = hashedPassword === user.password_hash;

    if (!isValid) {
      throw new Error("Email ou mot de passe incorrect");
    }

    // Mise à jour du last_login
    const updatedUser: User = {
      ...user,
      last_login: new Date().toISOString(),
    };

    await database.query<User>("users", "UPDATE", [updatedUser]);
    const token = this.generateToken(user.id);

    return { user: updatedUser, token };
  }

  async loginWithGoogle() {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();

      const users = await database.query<User>("users", "SELECT");
      let user = users.rows.find(
        (u) =>
          u.auth_provider === "google" &&
          u.auth_provider_id === userInfo.user.id
      );

      if (!user) {
        const result = await this.createUser({
          email: userInfo.user.email,
          firstName: userInfo.user.givenName,
          lastName: userInfo.user.familyName,
          authProvider: "google",
          authProviderId: userInfo.user.id,
        });
        user = result.user;
      }

      const token = this.generateToken(user.id);
      return { user, token };
    } catch (error) {
      throw new Error("Erreur de connexion avec Google");
    }
  }

  async loginWithApple() {
    try {
      const appleAuthResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      const users = await database.query<User>("users", "SELECT");
      let user = users.rows.find(
        (u) =>
          u.auth_provider === "apple" &&
          u.auth_provider_id === appleAuthResponse.user
      );

      if (!user) {
        const result = await this.createUser({
          email: appleAuthResponse.email!,
          firstName: appleAuthResponse.fullName?.givenName,
          lastName: appleAuthResponse.fullName?.familyName,
          authProvider: "apple",
          authProviderId: appleAuthResponse.user,
        });
        user = result.user;
      }

      const token = this.generateToken(user.id);
      return { user, token };
    } catch (error) {
      throw new Error("Erreur de connexion avec Apple");
    }
  }
}

export default new AuthService();
