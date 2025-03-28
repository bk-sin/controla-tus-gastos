import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import type { ExpenseCategory } from "../dashboard";

export const CategoryItem = ({
  category,
  onEdit,
  onDelete,
}: {
  category: ExpenseCategory;
  onEdit: (category: ExpenseCategory) => void;
  onDelete: (id: string) => void;
}) => (
  <div
    className="p-4 rounded-lg border border-border hover:bg-muted/50"
    style={{
      borderLeftColor: category.color,
      borderLeftWidth: "4px",
    }}
  >
    <div className="flex justify-between items-start mb-2">
      <div className="flex items-center gap-2">
        <div
          className="w-4 h-4 rounded-full"
          style={{ backgroundColor: category.color }}
        ></div>
        <h3 className="font-medium">{category.name}</h3>
      </div>
      <div className="flex gap-1">
        <Button variant="ghost" size="sm" onClick={() => onEdit(category)}>
          <Pencil className="h-3 w-3" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onDelete(category.id)}>
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    </div>
    <Badge variant="outline">
      {category.isFixed ? "Es " : "No es "}un gasto fijo
    </Badge>
  </div>
);
