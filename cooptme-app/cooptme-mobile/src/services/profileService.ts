import { database } from "../config/database";
import { DatabaseProfile, LinkedInProfile } from "../types";

export const profileService = {
  async syncProfile(profile: LinkedInProfile): Promise<void> {
    try {
      const { rows: existing } = await database.query<DatabaseProfile>("SELECT", []);
      const existingProfile = existing.find(
        (p) => p.profile_url === profile.profileUrl
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
        await database.query<DatabaseProfile>("UPDATE", [profileData]);
      } else {
        await database.query<DatabaseProfile>("INSERT", [profileData]);
      }
    } catch (error) {
      console.error("Erreur lors de la synchronisation du profil:", error);
      throw error;
    }
  },

  async getProfiles(): Promise<LinkedInProfile[]> {
    try {
      const { rows } = await database.query<DatabaseProfile>("SELECT");
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
      profileUrl: dbProfile.profile_url,
      scannedAt: dbProfile.scanned_at || new Date().toISOString(),
    };
  },
};

export default profileService;
