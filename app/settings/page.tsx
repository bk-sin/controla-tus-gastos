import { SettingsPage } from "@/components/settings/settings-page";
import { DbUserSettings } from "@/lib/supabase";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Settings() {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  const { data: categories, error: categoriesError } = await supabase
    .from("expenseCategories")
    .select("*");
  const { data: cards, error: cardsError } = await supabase
    .from("creditCards")
    .select("*");
  const { data: profileData, error: profileError } = await supabase
    .from("userSettings")
    .select("*")
    .single();
  const { data: currenciesData, error: currenciesError } = await supabase
    .from("currencies")
    .select("*");
  const profile: DbUserSettings | null =
    profileError || !profileData ? null : (profileData as DbUserSettings);

  return (
    <main className="min-h-screen bg-background">
      <SettingsPage
        categories={categoriesError ? [] : categories}
        cards={cardsError ? [] : cards}
        profile={profile || ({} as DbUserSettings)}
        currencies={currenciesError ? [] : currenciesData}
      />
    </main>
  );
}
