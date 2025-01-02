import AsyncStorage from "@react-native-async-storage/async-storage";
import { DatabaseProfile, User } from "../types";

const DB_KEY = "linkedin_profiles_db";
const USERS_KEY = "users_db";

type DatabaseEntity = DatabaseProfile | User;
type DatabaseTable = "profiles" | "users";

interface QueryResult<T> {
  rows: T[];
}

export const database = {
  async query<T extends DatabaseEntity>(
    operation: string,
    params?: T[],
    table: DatabaseTable = "profiles"
  ): Promise<QueryResult<T>> {
    try {
      const dbKey = table === "users" ? USERS_KEY : DB_KEY;
      const data = await AsyncStorage.getItem(dbKey);
      const items: T[] = data ? JSON.parse(data) : [];

      switch (operation) {
        case "SELECT":
          return { rows: items };
        case "INSERT":
          if (params && params[0]) {
            items.push(params[0]);
            await AsyncStorage.setItem(dbKey, JSON.stringify(items));
            return { rows: [params[0]] };
          }
          return { rows: [] };
        case "UPDATE":
          if (params && params[0]) {
            const key = table === "users" ? "id" : "profile_url";
            const index = items.findIndex(
              (item: any) => item[key] === (params[0] as any)[key]
            );
            if (index !== -1) {
              items[index] = { ...items[index], ...params[0] };
              await AsyncStorage.setItem(dbKey, JSON.stringify(items));
              return { rows: [items[index]] };
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