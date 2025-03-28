import { ExpenseCategory } from "@/components/dashboard";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "../database.types";
import { DbExpenseCategory } from "../supabase";

export class ExpenseCategoryService {
  private supabase = createClientComponentClient<Database>();

  async getExpenseCategoryList(isFixed = false): Promise<ExpenseCategory[]> {
    const { data, error } = await this.supabase
      .from("expenseCategories")
      .select("*")
      .eq("isFixed", isFixed);
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
      userId: expenseCategory.userId,
    }));
  }

  async addExpenseCategory(
    category: Omit<ExpenseCategory, "id">
  ): Promise<DbExpenseCategory> {
    const newCategory: Omit<ExpenseCategory, "id"> = {
      name: category.name,
      color: category.color,
      isFixed: category.isFixed,
      value: category.name.toLocaleLowerCase(),
      userId: (await this.supabase.auth.getUser()).data.user?.id as string,
    };

    const { data, error } = await this.supabase
      .from("expenseCategories")
      .insert(newCategory)
      .select(`*`)
      .single();

    if (error) {
      throw new Error(`Error adding credit card: ${error.message}`);
    }

    return data;
  }

  async updateExpenseCategory(
    category: ExpenseCategory
  ): Promise<DbExpenseCategory> {
    const { data, error } = await this.supabase
      .from("expenseCategories")
      .update(category)
      .eq("id", category.id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  async deleteExpenseCategory(id: string): Promise<void> {
    const { error } = await this.supabase
      .from("expenseCategories")
      .delete()
      .eq("id", id);
    if (error) {
      throw error;
    }
  }
}

export const expenseCategoryService = new ExpenseCategoryService();
