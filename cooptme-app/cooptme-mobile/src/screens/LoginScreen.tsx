import React, { useState, useContext } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';
import authService from "../services/auth.service";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthContext, AuthContextType } from "../contexts/AuthContext";
import { AUTH0_DOMAIN, AUTH0_CLIENT_ID } from '@env';

interface LoginScreenProps {
  navigation: NativeStackNavigationProp<any>;
}

WebBrowser.maybeCompleteAuthSession();

// Configuration Auth0
const discovery = {
  authorizationEndpoint: `https://${AUTH0_DOMAIN}/authorize`,
  tokenEndpoint: `https://${AUTH0_DOMAIN}/oauth/token`,
  userInfoEndpoint: `https://${AUTH0_DOMAIN}/userinfo`,
};

const useAuth0 = () => {
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: AUTH0_CLIENT_ID,
      redirectUri: 'com.anonymous.cooptmemobile.auth0://dev-0t24v0qwt3cy3n7z.us.auth0.com',
      responseType: 'token',
      scopes: ['openid', 'profile', 'email'],
    },
    discovery
  );

  return { request, response, promptAsync };
};

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { signIn } = useContext(AuthContext) as AuthContextType;
  const { promptAsync } = useAuth0();

  const handleAuth0Login = async () => {
    setIsLoading(true);
    try {
      const authResult = await promptAsync();

      if (authResult?.type === 'success' && authResult.authentication) {
        const userInfoResponse = await fetch(discovery.userInfoEndpoint, {
          headers: {
            Authorization: `Bearer ${authResult.authentication.accessToken}`
          }
        });

        const userInfo = await userInfoResponse.json();

        const result = await authService.handleAuth0Login({
          email: userInfo.email,
          firstName: userInfo.given_name,
          lastName: userInfo.family_name,
          auth0Id: userInfo.sub
        });

        if (result.success && result.token) {
          await signIn(result.token, result.user);
          navigation.replace("MainApp");
        }
      }
    } catch (error: any) {
      console.error("Erreur Auth0:", error);
      setErrorMessage(error.message || "Erreur de connexion");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#4247BD", "#4247BD", "#4247BD"]}
        style={styles.background}
      />
      <View style={styles.content}>
        <Image
          source={require("../../assets/logo_transparent.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        {errorMessage ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : null}

        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleAuth0Login}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Se connecter avec Auth0</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

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
  errorText: {
    color: "#FF6B6B",
    fontSize: 14,
    marginBottom: 12,
    marginTop: -8,
  },
  loginButton: {
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
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 24,
  },
});
