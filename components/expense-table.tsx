"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Pencil, Trash2, Save, X } from "lucide-react"
import type { Expense } from "./dashboard"

interface ExpenseTableProps {
  expenses: Expense[]
  onEditExpense: (expense: Expense) => void
  onDeleteExpense: (id: string) => void
}

export default function ExpenseTable({ expenses, onEditExpense, onDeleteExpense }: ExpenseTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editedDescription, setEditedDescription] = useState("")
  const [editedAmount, setEditedAmount] = useState("")
  const [editedCategory, setEditedCategory] = useState("")

  const startEditing = (expense: Expense) => {
    setEditingId(expense.id)
    setEditedDescription(expense.description)
    setEditedAmount(expense.amount.toString())
    setEditedCategory(expense.category)
  }

  const cancelEditing = () => {
    setEditingId(null)
  }

  const saveEditing = (expense: Expense) => {
    const updatedExpense: Expense = {
      ...expense,
      description: editedDescription,
      amount: Number.parseFloat(editedAmount),
      category: editedCategory,
    }
    onEditExpense(updatedExpense)
    setEditingId(null)
  }

  const getCategoryLabel = (category: string) => {
    const categories: Record<string, string> = {
      alimentacion: "Alimentación",
      transporte: "Transporte",
      entretenimiento: "Entretenimiento",
      salud: "Salud",
      educacion: "Educación",
      ropa: "Ropa",
      otro: "Otro",
    }
    return categories[category] || category
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-AR")
  }

  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gastos Variables</CardTitle>
      </CardHeader>
      <CardContent>
        {expenses.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">No hay gastos registrados</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Categoría</TableHead>
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
                        <Input value={editedDescription} onChange={(e) => setEditedDescription(e.target.value)} />
                      ) : (
                        expense.description
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === expense.id ? (
                        <Select value={editedCategory} onValueChange={setEditedCategory}>
                          <SelectTrigger>
                            <SelectValue placeholder="Categoría" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="alimentacion">Alimentación</SelectItem>
                            <SelectItem value="transporte">Transporte</SelectItem>
                            <SelectItem value="entretenimiento">Entretenimiento</SelectItem>
                            <SelectItem value="salud">Salud</SelectItem>
                            <SelectItem value="educacion">Educación</SelectItem>
                            <SelectItem value="ropa">Ropa</SelectItem>
                            <SelectItem value="otro">Otro</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        getCategoryLabel(expense.category)
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
                          <Button variant="ghost" size="icon" onClick={() => saveEditing(expense)}>
                            <Save className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={cancelEditing}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => startEditing(expense)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => onDeleteExpense(expense.id)}>
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
                  <TableCell className="text-right font-bold">${totalAmount.toLocaleString("es-AR")}</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

