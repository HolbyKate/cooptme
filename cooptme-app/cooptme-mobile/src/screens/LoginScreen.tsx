import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { GoogleSignin, statusCodes } from "@react-native-google-signin/google-signin";
import appleAuth from "@invertase/react-native-apple-authentication";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AntDesign } from "@expo/vector-icons";
import authService from "../services/auth.service";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID
} from '@env';


type RootStackParamList = {
  AppStack: undefined;
  Login: undefined;
};

type LoginScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Login">;
};

interface ValidationErrors {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
}

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const configureGoogleSignIn = async () => {
      try {
        await GoogleSignin.configure({
          webClientId: EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
          iosClientId: EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
          offlineAccess: true,
        });
      } catch (error) {
        console.error("Google Sign-In configuration error:", error);
        updateErrorMessage("Erreur de configuration Google Sign-In");
      }
    };

    configureGoogleSignIn();
  }, []);

  const validate = () => {
    const newErrors: ValidationErrors = {};

    // Validation email
    if (!email) {
      newErrors.email = "L'email est requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Format d'email invalide";
    }

    // Validation mot de passe
    if (!password) {
      newErrors.password = "Le mot de passe est requis";
    } else if (password.length < 8) {
      newErrors.password = "Le mot de passe doit contenir au moins 8 caractères";
    }

    // Validation nom et prénom pour l'inscription
    if (!isLogin) {
      if (!firstName.trim()) {
        newErrors.firstName = "Le prénom est requis";
      }
      if (!lastName.trim()) {
        newErrors.lastName = "Le nom est requis";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateErrorMessage = (message: string) => {
    setErrorMessage(message);
    setIsLoading(false);
    setSocialLoading(false);
  };

  const clearForm = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
    setErrors({});
    setErrorMessage("");
  };

  const handleGoogleSignIn = async () => {
    setSocialLoading(true);
    try {
      await GoogleSignin.hasPlayServices();
      const result = await authService.loginWithGoogle();

      if (result.success && result.token) {
        await AsyncStorage.setItem("userToken", result.token);
        navigation.replace("AppStack");
      } else {
        throw new Error(result.error || "Erreur de connexion Google");
      }
    } catch (error: any) {
      console.error("Google Sign-In Error:", error);
      let errorMessage = "Une erreur s'est produite lors de la connexion avec Google";

      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        errorMessage = "Connexion Google annulée";
      } else if (error.code === statusCodes.IN_PROGRESS) {
        errorMessage = "Connexion Google déjà en cours";
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        errorMessage = "Google Play Services n'est pas disponible";
      }

      updateErrorMessage(errorMessage);
    } finally {
      setSocialLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    setSocialLoading(true);
    try {
      const result = await authService.loginWithApple();

      if (result.success && result.token) {
        await AsyncStorage.setItem("userToken", result.token);
        navigation.replace("AppStack");
      } else {
        throw new Error(result.error || "Erreur de connexion Apple");
      }
    } catch (error: any) {
      console.error("Apple Sign-In Error:", error);
      updateErrorMessage("Une erreur s'est produite lors de la connexion avec Apple");
    } finally {
      setSocialLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsLoading(true);
    try {
      const response = isLogin
        ? await authService.login(email, password)
        : await authService.register({
            email,
            password,
            firstName,
            lastName,
          });

      if (response.success && response.token) {
        await AsyncStorage.setItem("userToken", response.token);
        navigation.replace("AppStack");
      } else {
        throw new Error(response.error || "Échec de l'authentification");
      }
    } catch (error: any) {
      console.error("Authentication Error:", error);
      updateErrorMessage(
        error.message || "Une erreur s'est produite lors de l'authentification"
      );
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#4247BD", "#4247BD", "#4247BD"]}
        style={styles.background}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.formContainer}>
            <Text style={styles.title}>
              {isLogin ? "Connexion" : "Inscription"}
            </Text>

            {errorMessage ? (
              <Text style={styles.globalError}>{errorMessage}</Text>
            ) : null}

            {!isLogin && (
              <>
                <TextInput
                  style={[styles.input, errors.firstName && styles.inputError]}
                  placeholder="Prénom"
                  placeholderTextColor="#666"
                  value={firstName}
                  onChangeText={setFirstName}
                  editable={!isLoading}
                />
                {errors.firstName && (
                  <Text style={styles.errorText}>{errors.firstName}</Text>
                )}

                <TextInput
                  style={[styles.input, errors.lastName && styles.inputError]}
                  placeholder="Nom"
                  placeholderTextColor="#666"
                  value={lastName}
                  onChangeText={setLastName}
                  editable={!isLoading}
                />
                {errors.lastName && (
                  <Text style={styles.errorText}>{errors.lastName}</Text>
                )}
              </>
            )}

            <TextInput
              style={[styles.input, errors.email && styles.inputError]}
              placeholder="Email"
              placeholderTextColor="#666"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              editable={!isLoading}
            />
            {errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}

            <TextInput
              style={[styles.input, errors.password && styles.inputError]}
              placeholder="Mot de passe"
              placeholderTextColor="#666"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              editable={!isLoading}
            />
            {errors.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}

            <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonText}>
                  {isLogin ? "Se connecter" : "S'inscrire"}
                </Text>
              )}
            </TouchableOpacity>

            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>ou</Text>
              <View style={styles.divider} />
            </View>

            <View style={styles.socialButtons}>
              <TouchableOpacity
                style={[styles.socialButton, styles.googleButton]}
                onPress={handleGoogleSignIn}
                disabled={socialLoading}
              >
                <View style={styles.socialButtonContent}>
                  <AntDesign name="google" size={20} color="#4285F4" />
                  <Text style={styles.googleButtonText}>
                    Continuer avec Google
                  </Text>
                </View>
              </TouchableOpacity>

              {Platform.OS === "ios" && (
                <TouchableOpacity
                  style={[styles.socialButton, styles.appleButton]}
                  onPress={handleAppleSignIn}
                  disabled={socialLoading}
                >
                  <View style={styles.socialButtonContent}>
                    <AntDesign name="apple1" size={20} color="#FFFFFF" />
                    <Text style={styles.appleButtonText}>
                      Continuer avec Apple
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            </View>

            <TouchableOpacity
              style={styles.switchButton}
              onPress={() => {
                if (!isLoading) {
                  setIsLogin(!isLogin);
                  setErrors({});
                  setErrorMessage("");
                }
              }}
              disabled={isLoading}
            >
              <Text style={styles.switchText}>
                {isLogin ? "Créer un compte" : "Déjà un compte ? Se connecter"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingVertical: 40,
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
  },
  title: {
    fontSize: 28,
    color: "#FFFFFF",
    marginBottom: 30,
    textAlign: "center",
    fontWeight: "bold",
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
    width: "100%",
  },
  inputError: {
    borderColor: "#FF6B6B",
    borderWidth: 1,
  },
  errorText: {
    color: "#FF6B6B",
    fontSize: 14,
    marginBottom: 12,
    marginTop: -8,
  },
  button: {
    backgroundColor: "#FF8F66",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  dividerText: {
    color: "#FFFFFF",
    paddingHorizontal: 10,
    fontSize: 14,
  },
  socialButtons: {
    marginTop: 10,
  },
  socialButton: {
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  socialButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  googleButton: {
    backgroundColor: "#FFFFFF",
  },
  appleButton: {
    backgroundColor: "#000000",
  },
  googleButtonText: {
    color: "#000000",
    marginLeft: 12,
    fontSize: 16,
    fontWeight: "600",
  },
  appleButtonText: {
    color: "#FFFFFF",
    marginLeft: 12,
    fontSize: 16,
    fontWeight: "600",
  },
  switchButton: {
    marginTop: 20,
    alignItems: "center",
    padding: 10,
  },
  switchText: {
    color: "#FFFFFF",
    fontSize: 14,
    textDecorationLine: "underline",
  },
  globalError: {
    color: "#FF6B6B",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
    backgroundColor: "rgba(255, 107, 107, 0.1)",
    padding: 12,
    borderRadius: 8,
  },
});
