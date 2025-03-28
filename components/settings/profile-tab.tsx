"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DBCurrency, DbUserSettings } from "@/lib/supabase";
import ProfileForm from "./profile-form";

export type Profile = {
  email: string;
} & Omit<DbUserSettings, "userId" | "monthlyIncome">;

export const ProfileTab = ({
  profile,
  onUpdate,
  currencies,
}: {
  profile: Profile;
  onUpdate: (data: Omit<Profile, "email">) => void;
  currencies: DBCurrency[];
}) => {
  const handleSubmit = async (data: Omit<Profile, "email">) => {
    try {
      await onUpdate({
        ...data,
      });
    } catch (error) {
      console.error("Error saving profile: ", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Perfil de Usuario</CardTitle>
      </CardHeader>
      <CardContent>
        <ProfileForm
          initialData={profile}
          onSubmit={handleSubmit}
          currencies={currencies}
        />
      </CardContent>
    </Card>
  );
};
