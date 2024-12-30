import { database, DatabaseProfile } from "../config/database";
import { LinkedInProfile } from "../utils/linkedinScraper";

export const profileService = {
  async syncProfile(profile: LinkedInProfile): Promise<void> {
    try {
      const { rows: existing } = await database.query("SELECT");
      const existingProfile = existing.find(
        (p: DatabaseProfile) => p.profile_url === profile.profileUrl
      );

      const profileData: DatabaseProfile = {
        profile_url: profile.profileUrl,
        first_name: profile.firstName,
        last_name: profile.lastName,
        title: profile.title,
        company: profile.company,
        location: profile.location,
        scanned_at: profile.scannedAt,
        updated_at: new Date().toISOString(),
      };

      if (existingProfile) {
        await database.query("UPDATE", [profileData]);
      } else {
        await database.query("INSERT", [profileData]);
      }
    } catch (error) {
      console.error("Erreur lors de la synchronisation du profil:", error);
      throw error;
    }
  },

  async getProfiles(): Promise<LinkedInProfile[]> {
    try {
      const { rows } = await database.query("SELECT");
      return rows.map(this.mapDbProfileToLinkedInProfile);
    } catch (error) {
      console.error("Erreur lors de la récupération des profils:", error);
      throw error;
    }
  },

  mapDbProfileToLinkedInProfile(dbProfile: DatabaseProfile): LinkedInProfile {
    return {
      id: `profile_${Date.now()}`,
      firstName: dbProfile.first_name,
      lastName: dbProfile.last_name,
      title: dbProfile.title || "",
      company: dbProfile.company || "",
      location: dbProfile.location || "",
      scannedAt: dbProfile.scanned_at || new Date().toISOString(),
      profileUrl: dbProfile.profile_url,
    };
  },
};

export default profileService;
