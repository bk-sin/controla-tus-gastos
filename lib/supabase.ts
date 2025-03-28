import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type DbExpense = {
  id: string;
  amount: number;
  type: string;
  date: string;
  description?: string;
  userId: string;
  isFixed: boolean;
  categoryId: string;
  category: DbExpenseCategory;
};

export type DbExpenseCategory = {
  id: string;
  name: string;
  isFixed: boolean;
  isDefault: boolean;
  value: string;
  userId: string;
  color: string;
};

export type DbCreditCardPayment = {
  id: string;
  amount: number;
  card: string;
  currentInstallment: number;
  totalInstallment: number;
  date: string;
  description?: string;
  userId: string;
};

export type DbCreditCard = {
  id: string;
  name: string;
  description?: string;
  lastNumbers?: number;
  userId: string;
  color: string;
  limit?: number;
  closingDay?: number;
  dueDay?: number;
};

export type DbUserSettings = {
  id: string;
  userId: string;
  monthlyIncome: number;
  name?: string;
  currency?: string;
  language?: string;
  theme?: string;
};

export type DBCurrency = {
  id: string;
  label: string;
  symbol: string;
};
