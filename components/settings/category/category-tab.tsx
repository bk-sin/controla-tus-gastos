"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Tag } from "lucide-react";
import { useState } from "react";
import type { ExpenseCategory } from "../../dashboard";
import { CategoryForm } from "./category-form";
import { CategoryItem } from "./category-item";

export const CategoriesTab = ({
  categories,
  onCreate,
  onUpdate,
  onDelete,
}: {
  categories: ExpenseCategory[];
  onCreate: (data: Omit<ExpenseCategory, "id">) => void;
  onUpdate: (data: ExpenseCategory) => void;
  onDelete: (id: string) => void;
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<
    ExpenseCategory | undefined
  >();

  const handleSubmit = (data: ExpenseCategory) => {
    try {
      if (editingCategory?.id) {
        onUpdate({ ...data });
      } else {
        onCreate({ ...data });
      }
      setShowForm(false);
      setEditingCategory(undefined);
    } catch (error) {
      console.error("Error saving category: ", error);
      throw error;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Categorías</CardTitle>
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
          <CategoryForm
            initialData={editingCategory}
            onSubmit={handleSubmit}
            onCancel={() => setShowForm(false)}
          />
        ) : !categories?.length ? (
          <div className="text-center py-8 text-muted-foreground">
            <Tag className="mx-auto h-12 w-12 mb-4 opacity-50" />
            <p>No hay categorías configuradas</p>
            <p className="text-sm">
              Agrega categorías para organizar mejor tus gastos
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {categories.map((category: ExpenseCategory) => (
              <CategoryItem
                key={category.id}
                category={category}
                onEdit={(cat: ExpenseCategory) => {
                  setEditingCategory(cat);
                  setShowForm(true);
                }}
                onDelete={onDelete}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
