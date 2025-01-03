export interface User {
  id: string;
  email: string;
  password_hash?: string;
  firstName?: string;
  lastName?: string;
  auth_provider?: string;
  auth_provider_id?: string;
  created_at: string;
  last_login?: string;
}

export interface DatabaseProfile {
  profile_url: string;
  first_name: string;
  last_name: string;
  title?: string;
  company?: string;
  location?: string;
  scanned_at?: string;
  updated_at?: string;
}

export interface LinkedInProfile {
  id: string;
  firstName: string;
  lastName: string;
  title: string;
  company: string;
  location: string;
  profileUrl: string;
  scannedAt: string;
}

export interface DecodedToken {
  userId: string;
  exp: number;
}

export interface QueryResult<T> {
  rows: T[];
}

export interface ApplicationUser {
  id: string;
  email: string;
  password_hash?: string;
  firstName?: string;
  lastName?: string;
  auth_provider?: string;
  auth_provider_id?: string;
  created_at: string;
  last_login?: string;
}

export interface GoogleSignInUser {
  user: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    name: string | null;
    photo: string | null;
  };
}
export interface GoogleSignInResponse {
  idToken: string | null;
  serverAuthCode: string | null;
  scopes: string[];
  user: {
    email: string;
    familyName: string | null;
    givenName: string | null;
    id: string;
    name: string | null;
    photo: string | null;
  };
}
