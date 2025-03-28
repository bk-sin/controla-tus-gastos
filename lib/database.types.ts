export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      expenses: {
        Row: {
          id: string;
          user_id: string;
          description: string;
          amount: number;
          category: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          description: string;
          amount: number;
          category: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          description?: string;
          amount?: number;
          category?: string;
        };
      };
      creditCardPayments: {
        Row: {
          id: string;
          user_id: string;
          description: string;
          amount: number;
          card: string;
          current_installment: number;
          total_installments: number;
        };
        Insert: {
          id?: string;
          user_id: string;
          description: string;
          amount: number;
          card: string;
          current_installment: number;
          total_installments: number;
        };
        Update: {
          id?: string;
          user_id?: string;
          description?: string;
          amount?: number;
          card?: string;
          current_installment?: number;
          total_installments?: number;
        };
      };
      user_settings: {
        Row: {
          id: string;
          user_id: string;
          monthlyIncome: number;
        };
        Insert: {
          id?: string;
          user_id: string;
          monthlyIncome: number;
        };
        Update: {
          id?: string;
          user_id?: string;
          monthlyIncome?: number;
        };
      };
    };
  };
}
