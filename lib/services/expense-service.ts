import type {
  CreditCardPayment,
  Expense,
  ExpenseCategory,
  FixedExpense,
} from "@/components/dashboard";
import type { Database } from "@/lib/database.types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { v4 as uuidv4 } from "uuid";
import { DbExpense, DbExpenseCategory } from "../supabase";

export class ExpenseService {
  private supabase = createClientComponentClient<Database>();

  async getExpenses(): Promise<Expense[]> {
    const { data, error } = await this.supabase
      .from("expenses")
      .select("*")
      .eq("isFixed", false)
      .order("date", { ascending: false });

    if (error) {
      console.error("Error fetching expenses:", error);
      return [];
    }

    return data.map((expense: DbExpense) => ({
      id: expense.id,
      amount: expense.amount,
      category: expense.type,
      date: expense.date,
      description: expense?.description || "",
    }));
  }

  async addExpense(
    expense: Omit<Expense, "id" | "date">
  ): Promise<Expense | null> {
    const newExpense = {
      userId: (await this.supabase.auth.getUser()).data.user?.id as string,
      description: expense.description,
      amount: expense.amount,
      category: expense.category,
      date: new Date().toISOString(),
    };

    const { data, error } = await this.supabase
      .from("expenses")
      .insert(newExpense)
      .select()
      .single();

    if (error) {
      console.error("Error adding expense:", error);
      return null;
    }

    return {
      id: data.id,
      description: data.description,
      amount: data.amount,
      category: data.category,
      date: data.date,
    };
  }

  async updateExpense(expense: Expense): Promise<boolean> {
    const { error } = await this.supabase
      .from("expenses")
      .update({
        description: expense.description,
        amount: expense.amount,
        category: expense.category,
      })
      .eq("id", expense.id);

    if (error) {
      console.error("Error updating expense:", error);
      return false;
    }

    return true;
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

    return data.map((payment) => ({
      id: payment.id,
      description: payment.description,
      amount: payment.amount,
      card: payment.card,
      currentInstallment: payment.current_installment,
      totalInstallments: payment.total_installments,
      date: payment.date,
    }));
  }

  async addCreditCardPayment(
    payment: Omit<CreditCardPayment, "id" | "date">
  ): Promise<CreditCardPayment | null> {
    const newPayment = {
      id: uuidv4(),
      user_id: (await this.supabase.auth.getUser()).data.user?.id as string,
      description: payment.description,
      amount: payment.amount,
      card: payment.card,
      current_installment: payment.currentInstallment,
      total_installments: payment.totalInstallments,
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

    return {
      id: data.id,
      description: data.description,
      amount: data.amount,
      card: data.card,
      currentInstallment: data.current_installment,
      totalInstallments: data.total_installments,
      date: data.date,
    };
  }

  async updateCreditCardPayment(payment: CreditCardPayment): Promise<boolean> {
    const { error } = await this.supabase
      .from("creditCardPayments")
      .update({
        description: payment.description,
        amount: payment.amount,
        card: payment.card,
        current_installment: payment.currentInstallment,
        total_installments: payment.totalInstallments,
      })
      .eq("id", payment.id);

    if (error) {
      console.error("Error updating credit card payment:", error);
      return false;
    }

    return true;
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

  async getFixedExpenses(): Promise<FixedExpense[]> {
    const { data, error } = await this.supabase
      .from("expenses")
      .select(`*, expenseCategories(*)`)
      .eq("isFixed", true)
      .order("date", { ascending: false });

    if (error) {
      console.error("Error fetching fixed expenses:", error);
      return [];
    }

    return data.map((expense: DbExpense) => ({
      id: expense.id,
      description: expense?.description || "",
      amount: expense.amount,
      type: expense.type,
      date: expense.date,
      isFixed: true,
      userId: expense.userId,
      category: {
        id: expense.expenseCategories.id,
        name: expense.expenseCategories.name,
        isFixed: expense.expenseCategories.isFixed,
        value: expense.expenseCategories.value,
        color: expense.expenseCategories.color,
      },
    }));
  }

  async addFixedExpense(
    expense: Omit<FixedExpense, "id" | "date">
  ): Promise<FixedExpense | null> {
    const newExpense = {
      amount: expense.amount,
      type: expense.type,
      description: expense.description,
      userId: (await this.supabase.auth.getUser()).data.user?.id as string,
      isFixed: true,
    };

    const { data, error } = await this.supabase
      .from("expenses")
      .insert(newExpense)
      .select(`*, expenseCategories(*)`)
      .single();

    if (error) {
      console.error("Error adding fixed expense:", error);
      return null;
    }

    return {
      id: data.id,
      description: data.description,
      amount: data.amount,
      type: data.type,
      date: data.date,
      category: data.expenseCategories,
      isFixed: true,
    };
  }

  async updateFixedExpense(expense: FixedExpense): Promise<boolean> {
    const { error } = await this.supabase
      .from("expenses")
      .update({
        description: expense.description,
        amount: expense.amount,
        type: expense.type,
      })
      .eq("id", expense.id)
      .select(`*, expenseCategories(*)`);

    if (error) {
      console.error("Error updating fixed expense:", error);
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

  async getFixedExpenseCategories(): Promise<ExpenseCategory[]> {
    const { data, error } = await this.supabase
      .from("expenseCategories")
      .select("*")
      .eq("isFixed", true);
    if (error) {
      console.error("Error fetching fixed expense categories:", error);
      return [];
    }

    return data.map((expenseCategory: DbExpenseCategory) => ({
      id: expenseCategory.id,
      isFixed: expenseCategory.isFixed,
      name: expenseCategory.name,
      value: expenseCategory.value,
      color: expenseCategory.color,
    }));
  }

  async getExpenseCategories(): Promise<ExpenseCategory[]> {
    const { data, error } = await this.supabase
      .from("expenseCategories")
      .select("*")
      .eq("isFixed", false);
    if (error) {
      console.error("Error fetching expense categories:", error);
      return [];
    }

    return data.map((expenseCategory: DbExpenseCategory) => ({
      id: expenseCategory.id,
      isFixed: expenseCategory.isFixed,
      name: expenseCategory.name,
      value: expenseCategory.value,
      color: expenseCategory.color,
    }));
  }
}

export const expenseService = new ExpenseService();
