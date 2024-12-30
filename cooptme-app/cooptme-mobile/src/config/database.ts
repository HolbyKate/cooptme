import AsyncStorage from "@react-native-async-storage/async-storage";

const DB_KEY = "linkedin_profiles_db";

interface DatabaseProfile {
  profile_url: string;
  first_name: string;
  last_name: string;
  title?: string;
  company?: string;
  location?: string;
  scanned_at?: string;
  updated_at?: string;
}

interface QueryResult {
  rows: DatabaseProfile[];
}

export const database = {
  async query(operation: string, params?: DatabaseProfile[]): Promise<QueryResult> {
    try {
      const data = await AsyncStorage.getItem(DB_KEY);
      const profiles: DatabaseProfile[] = data ? JSON.parse(data) : [];

      switch (operation) {
        case "SELECT":
          return { rows: profiles };
        case "INSERT":
          if (params && params[0]) {
            profiles.push(params[0]);
            await AsyncStorage.setItem(DB_KEY, JSON.stringify(profiles));
            return { rows: [params[0]] };
          }
          return { rows: [] };
        case "UPDATE":
          if (params && params[0]) {
            const index = profiles.findIndex(
              (p) => p.profile_url === params[0].profile_url
            );
            if (index !== -1) {
              profiles[index] = { ...profiles[index], ...params[0] };
              await AsyncStorage.setItem(DB_KEY, JSON.stringify(profiles));
              return { rows: [profiles[index]] };
            }
          }
          return { rows: [] };
        default:
          throw new Error("Operation not supported");
      }
    } catch (error) {
      console.error("Database error:", error);
      throw error;
    }
  },
};

export type { DatabaseProfile, QueryResult };
export default database;