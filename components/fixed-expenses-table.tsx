"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Save, Trash2, X } from "lucide-react";
import { useState } from "react";
import type { Expense, ExpenseCategory } from "./dashboard";

interface FixedExpensesTableProps {
  fixedExpenses: Expense[];
  fixedCategories: ExpenseCategory[];
  onEditExpense: (expense: Expense) => void;
  onDeleteExpense: (id: string) => void;
}

export default function FixedExpensesTable({
  fixedExpenses,
  fixedCategories = [],
  onEditExpense,
  onDeleteExpense,
}: FixedExpensesTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedDescription, setEditedDescription] = useState("");
  const [editedAmount, setEditedAmount] = useState("");
  const [editedCategory, setEditedCategory] = useState<string>("");
  const startEditing = (expense: Expense) => {
    setEditingId(expense.id);
    setEditedDescription(expense.description);
    setEditedAmount(expense.amount.toString());
    setEditedCategory(expense?.categoryId || "");
  };

  const cancelEditing = () => {
    setEditingId(null);
  };

  const saveEditing = (expense: Expense) => {
    const updatedExpense: Expense = {
      ...expense,
      description: editedDescription,
      amount: Number.parseFloat(editedAmount),
      categoryId: editedCategory || expense.categoryId,
    };
    onEditExpense(updatedExpense);
    setEditingId(null);
  };

  const handleSelectType = (category: string) => {
    setEditedCategory(category);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-AR");
  };

  const totalAmount = fixedExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gastos Fijos</CardTitle>
      </CardHeader>
      <CardContent>
        {fixedExpenses.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">
            No hay gastos fijos registrados
          </p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead className="text-right">Monto</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fixedExpenses.map((fixedExpense) => (
                  <TableRow key={fixedExpense.id}>
                    <TableCell>
                      {editingId === fixedExpense.id ? (
                        <Input
                          value={editedDescription}
                          onChange={(e) => setEditedDescription(e.target.value)}
                        />
                      ) : (
                        fixedExpense.description
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === fixedExpense.id ? (
                        <Select
                          value={editedCategory}
                          onValueChange={handleSelectType}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            {fixedCategories.map((fixedCategory) => (
                              <SelectItem
                                value={fixedCategory.id}
                                key={fixedCategory.id}
                              >
                                {fixedCategory.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        fixedExpense.category?.name || ""
                      )}
                    </TableCell>
                    <TableCell>{formatDate(fixedExpense.date || "")}</TableCell>
                    <TableCell className="text-right">
                      {editingId === fixedExpense.id ? (
                        <Input
                          type="number"
                          value={editedAmount}
                          onChange={(e) => setEditedAmount(e.target.value)}
                          min="0.01"
                          step="0.01"
                        />
                      ) : (
                        `$${fixedExpense.amount.toLocaleString("es-AR")}`
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {editingId === fixedExpense.id ? (
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => saveEditing(fixedExpense)}
                          >
                            <Save className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={cancelEditing}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => startEditing(fixedExpense)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onDeleteExpense(fixedExpense.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={3} className="font-bold">
                    Total
                  </TableCell>
                  <TableCell className="text-right font-bold">
                    ${totalAmount.toLocaleString("es-AR")}
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
