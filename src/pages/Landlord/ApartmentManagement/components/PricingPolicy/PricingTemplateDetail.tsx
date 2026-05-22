import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { PricingTemplate } from "@/types/pricingTemplate";

interface Props {
  template: PricingTemplate | null;
}

export default function PricingTemplateDetail({ template }: Props) {
  if (!template) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          Select a pricing template to view details
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{template.name}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {template.description}
            </p>
          </div>

          <Badge variant={template.isActive ? "default" : "secondary"}>
            {template.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-6">
        <div>
          <p className="text-sm text-muted-foreground">Code</p>
          <p className="font-medium">{template.code}</p>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold">Pricing Parameters</h3>

          {template.parameters.map((param) => (
            <Card key={param.parameterId} className="bg-muted/30">
              <CardContent className="p-4 space-y-2">
                <div className="flex justify-between">
                  <p className="font-medium">{param.displayName}</p>
                  <Badge variant="outline">
                    {param.isAdjustable ? "Adjustable" : "Fixed"}
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Default</p>
                    <p>{param.defaultValue}x</p>
                  </div>

                  <div>
                    <p className="text-muted-foreground">Min</p>
                    <p>{param.minValue}x</p>
                  </div>

                  <div>
                    <p className="text-muted-foreground">Max</p>
                    <p>{param.maxValue}x</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}