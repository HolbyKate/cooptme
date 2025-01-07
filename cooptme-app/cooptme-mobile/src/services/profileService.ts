import { apiClient } from '../middleware/api.middleware';
import { LinkedInProfile } from '../types/index';

class ProfileService {
  async syncProfile(profile: LinkedInProfile): Promise<void> {
    try {
      await apiClient.post('/profiles/sync', profile);
    } catch (error: any) {
      console.error("Erreur lors de la synchronisation du profil:", error);
      throw new Error(error.response?.data?.message || "Impossible de synchroniser le profil");
    }
  }

  async getProfiles(): Promise<LinkedInProfile[]> {
    try {
      const response = await apiClient.get('/profiles');
      return response.data;
    } catch (error: any) {
      console.error("Erreur lors de la récupération des profils:", error);
      throw new Error(error.response?.data?.message || "Impossible de récupérer les profils");
    }
  }
}

export const profileService = new ProfileService();
export default profileService;
