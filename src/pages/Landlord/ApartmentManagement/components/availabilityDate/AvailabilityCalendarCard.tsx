import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Trash2, XCircle } from "lucide-react";
import type { Availability } from "@/types/availability";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { apartmentManagementApi } from "@/services/privateApi/landlordApi";
import { toast } from "sonner";

interface Props {
  data: Availability | null;
  onClose?: () => void;
}

export default function AvailabilityCalendarCard({ data, onClose }: Props) {
  const [loading, setLoading] = useState(false);

  const handleDeleteAvailability = async (
    startDate: string,
    endDate: string,
  ) => {
    setLoading(true);
    try {
      await apartmentManagementApi.deleteAvailableDate(
        data?.apartmentId || "",
        {
          ranges: [
            {
              startDate: startDate,
              endDate: endDate,
            },
          ],
        },
      );
      toast.success("Availability deleted successfully.");
      onClose?.();
    } catch (error) {
      toast.error("Failed to delete availability. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const formatDate = (date: string | undefined) =>
    date ? new Date(date).toLocaleDateString("vi-VN") : "";

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Apartment Availability</CardTitle>

          <div className="flex gap-1 bg-black rounded-full p-1">
            <p className="text-white">Present status</p>
            <Badge
              variant={
                data?.bookingStatus === "locked" ? "destructive" : "secondary"
              }
            >
              {data?.bookingStatus}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Calendar Range */}
        {/* <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>
            {formatDate(data?.calendarStartDate)} -{" "}
            {formatDate(data?.calendarEndDate)}
          </span>
        </div> */}

        {/* Available */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <h3 className="font-semibold">Available Periods</h3>
          </div>

          <div className="space-y-3">
            {data?.availablePeriods?.map((period, index) => (
              <div
                key={index}
                className="rounded-lg border border-green-200 bg-green-50 p-4"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">
                      {formatDate(period.startDate)} →{" "}
                      {formatDate(period.endDate)}
                    </p>
                  </div>

                  {/* <div className="flex items-center gap-1 font-semibold text-green-700">
                    <DollarSign className="h-4 w-4" />
                    {period.pricePerNight?.toLocaleString()} / night
                  </div> */}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Unavailable */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <XCircle className="h-5 w-5 text-red-600" />
            <h3 className="font-semibold">Unavailable Periods</h3>
          </div>

          <div className="space-y-3">
            {data?.unavailablePeriods?.map((period, index) => (
              <div
                key={index}
                className="rounded-lg border border-red-200 bg-red-50 p-4"
              >
                <div className="flex justify-between items-center">
                  <p className="font-medium">
                    {formatDate(period.startDate)} →{" "}
                    {formatDate(period.endDate)}
                  </p>
                  <Button
                    disabled={loading}
                    variant="destructive"
                    size="sm"
                    onClick={() =>
                      handleDeleteAvailability(period.startDate, period.endDate)
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <p className="text-sm text-muted-foreground mt-1">
                  Reason: {period.reason || "N/A"}
                </p>

                {period.bookingStatus && (
                  <Badge variant="outline" className="mt-2">
                    {period.bookingStatus}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="text-xs text-muted-foreground">
          Generated:{" "}
          {data?.generatedAt
            ? new Date(data.generatedAt).toLocaleString("vi-VN")
            : ""}
        </div>
      </CardContent>
    </Card>
  );
}
