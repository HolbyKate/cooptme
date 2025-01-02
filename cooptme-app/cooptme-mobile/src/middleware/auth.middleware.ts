import AsyncStorage from "@react-native-async-storage/async-storage";
import { decode as atob } from 'base-64';
import { DecodedToken } from "../types";

export const getAuthToken = async () => {
  return await AsyncStorage.getItem("userToken");
};

export const verifyToken = (token: string) => {
  try {
    // Parse JWT manuellement puisque jwt-decode ne fonctionne pas bien en RN
    const [, payload] = token.split('.');
    const decodedPayload = JSON.parse(atob(payload)) as DecodedToken;
    const currentTime = Date.now() / 1000;
    
    if (decodedPayload.exp < currentTime) {
      throw new Error("Token expiré");
    }
    
    return decodedPayload;
  } catch (error) {
    throw new Error("Token invalide");
  }
};

export const requireAuth = async () => {
  const token = await getAuthToken();
  if (!token) {
    throw new Error("Non authentifié");
  }
  return verifyToken(token);
};
