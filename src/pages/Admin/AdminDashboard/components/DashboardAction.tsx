import { Button } from "@/components/ui/button";
import type { Catalog } from "@/types/catalog";
import { Play, Edit, Trash2 } from "lucide-react";

export interface Props {
  catalog: Catalog;
  onRunReport: (report: Catalog) => void;
  onEdit: (report: Catalog) => void;
  onDelete: (report: Catalog) => void;
}
function DashboardAction({ catalog, onRunReport, onEdit, onDelete }: Props) {
  return (
    <div className="flex items-center gap-2">
      <Button size="sm" onClick={() => onRunReport(catalog)}>
        <Play />
      </Button>
      <Button size="sm" variant="ghost" onClick={() => onEdit(catalog)}>
        <Edit />
      </Button>
      <Button
        size="sm"
        variant="destructive"
        onClick={() => onDelete(catalog)}
      >
        <Trash2 />
      </Button>
    </div>
  );
}

export default DashboardAction;
