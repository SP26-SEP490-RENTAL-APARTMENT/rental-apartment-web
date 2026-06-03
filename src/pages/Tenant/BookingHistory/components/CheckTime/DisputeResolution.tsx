import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";

interface Props {
  resolution?: string;
  data?: any;
}

function DisputeResolution({ resolution, data }: Props) {
  const { t } = useTranslation("paymentHistory");

  const displayText = resolution || data?.disputeResolutionNotes || "--";
  const isWaived = data?.feeSettlementStatus === "waived";

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-semibold">{t("checkTime.resolution.title")}</h4>
        <Badge variant={isWaived ? "default" : "secondary"}>
          {isWaived
            ? t("checkTime.resolution.waived")
            : t("checkTime.resolution.resolved")}
        </Badge>
      </div>

      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          {t("checkTime.resolution.status")}
        </p>
        <p className="text-base leading-relaxed">{displayText}</p>
      </div>
    </Card>
  );
}

export default DisputeResolution;
