import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import * as Popover from "@radix-ui/react-popover";
import { useState } from "react";
import { useFormatDate } from "@/utils";

function BookingBox() {
  const [checkIn, setCheckIn] = useState<Date | undefined>(undefined);
  const [checkOut, setCheckOut] = useState<Date | undefined>(undefined);
  const formatDate = useFormatDate();

  const isPastDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return date < today;
  };

  const disableCheckIn = (date: Date) => {
    return isPastDate(date);
  };

  const disableCheckOut = (date: Date) => {
    if (isPastDate(date)) return true;

    if (checkIn) {
      return date <= checkIn;
    }

    return false;
  };

  return (
    <Card className="shadow-2xl">
      <CardHeader>
        <CardTitle className="text-center">Book Now</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <div className="flex gap-2 items-end">
          <div className="flex flex-col w-full">
            <span className="text-sm font-medium mb-1">Check‑in</span>
            <Popover.Root>
              <Popover.Trigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start cursor-pointer"
                >
                  {formatDate(checkIn)}
                </Button>
              </Popover.Trigger>
              <Popover.Content className="w-auto p-0 bg-white" align="start">
                <Calendar
                  className="bg-white"
                  mode="single"
                  selected={checkIn}
                  onSelect={(date) => {
                    if (date instanceof Date) {
                      setCheckIn(date);
                    }
                  }}
                  disabled={disableCheckIn}
                />
              </Popover.Content>
            </Popover.Root>
          </div>

          <div className="flex flex-col w-full">
            <span className="text-sm font-medium mb-1">Check‑out</span>
            <Popover.Root>
              <Popover.Trigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start cursor-pointer"
                >
                  {formatDate(checkOut)}
                </Button>
              </Popover.Trigger>
              <Popover.Content className="w-auto p-0 bg-white" align="start">
                <Calendar
                  className="bg-white"
                  mode="single"
                  selected={checkOut}
                  onSelect={(date) => {
                    if (date instanceof Date) {
                      setCheckOut(date);
                    }
                  }}
                  disabled={disableCheckOut}
                />
              </Popover.Content>
            </Popover.Root>
          </div>
        </div>
        <Button className="cursor-pointer" disabled={!checkIn || !checkOut}>Book Now</Button>
      </CardContent>
    </Card>
  );
}

export default BookingBox;
