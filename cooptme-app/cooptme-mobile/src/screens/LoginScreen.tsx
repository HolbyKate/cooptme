import React, { useState } from 'react';
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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { authService } from '../services/api';

type LoginScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};

interface ValidationErrors {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
}

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return passwordRegex.test(password);
  };

  const validate = () => {
    const newErrors: ValidationErrors = {};
    setErrorMessage('');

    if (!validateEmail(email)) {
      newErrors.email = 'Adresse email invalide';
    }

    if (!validatePassword(password)) {
      newErrors.password = 'Le mot de passe doit contenir au moins 8 caractères, une majuscule, un chiffre et un caractère spécial';
    }

    if (!isLogin) {
      if (!firstName.trim()) {
        newErrors.firstName = 'Le prénom est requis';
      }
      if (!lastName.trim()) {
        newErrors.lastName = 'Le nom est requis';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validate()) {
      setIsLoading(true);
      try {
        if (isLogin) {
          await authService.login(email, password);
        } else {
          await authService.register({
            firstName,
            lastName,
            email,
            password,
          });
        }
        navigation.navigate('Home');
      } catch (error: any) {
        setErrorMessage(error.message || 'Une erreur est survenue');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#4247BD', '#4247BD', '#4247BD']}
        style={styles.background}
      />
      <View style={styles.content}>
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
                {isLogin ? 'Connexion' : 'Inscription'}
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
                    {isLogin ? 'Se connecter' : 'S\'inscrire'}
                  </Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.switchButton}
                onPress={() => {
                  if (!isLoading) {
                    setIsLogin(!isLogin);
                    setErrors({});
                    setErrorMessage('');
                  }
                }}
                disabled={isLoading}
              >
                <Text style={styles.switchText}>
                  {isLogin ? 'Créer un compte' : 'Déjà un compte ? Se connecter'}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  content: {
    flex: 1,
    zIndex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  title: {
    fontFamily: 'Quicksand-Bold',
    fontSize: 24,
    color: '#FFFFFF',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    fontFamily: 'Quicksand-Regular',
    fontSize: 16,
  },
  inputError: {
    borderColor: '#FF6B6B',
    borderWidth: 1,
  },
  errorText: {
    color: '#FF6B6B',
    fontFamily: 'Quicksand-Regular',
    fontSize: 12,
    marginBottom: 10,
    marginTop: -10,
  },
  button: {
    backgroundColor: '#FF8F66',
    borderRadius: 25,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#FFFFFF',
    fontFamily: 'Quicksand-Bold',
    fontSize: 16,
  },
  switchButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  switchText: {
    color: '#FFFFFF',
    fontFamily: 'Quicksand-Regular',
    fontSize: 14,
  },
  globalError: {
    color: '#FF6B6B',
    fontFamily: 'Quicksand-Regular',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    padding: 10,
    borderRadius: 5,
  },
});