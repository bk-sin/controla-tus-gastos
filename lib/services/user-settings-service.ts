import { Profile } from "@/components/settings/profile-tab";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "../database.types";
import { DbUserSettings } from "../supabase";

export class UserSettingsService {
  private supabase = createClientComponentClient<Database>();

  async updateUserProfile(
    profile: Omit<Profile, "email">
  ): Promise<DbUserSettings> {
    const { data, error } = await this.supabase
      .from("userSettings")
      .update(profile)
      .eq("id", profile.id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  }
}

export const userSettingsService = new UserSettingsService();
