import { database } from "../config/database";
import { DatabaseProfile, LinkedInProfile } from "../types";
import authService from "./auth.service";

class ProfileService {
  async syncProfile(profile: LinkedInProfile): Promise<void> {
    try {
      const currentUser = await authService.getCurrentUser();

      const { rows: existing } = await database.query<DatabaseProfile>(
        "SELECT * FROM profiles WHERE profile_url = $1",
        [profile.profileUrl]
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
        user_id: currentUser?.id
      };

      if (existing.length > 0) {
        await database.query(
          `UPDATE profiles
          SET first_name = $1, last_name = $2, title = $3,
          company = $4, location = $5, updated_at = $6
          WHERE profile_url = $7`,
          [
            profileData.first_name,
            profileData.last_name,
            profileData.title,
            profileData.company,
            profileData.location,
            profileData.updated_at,
            profileData.profile_url
          ]
        );
      } else {
        await database.query(
          `INSERT INTO profiles
          (profile_url, first_name, last_name, title, company,
          location, scanned_at, updated_at, user_id)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
          [
            profileData.profile_url,
            profileData.first_name,
            profileData.last_name,
            profileData.title,
            profileData.company,
            profileData.location,
            profileData.scanned_at,
            profileData.updated_at,
            profileData.user_id
          ]
        );
      }
    } catch (error) {
      console.error("Erreur lors de la synchronisation du profil:", error);
      throw new Error("Impossible de synchroniser le profil");
    }
  }

  async getProfiles(userId?: string): Promise<LinkedInProfile[]> {
    try {
      let query = "SELECT * FROM profiles";
      const params: any[] = [];

      if (userId) {
        query += " WHERE user_id = $1";
        params.push(userId);
      }

      query += " ORDER BY updated_at DESC";

      const { rows } = await database.query<DatabaseProfile>(query, params);
      return rows.map(this.mapDbProfileToLinkedInProfile);
    } catch (error) {
      console.error("Erreur lors de la récupération des profils:", error);
      throw new Error("Impossible de récupérer les profils");
    }
  }

  private mapDbProfileToLinkedInProfile(dbProfile: DatabaseProfile): LinkedInProfile {
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
  }
}

export const profileService = new ProfileService();
export default profileService;
