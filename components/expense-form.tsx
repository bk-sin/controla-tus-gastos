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
} from "./dashboard";
import { settingsAtom } from "./settings/settings-page";

interface ExpenseFormProps {
  onAddExpense: (
    expense: Omit<CreditCardPayment | Expense, "id" | "date">
  ) => void;
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
  const [card, setCard] = useState("");
  const [currentInstallment, setCurrentInstallment] = useState("");
  const [totalInstallments, setTotalInstallments] = useState("");
  const [categoryId, setCategoryId] = useState("");

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
      };
      onAddExpense(payment);
    } else if (isFixed) {
      const fixedExpense: Omit<Expense, "id" | "date" | "category"> = {
        amount: Number.parseFloat(amount),
        categoryId,
        description,
        isFixed: true,
      };
      onAddExpense(fixedExpense);
    } else {
      const expense: Omit<Expense, "id"> = {
        description,
        amount: Number.parseFloat(amount),
        categoryId,
        isFixed: false,
      };
      onAddExpense(expense);
    }
    setDescription("");
    setAmount("");
    setCard("");
    setCurrentInstallment("");
    setTotalInstallments("");
    setCategoryId("");
  };
  const [_, setSettingsTab] = useAtom(settingsAtom);
  const handleCategoryChange = (value: string) => {
    if (value === "settings") {
      setSettingsTab("categories");
      redirect("/settings");
    } else {
      setCategoryId(value);
    }
  };

  const handleCreditCardChange = (value: string) => {
    if (value === "settings") {
      setSettingsTab("cards");
      redirect("/settings");
    } else {
      setCard(value);
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
              <Label htmlFor="amount">Monto{isCredit && " de la cuota"}</Label>
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
                  <Select
                    value={card}
                    onValueChange={handleCreditCardChange}
                    required
                  >
                    <SelectTrigger id="card">
                      <SelectValue placeholder="Seleccionar tarjeta" />
                    </SelectTrigger>
                    <SelectContent>
                      {creditCards.map((creditCard) => (
                        <SelectItem value={creditCard.id} key={creditCard.id}>
                          {creditCard.name}
                        </SelectItem>
                      ))}
                      {!creditCards?.length && (
                        <SelectItem
                          value={"settings"}
                          className="cursor-pointer"
                        >
                          Agregar tarjeta de crédito
                        </SelectItem>
                      )}
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
              <Select value={categoryId} onValueChange={setCategoryId}>
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
              <Select value={categoryId} onValueChange={handleCategoryChange}>
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
                  {!categories?.length && (
                    <SelectItem value={"settings"} className="cursor-pointer">
                      Agregar categoría variable
                    </SelectItem>
                  )}
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
