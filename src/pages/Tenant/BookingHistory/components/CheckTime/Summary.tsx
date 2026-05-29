import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatCurrency, formatDateTime } from "@/utils/utils";
import { useTranslation } from "react-i18next";

function Summary({ data }: { data: any }) {
  const { t } = useTranslation("paymentHistory");
  return (
    <Card className="p-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-semibold text-lg">{t("checkTime.summary.title")}</h3>
          <p className="text-muted-foreground text-sm">
            Booking #{data.bookingId.slice(0, 8)}
          </p>
        </div>

        <div className="flex gap-2">
          <Badge>{data.claimStatus}</Badge>
          <Badge variant="secondary">{data.feeSettlementStatus}</Badge>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-2xl font-bold text-red-500">
          {formatCurrency(data.totalFee)}
        </p>
        <p className="text-sm text-muted-foreground">
          Due: {formatDateTime(data.feeDueAt)}
        </p>
      </div>
    </Card>
  );
}

export default Summary;
