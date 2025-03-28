"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAtom } from "jotai";
import { redirect } from "next/navigation";
import type React from "react";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import type {
  CreditCard,
  CreditCardPayment,
  Expense,
  ExpenseCategory,
  FixedExpense,
} from "./dashboard";
import { settingsAtom } from "./settings/settings-page";

interface ExpenseFormProps {
  onAddExpense: (expense: any) => void;
  isCredit?: boolean;
  isFixed?: boolean;
  categories?: ExpenseCategory[];
  fixedCategories?: ExpenseCategory[];
  creditCards?: CreditCard[];
}

export default function ExpenseForm({
  onAddExpense,
  isCredit = false,
  isFixed = false,
  categories = [],
  fixedCategories = [],
  creditCards = [],
}: ExpenseFormProps) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [card, setCard] = useState("");
  const [currentInstallment, setCurrentInstallment] = useState("");
  const [totalInstallments, setTotalInstallments] = useState("");
  const [type, setType] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!description || !amount || Number.parseFloat(amount) <= 0) {
      return;
    }

    if (isCredit) {
      const payment: CreditCardPayment = {
        id: uuidv4(),
        description,
        amount: Number.parseFloat(amount),
        card,
        currentInstallment: Number.parseInt(currentInstallment) || 1,
        totalInstallments: Number.parseInt(totalInstallments) || 1,
        date: new Date().toISOString(),
      };
      onAddExpense(payment);
    } else if (isFixed) {
      const fixedExpense: Omit<FixedExpense, "id" | "date" | "category"> = {
        amount: Number.parseFloat(amount),
        type,
        description,
        isFixed: true,
      };
      onAddExpense(fixedExpense);
    } else {
      const expense: Omit<Expense, "id"> = {
        description,
        amount: Number.parseFloat(amount),
        category,
        date: new Date().toISOString(),
      };
      onAddExpense(expense);
    }

    // Reset form
    setDescription("");
    setAmount("");
    setCategory("");
    setCard("");
    setCurrentInstallment("");
    setTotalInstallments("");
    setType("");
  };
  const [_, setSettingsTab] = useAtom(settingsAtom);
  const handleCategoryChange = (value: string) => {
    if (value === "settings") {
      setSettingsTab("categories");
      redirect("/settings");
    } else {
      setCategory(value);
    }
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isCredit
            ? "Agregar Pago de Tarjeta"
            : isFixed
            ? "Agregar Gasto Fijo"
            : "Agregar Gasto Variable"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Input
                id="description"
                placeholder="Descripción del gasto"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Monto</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="0.01"
                step="0.01"
                required
              />
            </div>
          </div>

          {isCredit ? (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="card">Tarjeta</Label>
                  <Select value={card} onValueChange={setCard}>
                    <SelectTrigger id="card">
                      <SelectValue placeholder="Seleccionar tarjeta" />
                    </SelectTrigger>
                    <SelectContent>
                      {creditCards.map((creditCard) => (
                        <SelectItem value={creditCard.id} key={creditCard.id}>
                          {creditCard.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currentInstallment">Cuota Actual</Label>
                  <Input
                    id="currentInstallment"
                    type="number"
                    placeholder="1"
                    value={currentInstallment}
                    onChange={(e) => setCurrentInstallment(e.target.value)}
                    min="1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="totalInstallments">Total Cuotas</Label>
                  <Input
                    id="totalInstallments"
                    type="number"
                    placeholder="1"
                    value={totalInstallments}
                    onChange={(e) => setTotalInstallments(e.target.value)}
                    min="1"
                  />
                </div>
              </div>
            </>
          ) : isFixed ? (
            <div className="space-y-2">
              <Label htmlFor="type">Tipo de Gasto Fijo</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  {fixedCategories.map((fixedCategory: ExpenseCategory) => (
                    <SelectItem value={fixedCategory.id} key={fixedCategory.id}>
                      {fixedCategory.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="category">Categoría</Label>
              <Select value={category} onValueChange={handleCategoryChange}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem
                      value={category.id}
                      key={category.id}
                      className="cursor-pointer"
                    >
                      {category.name}
                    </SelectItem>
                  ))}
                  <SelectItem value={"settings"} className="cursor-pointer">
                    Agregar categoría variable
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <Button type="submit" className="w-full">
            Agregar
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
