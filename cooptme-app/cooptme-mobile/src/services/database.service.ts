import pool from "../config/database";
import { LinkedInProfile } from "../utils/linkedinScraper";

export const DatabaseService = {
  async saveProfile(profile: LinkedInProfile) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const query = `
        INSERT INTO linkedin_profiles (
          profile_url, first_name, last_name, title, 
          company, location, scanned_at
        ) 
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (profile_url) 
        DO UPDATE SET 
          first_name = EXCLUDED.first_name,
          last_name = EXCLUDED.last_name,
          title = EXCLUDED.title,
          company = EXCLUDED.company,
          location = EXCLUDED.location,
          updated_at = NOW()
        RETURNING *
      `;

      const values = [
        profile.profileUrl,
        profile.firstName,
        profile.lastName,
        profile.title,
        profile.company,
        profile.location,
        profile.scannedAt,
      ];

      const result = await client.query(query, values);
      await client.query("COMMIT");
      return result.rows[0];
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  },
};
