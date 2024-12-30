import NetInfo from "@react-native-community/netinfo";
import { profileService } from "../services/profileService";
import { getProfiles } from "./linkedinScraper";

export const syncManager = {
  async syncProfiles(): Promise<void> {
    try {
      const networkState = await NetInfo.fetch();
      if (!networkState.isConnected) return;

      const localProfiles = await getProfiles();

      for (const profile of localProfiles) {
        await profileService.syncProfile(profile);
      }
    } catch (error) {
      console.error("Erreur lors de la synchronisation:", error);
    }
  },

  setupPeriodicSync(intervalMinutes: number = 15) {
    setInterval(this.syncProfiles, intervalMinutes * 60 * 1000);
  },
};
