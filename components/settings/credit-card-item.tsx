import { Button } from "@/components/ui/button";
import { CreditCard as CreditCardIcon, Pencil, Trash2 } from "lucide-react";
import { CreditCard } from "../dashboard";

export const CreditCardItem = ({
  card,
  onEdit,
  onDelete,
}: {
  card: CreditCard;
  onEdit: (category: CreditCard) => void;
  onDelete: (id: string) => void;
}) => (
  <div
    key={card.id}
    className="p-4 rounded-lg border border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-muted/50"
    style={{ borderLeftColor: card.color, borderLeftWidth: "4px" }}
  >
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <CreditCardIcon className="h-4 w-4" style={{ color: card.color }} />
        <h3 className="font-medium">{card.name}</h3>
        {card.lastNumbers && (
          <span className="text-xs text-muted-foreground">
            **** {card.lastNumbers}
          </span>
        )}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
        <span>Límite: ${(card.limit ?? 0).toLocaleString("es-AR")}</span>
        <span>Cierre: día {card.closingDay}</span>
        <span>Vencimiento: día {card.dueDay}</span>
      </div>
    </div>
    <div className="flex gap-2 self-end sm:self-center">
      <Button variant="ghost" size="sm" onClick={() => onEdit(card)}>
        <Pencil className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={() => onDelete(card.id)}>
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  </div>
);
