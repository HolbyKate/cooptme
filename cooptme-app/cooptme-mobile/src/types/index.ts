export interface User {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
}

export interface DatabaseProfile {
    profile_url: string;
    first_name: string;
    last_name: string;
    title?: string;
    company?: string;
    location?: string;
    scanned_at?: string;
    updated_at: string;
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

export interface AuthResponse {
    success: boolean;
    token?: string;
    user?: User;
    error?: string;
}

export interface SocialLoginData {
    type: 'google' | 'apple';
    token: string;
    email: string;
    firstName?: string;
    lastName?: string;
}
