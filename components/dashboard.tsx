"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import {
  AlertCircle,
  CreditCard,
  DollarSign,
  LogOut,
  Settings,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import type { Database } from "@/lib/database.types";
import { useUser } from "@/lib/hooks/use-user";
import { expenseService } from "@/lib/services/expense-service";
import Link from "next/link";
import CreditCardTable from "./credit-card-table";
import ExpenseForm from "./expense-form";
import ExpenseTable from "./expense-table";
import FinancialSummary from "./financial-summary";
import FixedExpensesTable from "./fixed-expenses-table";

export type Expense = {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
};

export type CreditCardPayment = {
  id: string;
  description: string;
  amount: number;
  card: string;
  currentInstallment: number;
  totalInstallments: number;
  date: string;
};

export type CreditCard = {
  id: string;
  name: string;
  color: string;
  lastNumbers?: number;
  limit?: number;
  closingDay?: number;
  dueDay?: number;
  userId: string;
};

export type FixedExpense = {
  id: string;
  description: string;
  amount: number;
  type: string;
  date: string;
  isFixed: boolean;
  category: ExpenseCategory;
};

export type ExpenseCategory = {
  id: string;
  name: string;
  isFixed: boolean;
  value: string;
  color: string;
};

export default function Dashboard() {
  const [income, setIncome] = useState<number>(0);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [expenseCategories, setExpenseCategories] = useState<ExpenseCategory[]>(
    []
  );
  const [fixedExpenseCategories, setFixedExpenseCategories] = useState<
    ExpenseCategory[]
  >([]);

  const [creditCardPayments, setCreditCardPayments] = useState<
    CreditCardPayment[]
  >([]);
  const [fixedExpenses, setFixedExpenses] = useState<FixedExpense[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();

  // Cargar datos desde Supabase
  useEffect(() => {
    const loadData = async () => {
      if (!user) return;

      setLoading(true);
      try {
        // Cargar ingresos del usuario
        const userIncome = await expenseService.getUserIncome();
        setIncome(userIncome);

        // Cargar tipo de gastos del usuario
        const expenseCategories = await expenseService.getExpenseCategories();
        setExpenseCategories(expenseCategories);

        // Cargar tipo de gastos fijos del usuario
        const fixedExpenseCategoryList =
          await expenseService.getFixedExpenseCategories();
        setFixedExpenseCategories(fixedExpenseCategoryList);

        // Cargar gastos variables
        const userExpenses = await expenseService.getExpenses();
        setExpenses(userExpenses);

        // Cargar pagos de tarjetas de crédito
        const userCreditCardPayments =
          await expenseService.getCreditCardPayments();
        setCreditCardPayments(userCreditCardPayments);

        // Cargar gastos fijos
        const userFixedExpenses = await expenseService.getFixedExpenses();
        setFixedExpenses(userFixedExpenses);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  // Calculate totals
  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );
  const totalCreditCardPayments = creditCardPayments.reduce(
    (sum, payment) => sum + payment.amount,
    0
  );
  const totalFixedExpenses = fixedExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );
  const totalSpent =
    totalExpenses + totalCreditCardPayments + totalFixedExpenses;
  const remaining = income - totalSpent;
  const spentPercentage = income > 0 ? (totalSpent / income) * 100 : 0;

  // Handle income update
  const handleIncomeChange = async (newIncome: number) => {
    setIncome(newIncome);
    expenseService.updateUserIncome(newIncome);
  };

  // Handle adding a new expense
  const handleAddExpense = async (expense: Omit<Expense, "id" | "date">) => {
    const newExpense = await expenseService.addExpense(expense);
    if (newExpense) {
      setExpenses([newExpense, ...expenses]);
    }
  };

  // Handle editing an expense
  const handleEditExpense = async (updatedExpense: Expense) => {
    const success = await expenseService.updateExpense(updatedExpense);
    if (success) {
      setExpenses(
        expenses.map((expense) =>
          expense.id === updatedExpense.id ? updatedExpense : expense
        )
      );
    }
  };

  // Handle deleting an expense
  const handleDeleteExpense = async (id: string) => {
    const success = await expenseService.deleteExpense(id);
    if (success) {
      setExpenses(expenses.filter((expense) => expense.id !== id));
    }
  };

  // Handle adding a new credit card payment
  const handleAddCreditCardPayment = async (
    payment: Omit<CreditCardPayment, "id" | "date">
  ) => {
    const newPayment = await expenseService.addCreditCardPayment(payment);
    if (newPayment) {
      setCreditCardPayments([newPayment, ...creditCardPayments]);
    }
  };

  // Handle editing a credit card payment
  const handleEditCreditCardPayment = async (
    updatedPayment: CreditCardPayment
  ) => {
    const success = await expenseService.updateCreditCardPayment(
      updatedPayment
    );
    if (success) {
      setCreditCardPayments(
        creditCardPayments.map((payment) =>
          payment.id === updatedPayment.id ? updatedPayment : payment
        )
      );
    }
  };

  // Handle deleting a credit card payment
  const handleDeleteCreditCardPayment = async (id: string) => {
    const success = await expenseService.deleteCreditCardPayment(id);
    if (success) {
      setCreditCardPayments(
        creditCardPayments.filter((payment) => payment.id !== id)
      );
    }
  };

  // Handle adding a new fixed expense
  const handleAddFixedExpense = async (
    expense: Omit<FixedExpense, "id" | "date">
  ) => {
    const newExpense = await expenseService.addFixedExpense(expense);
    if (newExpense) {
      setFixedExpenses([newExpense, ...fixedExpenses]);
    }
  };

  // Handle editing a fixed expense
  const handleEditFixedExpense = async (updatedExpense: FixedExpense) => {
    const success = await expenseService.updateFixedExpense(updatedExpense);
    if (success) {
      setFixedExpenses(
        fixedExpenses.map((expense) =>
          expense.id === updatedExpense.id ? updatedExpense : expense
        )
      );
    }
  };

  // Handle deleting a fixed expense
  const handleDeleteFixedExpense = async (id: string) => {
    const success = await expenseService.deleteExpense(id);
    if (success) {
      setFixedExpenses(fixedExpenses.filter((expense) => expense.id !== id));
    }
  };

  // Handle logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-terracotta-500 mx-auto mb-4"></div>
          <p className="text-terracotta-700">
            Cargando tus datos financieros...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex flex-col space-y-2 md:flex-row md:justify-between md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">
            Gestión Financiera Personal
          </h1>
          <p className="text-muted-foreground">
            Controla tus gastos, pagos de tarjetas y gastos fijos en un solo
            lugar.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/settings">
            <Button
              variant="outline"
              className="flex items-center gap-2 border-primary/50 hover:border-primary/50 hover:bg-muted text-primary"
            >
              <Settings className="h-4 w-4" />
              Configuración
            </Button>
          </Link>
          <Button
            variant="outline"
            className="flex items-center gap-2 border-primary/50 hover:border-primary/50 hover:bg-muted text-primary"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Cerrar sesión
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ingresos Mensuales
            </CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              ${income.toLocaleString("es-AR")}
            </div>
            <p className="text-xs text-muted-foreground">
              Tu ingreso mensual total
            </p>
            <input
              type="number"
              value={income || ""}
              onChange={(e) =>
                handleIncomeChange(Number.parseFloat(e.target.value) || 0)
              }
              className="mt-2 w-full rounded-md border border-border bg-background px-3 py-1 text-sm focus:border-terracotta-300 focus:ring focus:ring-terracotta-100"
              placeholder="Ingresa tu sueldo mensual"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Gastos Totales
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              ${totalSpent.toLocaleString("es-AR")}
            </div>
            <p className="text-xs text-muted-foreground">
              Total gastado este mes
            </p>
            <Progress value={spentPercentage} className="mt-2 bg-muted" />
            <p className="text-xs text-muted-foreground mt-1">
              {spentPercentage.toFixed(0)}% de tus ingresos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Saldo Disponible
            </CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                remaining < 0 ? "text-destructive" : "text-primary"
              }`}
            >
              ${remaining.toLocaleString("es-AR")}
            </div>
            <p className="text-xs text-muted-foreground">
              {remaining < 0
                ? "Has excedido tu presupuesto"
                : "Disponible para gastar"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tarjetas de Crédito
            </CardTitle>
            <CreditCard className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              ${totalCreditCardPayments.toLocaleString("es-AR")}
            </div>
            <p className="text-xs text-muted-foreground">
              Total en pagos de tarjetas
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="resumen" className="space-y-4">
        <TabsList className="bg-muted border-b border-muted">
          <TabsTrigger value="resumen">Resumen</TabsTrigger>
          <TabsTrigger value="gastos">Gastos Variables</TabsTrigger>
          <TabsTrigger value="tarjetas">Tarjetas de Crédito</TabsTrigger>
          <TabsTrigger value="fijos">Gastos Fijos</TabsTrigger>
        </TabsList>

        <TabsContent value="resumen" className="space-y-4">
          <FinancialSummary
            expenses={expenses}
            creditCardPayments={creditCardPayments}
            fixedExpenses={fixedExpenses}
            income={income}
          />
        </TabsContent>

        <TabsContent value="gastos" className="space-y-4">
          <ExpenseForm
            onAddExpense={handleAddExpense}
            categories={expenseCategories}
          />
          <ExpenseTable
            expenses={expenses}
            onEditExpense={handleEditExpense}
            onDeleteExpense={handleDeleteExpense}
          />
        </TabsContent>

        <TabsContent value="tarjetas" className="space-y-4">
          <ExpenseForm onAddExpense={handleAddCreditCardPayment} isCredit />
          <CreditCardTable
            payments={creditCardPayments}
            onEditPayment={handleEditCreditCardPayment}
            onDeletePayment={handleDeleteCreditCardPayment}
          />
        </TabsContent>

        <TabsContent value="fijos" className="space-y-4">
          <ExpenseForm
            onAddExpense={handleAddFixedExpense}
            fixedCategories={fixedExpenseCategories}
            isFixed
          />
          <FixedExpensesTable
            expenses={fixedExpenses}
            fixedCategories={fixedExpenseCategories}
            onEditExpense={handleEditFixedExpense}
            onDeleteExpense={handleDeleteFixedExpense}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
