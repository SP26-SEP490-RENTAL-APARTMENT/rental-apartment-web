import { Button } from "@/components/ui/button";
import type { Catalog } from "@/types/catalog";
import { Play } from "lucide-react";

export interface Props {
  catalog: Catalog;
  onRunReport: (report: Catalog) => void;
}
function DashboardAction({ catalog, onRunReport }: Props) {
  return (
    <div>
      <Button
        size="sm"
        onClick={() => onRunReport(catalog)}
      >
        <Play />
      </Button>
    </div>
  );
}

export default DashboardAction;
