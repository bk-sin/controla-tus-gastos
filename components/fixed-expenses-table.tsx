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
import type { ExpenseCategory, FixedExpense } from "./dashboard";

interface FixedExpensesTableProps {
  expenses: FixedExpense[];
  fixedCategories: ExpenseCategory[];
  onEditExpense: (expense: FixedExpense) => void;
  onDeleteExpense: (id: string) => void;
}

export default function FixedExpensesTable({
  expenses,
  fixedCategories = [],
  onEditExpense,
  onDeleteExpense,
}: FixedExpensesTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedDescription, setEditedDescription] = useState("");
  const [editedAmount, setEditedAmount] = useState("");
  const [editedType, setEditedType] = useState("");
  const [editedCategory, setEditedCategory] = useState<ExpenseCategory | null>(
    null
  );
  const startEditing = (expense: FixedExpense) => {
    setEditingId(expense.id);
    setEditedDescription(expense.description);
    setEditedAmount(expense.amount.toString());
    setEditedType(expense.type);
  };

  const cancelEditing = () => {
    setEditingId(null);
  };

  const saveEditing = (expense: FixedExpense) => {
    const updatedExpense: FixedExpense = {
      ...expense,
      description: editedDescription,
      amount: Number.parseFloat(editedAmount),
      type: editedType,
      category: editedCategory || expense.category,
    };
    onEditExpense(updatedExpense);
    setEditingId(null);
  };

  const handleSelectType = (type: string) => {
    setEditedType(type);
    setEditedCategory(
      fixedCategories.find((fixedCategory) => fixedCategory.id === type) || null
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-AR");
  };

  const totalAmount = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gastos Fijos</CardTitle>
      </CardHeader>
      <CardContent>
        {expenses.length === 0 ? (
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
                {expenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell>
                      {editingId === expense.id ? (
                        <Input
                          value={editedDescription}
                          onChange={(e) => setEditedDescription(e.target.value)}
                        />
                      ) : (
                        expense.description
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === expense.id ? (
                        <Select
                          value={editedType}
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
                        expense.category.name
                      )}
                    </TableCell>
                    <TableCell>{formatDate(expense.date)}</TableCell>
                    <TableCell className="text-right">
                      {editingId === expense.id ? (
                        <Input
                          type="number"
                          value={editedAmount}
                          onChange={(e) => setEditedAmount(e.target.value)}
                          min="0.01"
                          step="0.01"
                        />
                      ) : (
                        `$${expense.amount.toLocaleString("es-AR")}`
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {editingId === expense.id ? (
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => saveEditing(expense)}
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
                            onClick={() => startEditing(expense)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onDeleteExpense(expense.id)}
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
