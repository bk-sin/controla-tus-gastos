"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { ExpenseCategory } from "../dashboard";

export const CategoryForm = ({
  initialData,
  onSubmit,
  onCancel,
}: {
  initialData?: ExpenseCategory;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}) => {
  const [categoryName, setCategoryName] = useState(initialData?.name || "");
  const [categoryType, setCategoryType] = useState(
    initialData?.isFixed || false
  );
  const [categoryColor, setCategoryColor] = useState(
    initialData?.color || "#6366f1"
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: categoryName,
      isFixed: categoryType,
      color: categoryColor,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="categoryName">Nombre de la Categoría</Label>
        <Input
          id="categoryName"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          placeholder="Ej: Alimentación"
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Es un gasto fijo?</Label>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="categoryType"
            checked={categoryType}
            onCheckedChange={(checked) => setCategoryType(Boolean(checked))}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="categoryColor">Color</Label>
        <div className="flex items-center gap-2">
          <Input
            id="categoryColor"
            type="color"
            value={categoryColor}
            onChange={(e) => setCategoryColor(e.target.value)}
            className="w-12 h-10 p-1"
          />
          <span className="text-sm text-muted-foreground">{categoryColor}</span>
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
