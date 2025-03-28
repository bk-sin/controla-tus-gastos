"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, PlusCircle } from "lucide-react";
import { useState } from "react";
import type { CreditCard as CreditCardType } from "../../dashboard";
import { CreditCardForm } from "./credit-card-form";
import { CreditCardItem } from "./credit-card-item";

export const CreditCardTab = ({
  cards,
  onCreate,
  onUpdate,
  onDelete,
}: {
  cards: CreditCardType[];
  onCreate: (data: Omit<CreditCardType, "id">) => void;
  onUpdate: (data: CreditCardType) => void;
  onDelete: (id: string) => void;
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<
    CreditCardType | undefined
  >(undefined);

  const handleSubmit = async (data: any) => {
    try {
      editingCategory?.id
        ? await onUpdate({ ...data, id: editingCategory?.id })
        : await onCreate({ ...data });
      setShowForm(false);
      setEditingCategory(undefined);
    } catch (error) {
      console.error("Error saving credit card:", error);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Tarjetas de Crédito</CardTitle>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
          onClick={() => {
            setEditingCategory(undefined);
            setShowForm(true);
          }}
        >
          <PlusCircle className="h-4 w-4" />
          <span>Agregar</span>
        </Button>
      </CardHeader>
      <CardContent>
        {showForm ? (
          <CreditCardForm
            initialData={editingCategory}
            onSubmit={handleSubmit}
            onCancel={() => setShowForm(false)}
          />
        ) : (
          <div>
            {cards.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CreditCard className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>No hay tarjetas configuradas</p>
                <p className="text-sm">
                  Agrega tus tarjetas de crédito para un mejor seguimiento
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {cards.map((card) => (
                  <CreditCardItem
                    key={card.id}
                    card={card}
                    onEdit={(_card) => {
                      setEditingCategory(_card);
                      setShowForm(true);
                    }}
                    onDelete={onDelete}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
