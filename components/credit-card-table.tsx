"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAtom } from "jotai";
import { CreditCard, Pencil, Save, Trash2, X } from "lucide-react";
import { useState } from "react";
import type { CreditCardPayment } from "./dashboard";
import { cardsAtom } from "./settings/settings-page";

interface CreditCardTableProps {
  payments: CreditCardPayment[];
  onEditPayment: (payment: CreditCardPayment) => void;
  onDeletePayment: (id: string) => void;
}

export default function CreditCardTable({
  payments,
  onEditPayment,
  onDeletePayment,
}: CreditCardTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedDescription, setEditedDescription] = useState("");
  const [editedAmount, setEditedAmount] = useState("");
  const [editedCard, setEditedCard] = useState("");
  const [editedCurrentInstallment, setEditedCurrentInstallment] = useState("");
  const [editedTotalInstallments, setEditedTotalInstallments] = useState("");

  const startEditing = (payment: CreditCardPayment) => {
    setEditingId(payment.id);
    setEditedDescription(payment.description);
    setEditedAmount(payment.amount.toString());
    setEditedCard(payment.card);
    setEditedCurrentInstallment(payment.currentInstallment.toString());
    setEditedTotalInstallments(payment.totalInstallments.toString());
  };

  const [cards] = useAtom(cardsAtom);

  const cancelEditing = () => {
    setEditingId(null);
  };

  const saveEditing = (payment: CreditCardPayment) => {
    const updatedPayment: CreditCardPayment = {
      ...payment,
      description: editedDescription,
      amount: Number.parseFloat(editedAmount),
      card: editedCard,
      currentInstallment: Number.parseInt(editedCurrentInstallment),
      totalInstallments: Number.parseInt(editedTotalInstallments),
    };
    onEditPayment(updatedPayment);
    setEditingId(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-AR");
  };

  // Group payments by card type
  const paymentsByCard = payments.reduce((acc, payment) => {
    if (!acc[payment.card]) {
      acc[payment.card] = [];
    }
    acc[payment.card].push(payment);
    return acc;
  }, {} as Record<string, CreditCardPayment[]>);

  const totalAmount = payments.reduce(
    (sum, payment) => sum + payment.amount,
    0
  );
  console.log(cards);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pagos de Tarjetas de Crédito</CardTitle>
      </CardHeader>
      <CardContent>
        {payments.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">
            No hay pagos de tarjetas registrados
          </p>
        ) : (
          <div className="space-y-6">
            {Object.entries(paymentsByCard).map(([card, cardPayments]) => {
              const cardTotal = cardPayments.reduce(
                (sum, payment) => sum + payment.amount,
                0
              );

              return (
                <div key={card} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    <h3 className="font-semibold">
                      {cards.find((car) => car.id === card)?.name ||
                        "Unknown Card"}
                    </h3>
                    <span className="text-muted-foreground ml-auto">
                      Total: ${cardTotal.toLocaleString("es-AR")}
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Descripción</TableHead>
                          <TableHead>Cuotas</TableHead>
                          <TableHead>Progreso</TableHead>
                          <TableHead>Fecha</TableHead>
                          <TableHead className="text-right">Monto</TableHead>
                          <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {cardPayments.map((payment) => (
                          <TableRow key={payment.id}>
                            <TableCell>
                              {editingId === payment.id ? (
                                <Input
                                  value={editedDescription}
                                  onChange={(e) =>
                                    setEditedDescription(e.target.value)
                                  }
                                />
                              ) : (
                                payment.description
                              )}
                            </TableCell>
                            <TableCell>
                              {editingId === payment.id ? (
                                <div className="flex gap-2 items-center">
                                  <Input
                                    type="number"
                                    value={editedCurrentInstallment}
                                    onChange={(e) =>
                                      setEditedCurrentInstallment(
                                        e.target.value
                                      )
                                    }
                                    min="1"
                                    className="w-16"
                                  />
                                  <span>/</span>
                                  <Input
                                    type="number"
                                    value={editedTotalInstallments}
                                    onChange={(e) =>
                                      setEditedTotalInstallments(e.target.value)
                                    }
                                    min="1"
                                    className="w-16"
                                  />
                                </div>
                              ) : (
                                `${payment.currentInstallment}/${payment.totalInstallments}`
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col gap-1">
                                <Progress
                                  value={
                                    (payment.currentInstallment /
                                      payment.totalInstallments) *
                                    100
                                  }
                                  className="h-2"
                                />
                                <span className="text-xs text-muted-foreground">
                                  {Math.round(
                                    (payment.currentInstallment /
                                      payment.totalInstallments) *
                                      100
                                  )}
                                  %
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              {formatDate(payment?.date || "")}
                            </TableCell>
                            <TableCell className="text-right">
                              {editingId === payment.id ? (
                                <Input
                                  type="number"
                                  value={editedAmount}
                                  onChange={(e) =>
                                    setEditedAmount(e.target.value)
                                  }
                                  min="0.01"
                                  step="0.01"
                                />
                              ) : (
                                `$${payment.amount.toLocaleString("es-AR")}`
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              {editingId === payment.id ? (
                                <div className="flex justify-end gap-2">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => saveEditing(payment)}
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
                                    onClick={() => startEditing(payment)}
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => onDeletePayment(payment.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              );
            })}

            <div className="flex justify-between items-center pt-4 border-t">
              <span className="font-bold">Total Tarjetas de Crédito</span>
              <span className="font-bold">
                ${totalAmount.toLocaleString("es-AR")}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
