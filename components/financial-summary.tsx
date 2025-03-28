"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, PieChart } from "lucide-react";
import type { CreditCardPayment, Expense, FixedExpense } from "./dashboard";

interface FinancialSummaryProps {
  expenses: Expense[];
  creditCardPayments: CreditCardPayment[];
  fixedExpenses: FixedExpense[];
  income: number;
}

export default function FinancialSummary({
  expenses,
  creditCardPayments,
  fixedExpenses,
  income,
}: FinancialSummaryProps) {
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

  // Group expenses by category
  const expensesByCategory = expenses.reduce((acc, expense) => {
    if (!acc[expense.category]) {
      acc[expense.category] = 0;
    }
    acc[expense.category] += expense.amount;
    return acc;
  }, {} as Record<string, number>);

  // Group credit card payments by card
  const paymentsByCard = creditCardPayments.reduce((acc, payment) => {
    if (!acc[payment.card]) {
      acc[payment.card] = 0;
    }
    acc[payment.card] += payment.amount;
    return acc;
  }, {} as Record<string, number>);

  // Group fixed expenses by type
  const expensesByType = fixedExpenses.reduce((acc, expense) => {
    if (!acc[expense.category.name]) {
      acc[expense.category.name] = 0;
    }
    acc[expense.category.name] += expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const getChartColor = (index: number) => {
    const colors = [
      "bg-blue-500", // Azul
      "bg-green-500", // Verde
      "bg-red-500", // Rojo
      "bg-purple-500", // Púrpura
      "bg-orange-500", // Naranja
      "bg-yellow-500", // Amarillo
      "bg-teal-500", // Verde azulado
      "bg-indigo-500", // Índigo
      "bg-pink-500", // Rosa
      "bg-gray-500", // Gris
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Distribución de Gastos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-4">
              <PieChart className="h-16 w-16 text-primary" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-primary rounded-full mr-2"></div>
                <span className="text-sm">
                  Gastos Variables:{" "}
                  {((totalExpenses / totalSpent) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-secondary rounded-full mr-2"></div>
                <span className="text-sm">
                  Tarjetas de Crédito:{" "}
                  {((totalCreditCardPayments / totalSpent) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-accent rounded-full mr-2"></div>
                <span className="text-sm">
                  Gastos Fijos:{" "}
                  {((totalFixedExpenses / totalSpent) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Resumen de Gastos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Gastos Variables</span>
                  <span className="text-sm">
                    ${totalExpenses.toLocaleString("es-AR")}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    Tarjetas de Crédito
                  </span>
                  <span className="text-sm">
                    ${totalCreditCardPayments.toLocaleString("es-AR")}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Gastos Fijos</span>
                  <span className="text-sm">
                    ${totalFixedExpenses.toLocaleString("es-AR")}
                  </span>
                </div>
              </div>
              <div className="pt-2 border-t border-border">
                <div className="flex items-center justify-between font-medium">
                  <span>Total Gastado</span>
                  <span>${totalSpent.toLocaleString("es-AR")}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Ingresos</span>
                  <span className="text-sm">
                    ${income.toLocaleString("es-AR")}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Gastos</span>
                  <span className="text-sm">
                    ${totalSpent.toLocaleString("es-AR")}
                  </span>
                </div>
              </div>
              <div className="pt-2 border-t border-border">
                <div className="flex items-center justify-between font-medium">
                  <span>Saldo</span>
                  <span
                    className={
                      remaining < 0 ? "text-destructive" : "text-primary"
                    }
                  >
                    ${remaining.toLocaleString("es-AR")}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Estado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center h-full py-4">
              <div className="text-2xl font-bold mb-2">
                {remaining >= 0 ? "✅ Positivo" : "⚠️ Negativo"}
              </div>
              <p className="text-sm text-center text-muted-foreground">
                {remaining >= 0
                  ? "Tu balance es positivo. ¡Buen trabajo!"
                  : "Tu balance es negativo. Considera reducir gastos."}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="categorias">
        <TabsList className="bg-muted">
          <TabsTrigger value="categorias">Por Categorías</TabsTrigger>
          <TabsTrigger value="tarjetas">Por Tarjetas</TabsTrigger>
          <TabsTrigger value="fijos">Gastos Fijos</TabsTrigger>
        </TabsList>

        <TabsContent value="categorias" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gastos por Categoría</CardTitle>
            </CardHeader>
            <CardContent>
              {Object.keys(expensesByCategory).length === 0 ? (
                <p className="text-center text-muted-foreground py-4">
                  No hay datos para mostrar
                </p>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-center py-4">
                    <BarChart className="h-16 w-16 text-primary" />
                  </div>
                  <div className="space-y-2">
                    {Object.entries(expensesByCategory).map(
                      ([category, amount], index) => (
                        <div key={category} className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">
                              {category}
                            </span>
                            <span className="text-sm">
                              ${amount.toLocaleString("es-AR")}
                            </span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className={`${getChartColor(
                                index
                              )} h-2 rounded-full`}
                              style={{
                                width: `${(amount / totalExpenses) * 100}%`,
                              }}
                            ></div>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {((amount / totalExpenses) * 100).toFixed(1)}% del
                            total de gastos variables
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tarjetas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gastos por Tarjeta</CardTitle>
            </CardHeader>
            <CardContent>
              {Object.keys(paymentsByCard).length === 0 ? (
                <p className="text-center text-muted-foreground py-4">
                  No hay datos para mostrar
                </p>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-center py-4">
                    <BarChart className="h-16 w-16 text-secondary" />
                  </div>
                  <div className="space-y-2">
                    {Object.entries(paymentsByCard).map(
                      ([card, amount], index) => (
                        <div key={card} className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{card}</span>
                            <span className="text-sm">
                              ${amount.toLocaleString("es-AR")}
                            </span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className={`${getChartColor(
                                index + 3
                              )} h-2 rounded-full`}
                              style={{
                                width: `${
                                  (amount / totalCreditCardPayments) * 100
                                }%`,
                              }}
                            ></div>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {((amount / totalCreditCardPayments) * 100).toFixed(
                              1
                            )}
                            % del total de tarjetas
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fijos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gastos Fijos por Tipo</CardTitle>
            </CardHeader>
            <CardContent>
              {Object.keys(expensesByType).length === 0 ? (
                <p className="text-center text-muted-foreground py-4">
                  No hay datos para mostrar
                </p>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-center py-4">
                    <BarChart className="h-16 w-16 text-accent" />
                  </div>
                  <div className="space-y-2">
                    {Object.entries(expensesByType).map(
                      ([type, amount], index) => (
                        <div key={type} className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{type}</span>
                            <span className="text-sm">
                              ${amount.toLocaleString("es-AR")}
                            </span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className={`${getChartColor(
                                index + 6
                              )} h-2 rounded-full`}
                              style={{
                                width: `${
                                  (amount / totalFixedExpenses) * 100
                                }%`,
                              }}
                            ></div>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {((amount / totalFixedExpenses) * 100).toFixed(1)}%
                            del total de gastos fijos
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
