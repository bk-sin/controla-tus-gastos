import { CreditCard } from "@/components/dashboard";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "../database.types";
import { DbCreditCard } from "../supabase";

export class CreditCardService {
  private supabase = createClientComponentClient<Database>();

  async getCreditCardList(): Promise<CreditCard[]> {
    const { data, error } = await this.supabase.from("creditCards").select("*");
    if (error) {
      console.error("Error fetching fixed expense categories:", error);
      return [];
    }

    return data.map((creditCard: DbCreditCard) => ({
      id: creditCard.id,
      name: creditCard.name,
      color: creditCard.color,
      userId: creditCard.userId,
      lastNumbers: creditCard?.lastNumbers,
      limit: creditCard?.limit,
      closingDay: creditCard?.closingDay,
      dueDay: creditCard?.dueDay,
    }));
  }

  async addCreditCard(card: Omit<CreditCard, "id">): Promise<DbCreditCard> {
    const newCreditCard: Omit<CreditCard, "id"> = {
      color: card.color,
      name: card.name,
      closingDay: card.closingDay,
      dueDay: card.dueDay,
      limit: card.limit,
      lastNumbers: card.lastNumbers,
      userId: (await this.supabase.auth.getUser()).data.user?.id as string,
    };

    const { data, error } = await this.supabase
      .from("creditCards")
      .insert(newCreditCard)
      .select(`*`)
      .single();

    if (error) {
      throw new Error(`Error adding credit card: ${error.message}`);
    }

    return data;
  }

  async updateCreditCard(card: CreditCard): Promise<DbCreditCard> {
    const { data, error } = await this.supabase
      .from("creditCards")
      .update(card)
      .eq("id", card.id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  async deleteCreditCard(id: string): Promise<void> {
    const { error } = await this.supabase
      .from("creditCards")
      .delete()
      .eq("id", id);
    if (error) {
      throw error;
    }
  }
}

export const creditCardService = new CreditCardService();
