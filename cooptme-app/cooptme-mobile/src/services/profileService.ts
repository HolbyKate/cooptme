import { PostgrestResponse } from "@supabase/supabase-js";
import { supabase } from "../config/supabaseClient";
import { LinkedInProfile } from "../utils/linkedinScraper";

export const profileService = {
  async syncProfile(profile: LinkedInProfile): Promise<void> {
    try {
      // Vérifier si le profil existe déjà
      const { data: existingProfile } = await supabase
        .from("linkedin_profiles")
        .select()
        .eq("profile_url", profile.profileUrl)
        .single();

      if (existingProfile) {
        // Mise à jour du profil existant
        await supabase
          .from("linkedin_profiles")
          .update({
            first_name: profile.firstName,
            last_name: profile.lastName,
            title: profile.title,
            company: profile.company,
            location: profile.location,
            updated_at: new Date().toISOString(),
          })
          .eq("profile_url", profile.profileUrl);
      } else {
        // Création d'un nouveau profil
        await supabase.from("linkedin_profiles").insert({
          profile_url: profile.profileUrl,
          first_name: profile.firstName,
          last_name: profile.lastName,
          title: profile.title,
          company: profile.company,
          location: profile.location,
          scanned_at: profile.scannedAt,
        });
      }
    } catch (error) {
      console.error("Erreur lors de la synchronisation du profil:", error);
      throw error;
    }
  },

  async getProfiles(): Promise<LinkedInProfile[]> {
    const { data, error } = await supabase
      .from("linkedin_profiles")
      .select("*")
      .order("scanned_at", { ascending: false });

    if (error) throw error;
    return data.map(this.mapDbProfileToLinkedInProfile);
  },

  mapDbProfileToLinkedInProfile(dbProfile: any): LinkedInProfile {
    return {
      id: dbProfile.id,
      firstName: dbProfile.first_name,
      lastName: dbProfile.last_name,
      title: dbProfile.title,
      company: dbProfile.company,
      location: dbProfile.location,
      scannedAt: dbProfile.scanned_at,
      profileUrl: dbProfile.profile_url,
    };
  },
};
