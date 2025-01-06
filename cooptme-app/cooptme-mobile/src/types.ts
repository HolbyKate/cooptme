export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  auth0Id?: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: User;
  error?: string;
}

export interface UserData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface DecodedToken {
  sub: string;
  email: string;
  exp: number;
}

export interface ValidationErrors {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
}

export interface SocialAuthCredential {
  token: string;
  email: string;
  firstName?: string;
  lastName?: string;
  provider: 'google' | 'apple' | 'auth0';
} 