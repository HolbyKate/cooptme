import {
    GoogleSignin,
    statusCodes,
} from "@react-native-google-signin/google-signin";
import appleAuth from "@invertase/react-native-apple-authentication";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api, authApi, type AuthResponse, type User } from "../services/api";

class AuthService {
    async login(email: string, password: string): Promise<AuthResponse> {
        try {
            const response = await authApi.login(email, password);

            if (response.success && response.token) {
                const dataToStore: [string, string][] = [
                    ["userToken", response.token],
                    ["userData", JSON.stringify(response.user || {})],
                ];
                await AsyncStorage.multiSet(dataToStore);
            }
            return response;
        } catch (error: any) {
            console.error("Login Error:", error);
            return {
                success: false,
                error: error.message || "Erreur de connexion",
            };
        }
    }

    async register(data: {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
    }): Promise<AuthResponse> {
        try {
            const response = await authApi.register(data);

            if (response.success && response.token) {
                const dataToStore: [string, string][] = [
                    ["userToken", response.token],
                    ["userData", JSON.stringify(response.user || {})],
                ];
                await AsyncStorage.multiSet(dataToStore);
            }
            return response;
        } catch (error: any) {
            console.error("Registration Error:", error);
            return {
                success: false,
                error: error.message || "Erreur lors de l'inscription",
            };
        }
    }

    async loginWithGoogle(): Promise<AuthResponse> {
        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();

            if (!userInfo?.user?.email) {
                throw new Error("Impossible de récupérer les informations Google");
            }

            const tokens = await GoogleSignin.getTokens();
            const response = await authApi.socialLogin({
                type: "google",
                token: tokens.accessToken,
                email: userInfo.user.email,
                firstName: userInfo.user.givenName || "",
                lastName: userInfo.user.familyName || "",
            });

            if (response.success && response.token) {
                const dataToStore: [string, string][] = [
                    ["userToken", response.token],
                    ["userData", JSON.stringify(response.user || {})],
                ];
                await AsyncStorage.multiSet(dataToStore);
            }
            return response;
        } catch (error: any) {
            console.error("Google Sign-In Error:", error);
            const errorMessage =
                error.code === statusCodes.SIGN_IN_CANCELLED
                    ? "Connexion annulée"
                    : error.code === statusCodes.IN_PROGRESS
                        ? "Connexion déjà en cours"
                        : error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE
                            ? "Google Play Services non disponible"
                            : "Erreur de connexion avec Google";

            return { success: false, error: errorMessage };
        }
    }

    async loginWithApple(): Promise<AuthResponse> {
        try {
            const appleAuthResponse = await appleAuth.performRequest({
                requestedOperation: appleAuth.Operation.LOGIN,
                requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
            });

            if (!appleAuthResponse.identityToken) {
                throw new Error("Pas de token reçu de Apple");
            }

            const response = await authApi.socialLogin({
                type: "apple",
                token: appleAuthResponse.identityToken,
                email: appleAuthResponse.email || "",
                firstName: appleAuthResponse.fullName?.givenName || "",
                lastName: appleAuthResponse.fullName?.familyName || "",
            });

            if (response.success && response.token) {
                const dataToStore: [string, string][] = [
                    ["userToken", response.token],
                    ["userData", JSON.stringify(response.user || {})],
                ];
                await AsyncStorage.multiSet(dataToStore);
            }
            return response;
        } catch (error: any) {
            console.error("Apple Sign-In Error:", error);
            return {
                success: false,
                error: error.message || "Erreur de connexion avec Apple",
            };
        }
    }

    async logout(): Promise<{ success: boolean; error?: string }> {
        try {
            try {
                const isGoogleSignedIn = await GoogleSignin.isSignedIn();
                if (isGoogleSignedIn) {
                    await GoogleSignin.signOut();
                }
            } catch (error) {
                console.warn("Erreur lors de la déconnexion Google:", error);
            }

            await AsyncStorage.multiRemove(["userToken", "userData"]);
            return { success: true };
        } catch (error: any) {
            console.error("Logout Error:", error);
            return {
                success: false,
                error: error.message || "Erreur lors de la déconnexion",
            };
        }
    }

    async getCurrentUser(): Promise<User | null> {
        try {
            const userDataString = await AsyncStorage.getItem("userData");
            return userDataString ? JSON.parse(userDataString) : null;
        } catch (error) {
            console.error("Erreur lors de la récupération des données utilisateur:", error);
            return null;
        }
    }
}

export default new AuthService();
