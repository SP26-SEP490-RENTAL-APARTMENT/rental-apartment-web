import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import type { PricingTemplate } from "@/types/pricingTemplate";
import { CalendarDays, Settings2, User } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  template: PricingTemplate | null;
}

function TemplateDetailDialog({ open, onClose, template }: Props) {
  if (!template) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="space-y-3">
            <DialogTitle className="text-2xl font-bold">
              {template.name}
            </DialogTitle>

            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{template.code}</Badge>

              <Badge
                className={
                  template.isActive
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-600"
                }
              >
                {template.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* description */}
          <section>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground text-sm">
              {template.description}
            </p>
          </section>

          <Separator />

          {/* metadata */}
          <section>
            <h3 className="font-semibold mb-4">Metadata</h3>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="rounded-xl border p-4 flex gap-3">
                <User className="text-muted-foreground" size={18} />
                <div>
                  <p className="text-sm text-muted-foreground">Created by</p>
                  <p className="font-medium line-clamp-1">{template.createdByAdminId}</p>
                </div>
              </div>

              <div className="rounded-xl border p-4 flex gap-3">
                <CalendarDays className="text-muted-foreground" size={18} />
                <div>
                  <p className="text-sm text-muted-foreground">Updated at</p>
                  <p className="font-medium">
                    {template.updatedAt?.slice(0, 10) || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <Separator />

          {/* parameters */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Settings2 size={18} />
              <h3 className="font-semibold">
                Parameters ({template.parameters.length})
              </h3>
            </div>

            <div className="space-y-4">
              {template.parameters.map((param) => (
                <div
                  key={param.parameterId}
                  className="rounded-2xl border p-5 hover:bg-muted/30 transition"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">{param.displayName}</h4>
                      <p className="text-sm text-muted-foreground">
                        {param.parameterKey}
                      </p>
                    </div>

                    <Badge
                      variant={param.isAdjustable ? "default" : "secondary"}
                    >
                      {param.isAdjustable ? "Adjustable" : "Fixed"}
                    </Badge>
                  </div>

                  <div className="grid md:grid-cols-3 gap-3 mt-4">
                    <div className="rounded-lg bg-muted p-3">
                      <p className="text-xs text-muted-foreground">Default</p>
                      <p className="font-semibold">{param.defaultValue}x</p>
                    </div>

                    <div className="rounded-lg bg-muted p-3">
                      <p className="text-xs text-muted-foreground">Minimum</p>
                      <p className="font-semibold">{param.minValue}x</p>
                    </div>

                    <div className="rounded-lg bg-muted p-3">
                      <p className="text-xs text-muted-foreground">Maximum</p>
                      <p className="font-semibold">{param.maxValue}x</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="flex justify-end text-teal-500 text-xs">
            Created at: {template.createdAt?.slice(0, 10) || "N/A"}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default TemplateDetailDialog;
