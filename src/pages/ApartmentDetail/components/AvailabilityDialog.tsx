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

type Props = {
  isOpen: boolean;
  onClose: () => void;
  data: Availability
};

export default function AvailabilityDialog({
  isOpen,
  onClose,
  data,
}: Props) {
  if (!data) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Availability</DialogTitle>
        </DialogHeader>

        {/* Tổng quan */}
        <div className="space-y-2">
          <div>
            Status:{" "}
            <Badge variant="outline">{data.bookingStatus}</Badge>
          </div>

          <div className="text-sm text-gray-500">
            {formatDate(data.calendarStartDate)} →{" "}
            {formatDate(data.calendarEndDate)}
          </div>
        </div>

        <Separator />

        {/* Available */}
        <div>
          <h3 className="font-semibold mb-2">Available</h3>

          {data.availablePeriods.length === 0 ? (
            <p className="text-sm text-gray-400">No available slots</p>
          ) : (
            <div className="space-y-2">
              {data.availablePeriods.map((item, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-3 flex justify-between items-center"
                >
                  <div>
                    <div className="text-sm">
                      {formatDate(item.startDate)} →{" "}
                      {formatDate(item.endDate)}
                    </div>
                  </div>

                  {/* <Badge variant="secondary">
                    {item.pricePerNight
                      ? `${item.pricePerNight.toLocaleString()} VND`
                      : "No price"}
                  </Badge> */}
                </div>
              ))}
            </div>
          )}
        </div>

        <Separator />

        {/* Unavailable */}
        <div>
          <h3 className="font-semibold mb-2">Unavailable</h3>

          {data.unavailablePeriods.length === 0 ? (
            <p className="text-sm text-gray-400">No blocked slots</p>
          ) : (
            <div className="space-y-2">
              {data.unavailablePeriods.map((item, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-3"
                >
                  <div className="text-sm">
                    {formatDate(item.startDate)} →{" "}
                    {formatDate(item.endDate)}
                  </div>

                  <div className="flex gap-2 mt-2">
                    <Badge variant="destructive">
                      {item.reason}
                    </Badge>

                    {item.bookingStatus && (
                      <Badge variant="outline">
                        {item.bookingStatus}
                      </Badge>
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