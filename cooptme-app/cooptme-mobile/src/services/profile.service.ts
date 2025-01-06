import { apiClient } from '../middleware/api.middleware';
import { Profile, LinkedInProfile } from '../types/';

class ProfileService {
    async getProfile(): Promise<Profile> {
        try {
            const response = await apiClient.get('/profile');
            return response.data;
        } catch (error: any) {
            throw new Error(error.message || 'Erreur de récupération du profil');
        }
    }

    async updateProfile(data: Partial<Profile>): Promise<Profile> {
        try {
            const response = await apiClient.put('/profile', data);
            return response.data;
        } catch (error: any) {
            throw new Error(error.message || 'Erreur de mise à jour du profil');
        }
    }

    async syncProfile(linkedInProfile: LinkedInProfile): Promise<void> {
        try {
            await apiClient.post('/profile/sync', { profile: linkedInProfile });
        } catch (error: any) {
            throw new Error(error.message || 'Erreur de synchronisation du profil');
        }
    }

    async uploadProfilePicture(imageUri: string): Promise<string> {
        try {
            const formData = new FormData();
            formData.append('image', {
                uri: imageUri,
                type: 'image/jpeg',
                name: 'profile-picture.jpg',
            } as any);

            const response = await apiClient.post('/profile/picture', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            return response.data.imageUrl;
        } catch (error: any) {
            throw new Error(error.message || 'Erreur lors du téléchargement de l\'image');
        }
    }
}

export const profileService = new ProfileService();