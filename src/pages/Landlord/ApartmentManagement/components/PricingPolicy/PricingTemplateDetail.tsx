import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { PricingTemplate } from "@/types/pricingTemplate";
import { useTranslation } from "react-i18next";

interface Props {
  template: PricingTemplate | null;
}

export default function PricingTemplateDetail({ template }: Props) {
  const { i18n, t } = useTranslation("landlord");

  if (!template) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          {t("pricingPolicy.detail.selectTemplate")}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>
              {i18n.language === "en" ? template.name : template.nameVi}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {i18n.language === "en"
                ? template.description
                : template.descriptionVi}
            </p>
          </div>

          <Badge variant={template.isActive ? "default" : "secondary"}>
            {template.isActive
              ? t("pricingPolicy.detail.active")
              : t("pricingPolicy.detail.inactive")}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-6">
        <div>
          <p className="text-sm text-muted-foreground">
            {t("pricingPolicy.detail.code")}
          </p>
          <p className="font-medium">{template.code}</p>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold">
            {t("pricingPolicy.detail.pricingParameters")}
          </h3>

          {template.parameters.map((param) => (
            <Card key={param.parameterId} className="bg-muted/30">
              <CardContent className="p-4 space-y-2">
                <div className="flex justify-between">
                  <p className="font-medium">
                    {i18n.language === "en"
                      ? param.displayName
                      : param.displayNameVi}
                  </p>
                  <Badge variant="outline">
                    {param.isAdjustable
                      ? t("pricingPolicy.detail.adjustable")
                      : t("pricingPolicy.detail.fixed")}
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">
                      {t("pricingPolicy.detail.default")}
                    </p>
                    <p>{param.defaultValue}x</p>
                  </div>

                  <div>
                    <p className="text-muted-foreground">
                      {t("pricingPolicy.detail.min")}
                    </p>
                    <p>{param.minValue}x</p>
                  </div>

                  <div>
                    <p className="text-muted-foreground">
                      {t("pricingPolicy.detail.max")}
                    </p>
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
