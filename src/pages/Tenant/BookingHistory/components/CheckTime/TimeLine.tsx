import { Card } from "@/components/ui/card";
import { diffMinutes, formatCurrency, formatDateTime } from "@/utils/utils";
import { useTranslation } from "react-i18next";

function TimeLine({ data }: { data: any }) {
  const { t } = useTranslation("paymentHistory");
  const early = diffMinutes(data.actualCheckIn, data.scheduledCheckIn);

  const late = diffMinutes(data.actualCheckOut, data.scheduledCheckOut);
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <Card className="p-4">
        <h4 className="font-semibold mb-3">
          {t("checkTime.timeLine.checkIn")}
        </h4>
        <p className="bg-muted p-2 rounded-2xl">
          {t("checkTime.timeLine.scheduled")}:{" "}
          {formatDateTime(data.scheduledCheckIn)}
        </p>
        <p className="bg-blue-100 p-2 rounded-2xl">
          {t("checkTime.timeLine.actual")}: {formatDateTime(data.actualCheckIn)}
        </p>
        <p className="text-blue-500">
          {t("checkTime.timeLine.early")} {early} {t("checkTime.timeLine.min")}{" "}
          ({formatCurrency(data.earlyCheckInFee)})
        </p>
      </Card>

      <Card className="p-4">
        <h4 className="font-semibold mb-3">
          {t("checkTime.timeLine.checkOut")}
        </h4>
        <p className="bg-muted p-2 rounded-2xl">
          {t("checkTime.timeLine.scheduled")}:{" "}
          {formatDateTime(data.scheduledCheckOut)}
        </p>
        <p className="bg-blue-100 p-2 rounded-2xl">
          {t("checkTime.timeLine.actual")}:{" "}
          {formatDateTime(data.actualCheckOut)}
        </p>
        <p className="text-orange-500">
          {late > 0 && (
            <>
              {t("checkTime.timeLine.late")} {late}{" "}
              {t("checkTime.timeLine.min")} (
              {formatCurrency(data.lateCheckOutFee)})
            </>
          )}
        </p>
      </Card>
    </div>
  );
}

export default TimeLine;
