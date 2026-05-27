import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Availability } from "@/types/availability";
import { formatDate } from "@/lib/utils";
import { useTranslation } from "react-i18next";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  data: Availability;
};

export default function AvailabilityDialog({ isOpen, onClose, data }: Props) {
  const { t } = useTranslation("book");

  if (!data) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{t("avai.title")}</DialogTitle>
        </DialogHeader>

        {/* Tổng quan */}
        {/* <div className="space-y-2">
          <div>
            Status: <Badge variant="outline">{data.bookingStatus}</Badge>
          </div>

          <div className="text-sm text-gray-500">
            {formatDate(data.calendarStartDate)} →{" "}
            {formatDate(data.calendarEndDate)}
          </div>
        </div>

        <Separator /> */}

        {/* Available */}
        <div>
          <h3 className="font-semibold mb-2">{t("avai.available")}</h3>

          {data.availablePeriods.length === 0 ? (
            <p className="text-sm text-gray-400">{t("avai.noAvailableSlots")}</p>
          ) : (
            <div className="space-y-2">
              {data.availablePeriods.map((item, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-3 flex justify-between items-center"
                >
                  <div>
                    <div className="text-sm">
                      {formatDate(item.startDate)} → {formatDate(item.endDate)}
                    </div>
                  </div>

                  {/* <Badge variant="secondary">
                    {item.pricePerNight
                      ? `${item.pricePerNight.toLocaleString()} VND`
                      : t("noPrice")}
                  </Badge> */}
                </div>
              ))}
            </div>
          )}
        </div>

        <Separator />

        {/* Unavailable */}
        <div>
          <h3 className="font-semibold mb-2">{t("avai.unavailable")}</h3>

          {data.unavailablePeriods.length === 0 ? (
            <p className="text-sm text-gray-400">{t("avai.noBlockedSlots")}</p>
          ) : (
            <div className="space-y-2">
              {data.unavailablePeriods.map((item, index) => (
                <div key={index} className="border rounded-lg p-3">
                  <div className="text-sm">
                    {formatDate(item.startDate)} → {formatDate(item.endDate)}
                  </div>

                  <div className="flex gap-2 mt-2">
                    <Badge variant="destructive">{item.reason}</Badge>

                    {item.bookingStatus && (
                      <Badge variant="outline">{item.bookingStatus}</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
