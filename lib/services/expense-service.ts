import type { CreditCardPayment, Expense } from "@/components/dashboard";
import type { Database } from "@/lib/database.types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { DbCreditCardPayment, DbExpense } from "../supabase";

export class ExpenseService {
  private supabase = createClientComponentClient<Database>();

  async getExpenses(isFixed = false): Promise<Expense[]> {
    const { data, error } = await this.supabase
      .from("expenses")
      .select("*, category:expenseCategories(*)")
      .eq("isFixed", isFixed)
      .order("date", { ascending: false });

    if (error) {
      console.error("Error fetching expenses:", error);
      return [];
    }
    return data;
  }

  async addExpense(
    expense: Omit<Expense, "id" | "date">
  ): Promise<DbExpense | null> {
    const newExpense = {
      userId: (await this.supabase.auth.getUser()).data.user?.id as string,
      description: expense.description,
      amount: expense.amount,
      categoryId: expense.categoryId,
      isFixed: expense.isFixed,
    };

    const { data, error } = await this.supabase
      .from("expenses")
      .insert(newExpense)
      .select("*, category:expenseCategories(*)")
      .single();

    if (error) {
      console.error("Error adding expense:", error);
      return null;
    }

    return data;
  }

  async updateExpense(expense: Expense): Promise<DbExpense | null> {
    const { data, error } = await this.supabase
      .from("expenses")
      .update({
        description: expense.description,
        amount: expense.amount,
        categoryId: expense.categoryId,
        isFixed: expense.isFixed,
      })
      .eq("id", expense.id)
      .select("*, category:expenseCategories(*)")
      .single();

    if (error) {
      console.error("Error updating expense:", error);
      return null;
    }

    return data;
  }

  async deleteExpense(id: string): Promise<boolean> {
    const { error } = await this.supabase
      .from("expenses")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting expense:", error);
      return false;
    }

    return true;
  }

  async getCreditCardPayments(): Promise<CreditCardPayment[]> {
    const { data, error } = await this.supabase
      .from("creditCardPayments")
      .select("*");

    if (error) {
      console.error("Error fetching credit card payments:", error);
      return [];
    }

    return data;
  }

  async addCreditCardPayment(
    payment: Omit<CreditCardPayment, "id" | "date">
  ): Promise<CreditCardPayment | null> {
    const newPayment = {
      description: payment.description,
      amount: payment.amount,
      card: payment.card,
      currentInstallment: payment.currentInstallment,
      totalInstallments: payment.totalInstallments,
      userId: (await this.supabase.auth.getUser()).data.user?.id,
    };

    const { data, error } = await this.supabase
      .from("creditCardPayments")
      .insert(newPayment)
      .select()
      .single();

    if (error) {
      console.error("Error adding credit card payment:", error);
      return null;
    }

    return data;
  }

  async updateCreditCardPayment(
    payment: CreditCardPayment
  ): Promise<DbCreditCardPayment | null> {
    const { data, error } = await this.supabase
      .from("creditCardPayments")
      .update({
        description: payment.description,
        amount: payment.amount,
        card: payment.card,
        currentInstallment: payment.currentInstallment,
        totalInstallments: payment.totalInstallments,
      })
      .eq("id", payment.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating credit card payment:", error);
      return null;
    }

    return data;
  }

  async deleteCreditCardPayment(id: string): Promise<boolean> {
    const { error } = await this.supabase
      .from("creditCardPayments")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting credit card payment:", error);
      return false;
    }

    return true;
  }

  async getUserIncome(): Promise<number> {
    const { data, error } = await this.supabase
      .from("userSettings")
      .select("monthlyIncome")
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // No se encontró ningún registro
        return 0;
      }
      console.error("Error fetching user income:", error);
      return 0;
    }

    return data?.monthlyIncome || 0;
  }

  async updateUserIncome(income: number): Promise<boolean> {
    const userId = (await this.supabase.auth.getUser()).data.user?.id;
    if (!userId) {
      return false;
    }

    const { error } = await this.supabase
      .from("userSettings")
      .upsert({ userId, monthlyIncome: income }, { onConflict: "userId" });

    if (error) {
      console.error("Error updating or inserting user income:", error);
      return false;
    }

    return true;
  }
}

export const expenseService = new ExpenseService();
