export interface LoginData {
    email: string;
    password: string;
}

export interface RegisterData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
}

export interface AuthResponse {
    token: string;
    user: {
        id: string;
        email: string;
        name: string;
    };
}

export interface Event {
    id?: string;
    title: string;
    description: string;
    date: Date;
    location: string;
    type: string;
    organizerId: string;
}

export interface EventDTO {
    id: string;
    title: string;
    description: string;
    date: string;
    location: string;
    type: string;
    createdAt: string;
    updatedAt: string;
    organizerId: string;
}

export interface Profile {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    title?: string;
    company?: string;
    location?: string;
    imageUrl?: string;
    bio?: string;
    createdAt: string;
    updatedAt: string;
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
    exp: number;
    iat: number;
    userId: string;
}
