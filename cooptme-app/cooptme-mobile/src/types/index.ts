export interface User {
  id: string;
  email: string;
  password_hash?: string;
  first_name?: string;
  last_name?: string;
  auth_provider?: string;
  auth_provider_id?: string;
  created_at: string;
  last_login?: string;
}

export interface DecodedToken {
  userId: string;
  exp: number;
}

export interface GoogleSignInUser {
  user: {
    email: string;
    familyName: string | null;
    givenName: string | null;
    id: string;
    name: string | null;
    photo: string | null;
  }
}