"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUser } from "@/lib/hooks/use-user";
import { useState } from "react";
import { CreditCard } from "../dashboard";

export const CreditCardForm = ({
  initialData,
  onSubmit,
  onCancel,
}: {
  initialData?: CreditCard;
  onSubmit: (data: Omit<CreditCard, "id">) => void;
  onCancel: () => void;
}) => {
  const [cardName, setCardName] = useState(initialData?.name || "");
  const [cardColor, setCardColor] = useState(initialData?.color || "#6366f1");
  const [cardDigits, setCardDigits] = useState(initialData?.lastNumbers);
  const [cardLimit, setCardLimit] = useState(initialData?.limit);
  const [cardClosingDay, setCardClosingDay] = useState(initialData?.closingDay);
  const [cardDueDay, setCardDueDay] = useState(initialData?.dueDay);
  const { user } = useUser();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      color: cardColor,
      lastNumbers: cardDigits,
      limit: cardLimit,
      name: cardName,
      closingDay: cardClosingDay,
      dueDay: cardDueDay,
      userId: user?.id as string,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="cardName">Nombre de la Tarjeta</Label>
        <Input
          id="cardName"
          value={cardName}
          onChange={(e) => setCardName(e.target.value)}
          placeholder="Ej: Visa Banco Galicia"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="cardDigits">Últimos 4 dígitos (opcional)</Label>
        <Input
          id="cardDigits"
          value={cardDigits}
          type="number"
          onChange={(e) => setCardDigits(Number(e.target.value) || undefined)}
          placeholder="Ej: 1234"
          maxLength={4}
          pattern="[0-9]*"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="cardLimit">Límite</Label>
          <Input
            id="cardLimit"
            type="number"
            value={cardLimit}
            onChange={(e) => setCardLimit(Number(e.target.value) || undefined)}
            placeholder="Ej: 150000"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cardClosingDay">Día de cierre</Label>
          <Input
            id="cardClosingDay"
            type="number"
            value={cardClosingDay}
            onChange={(e) =>
              setCardClosingDay(Number(e.target.value) || undefined)
            }
            placeholder="Ej: 15"
            min="1"
            max="31"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cardDueDay">Día de vencimiento</Label>
          <Input
            id="cardDueDay"
            type="number"
            value={cardDueDay}
            onChange={(e) => setCardDueDay(Number(e.target.value) || undefined)}
            placeholder="Ej: 5"
            min="1"
            max="31"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="cardColor">Color</Label>
        <div className="flex items-center gap-2">
          <Input
            id="cardColor"
            type="color"
            value={cardColor}
            onChange={(e) => setCardColor(e.target.value)}
            className="w-12 h-10 p-1"
          />
          <span className="text-sm text-muted-foreground">{cardColor}</span>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">{initialData ? "Actualizar" : "Agregar"}</Button>
      </div>
    </form>
  );
};
