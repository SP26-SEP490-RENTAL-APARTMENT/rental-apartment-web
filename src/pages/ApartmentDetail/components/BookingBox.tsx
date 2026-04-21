import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import * as Popover from "@radix-ui/react-popover";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFormatDate } from "@/utils/utils";
import { bookingApi, packageApi } from "@/services/privateApi/tenantApi";
import type { Package } from "@/types/package";
import type { ParamsProp } from "@/types/params";
import { ROUTES } from "@/constants/routes";
import type { Apartment } from "@/types/apartment";
import { toast } from "sonner";

export interface Props {
  apartmentId: string;
  onSubmit: () => void;
  apartment: Apartment;
}

function BookingBox({ apartmentId, onSubmit, apartment }: Props) {
  const navigate = useNavigate();
  const [checkIn, setCheckIn] = useState<Date | undefined>(undefined);
  const [checkOut, setCheckOut] = useState<Date | undefined>(undefined);
  const [noOfAdults, setNoOfAdults] = useState(1);
  const [noOfInfants, setNoOfInfants] = useState(0);
  const [noOfPets, setNoOfPets] = useState(0);
  const [packageId, setPackageId] = useState<string | null>(null);
  const [packages, setPackages] = useState<Package[]>([]);
  const [loadingPackages, setLoadingPackages] = useState(false);
  const formatDates = useFormatDate();

  // Fetch packages on component mount
  useEffect(() => {
    const fetchPackages = async () => {
      setLoadingPackages(true);
      try {
        const params: ParamsProp = {
          page: 1,
          pageSize: 100,
          sortBy: "",
          sortOrder: "",
          search: "",
        };
        const response = await packageApi.getPackageByApartment(
          apartmentId,
          params,
        );
        setPackages(response.data.items);
        if (response.data.items.length > 0) {
          setPackageId(response.data.items[0].packageId);
        }
      } catch (error) {
        console.error("Error fetching packages:", error);
      } finally {
        setLoadingPackages(false);
      }
    };

    if (apartmentId) {
      fetchPackages();
    }
  }, [apartmentId]);

  const isPastDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return date < today;
  };

  const disableCheckIn = (date: Date) => {
    return isPastDate(date);
  };

  // const disableCheckOut = (date: Date) => {
  //   if (isPastDate(date)) return true;

  //   if (checkIn) {
  //     return date <= checkIn;
  //   }

  //   return false;
  // };

  const handleBook = async () => {
    if (!checkIn || !checkOut) {
      alert("Please fill in all required fields");
      return;
    }

    const quoteData = {
      apartmentId,
      checkInDateTime: checkIn.toISOString(),
      checkOutDateTime: checkOut.toISOString(),
      noOfAdults,
      noOfInfants,
      noOfPets,
      packageId,
    };

    try {
      const response = await bookingApi.createBookingQuote(quoteData);
      const bookingDetails = response.data.data;

      navigate(ROUTES.TENANT_BOOKING_CONFIRM, {
        state: {
          ...quoteData,
          nights: bookingDetails.nights,
          basePricePerNight: bookingDetails.basePricePerNight,
          baseAmount: bookingDetails.baseAmount,
          packageAmount: bookingDetails.packageAmount,
          totalPrice: bookingDetails.totalPrice,
          suggestedDeposit: bookingDetails.suggestedDeposit,
          remainingBalance: bookingDetails.remainingBalance,
        },
      });
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to create booking quote",
      );
    }
  };

  return (
    <Card className="shadow-2xl">
      <CardHeader>
        <CardTitle className="text-center">Book Now</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {/* Check-in & Check-out */}
        <div className="flex gap-2 items-end">
          <div className="flex flex-col w-full">
            <span className="text-sm font-medium mb-1">Check-in *</span>

            <Popover.Root>
              <Popover.Trigger asChild>
                <Button variant="outline" className="w-full justify-start">
                  {formatDates(checkIn)}
                </Button>
              </Popover.Trigger>

              <Popover.Content className="p-3 bg-white flex flex-col gap-2">
                <Calendar
                  mode="single"
                  selected={checkIn}
                  onSelect={(date) => {
                    if (date) {
                      const newDate = new Date(date);
                      // giữ giờ cũ nếu có
                      if (checkIn) {
                        newDate.setHours(
                          checkIn.getHours(),
                          checkIn.getMinutes(),
                        );
                      }
                      setCheckIn(newDate);
                    }
                  }}
                  disabled={disableCheckIn}
                />

                {/* chọn giờ */}
                <input
                  type="time"
                  className="border rounded p-2"
                  value={
                    checkIn
                      ? `${String(checkIn.getHours()).padStart(2, "0")}:${String(
                          checkIn.getMinutes(),
                        ).padStart(2, "0")}`
                      : ""
                  }
                  onChange={(e) => {
                    if (!checkIn) return;
                    const [h, m] = e.target.value.split(":").map(Number);
                    const newDate = new Date(checkIn);
                    newDate.setHours(h, m);
                    setCheckIn(newDate);
                  }}
                />
              </Popover.Content>
            </Popover.Root>
          </div>

          <div className="flex flex-col w-full">
            <span className="text-sm font-medium mb-1">Check-out *</span>

            <Popover.Root>
              <Popover.Trigger asChild>
                <Button variant="outline" className="w-full justify-start">
                  {formatDates(checkOut)}
                </Button>
              </Popover.Trigger>

              <Popover.Content className="p-3 bg-white flex flex-col gap-2">
                <Calendar
                  mode="single"
                  selected={checkOut}
                  onSelect={(date) => {
                    if (date) {
                      const newDate = new Date(date);
                      // giữ giờ cũ nếu có
                      if (checkOut) {
                        newDate.setHours(
                          checkOut.getHours(),
                          checkOut.getMinutes(),
                        );
                      }
                      setCheckOut(newDate);
                    }
                  }}
                  disabled={disableCheckIn}
                />

                {/* chọn giờ */}
                <input
                  type="time"
                  className="border rounded p-2"
                  value={
                    checkOut
                      ? `${String(checkOut.getHours()).padStart(2, "0")}:${String(
                          checkOut.getMinutes(),
                        ).padStart(2, "0")}`
                      : ""
                  }
                  onChange={(e) => {
                    if (!checkOut) return;
                    const [h, m] = e.target.value.split(":").map(Number);
                    const newDate = new Date(checkOut);
                    newDate.setHours(h, m);
                    setCheckOut(newDate);
                  }}
                />
              </Popover.Content>
            </Popover.Root>
          </div>
        </div>

        {/* Guests */}
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="text-sm font-medium mb-1 block">Adults *</label>
            <input
              type="number"
              min="1"
              max={apartment.maxOccupants}
              value={noOfAdults}
              onChange={(e) => setNoOfAdults(Number(e.target.value))}
              className="w-full px-2 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Infants</label>
            <input
              type="number"
              min="0"
              max="3"
              value={noOfInfants}
              onChange={(e) => setNoOfInfants(Number(e.target.value))}
              className="w-full px-2 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Pets</label>
            <input
              type="number"
              min="0"
              value={noOfPets}
              onChange={(e) => setNoOfPets(Number(e.target.value))}
              className="w-full px-2 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Package Selection */}
        <div>
          <label className="text-sm font-medium mb-2 block">
            Select Package *
          </label>
          {loadingPackages ? (
            <div className="text-center py-4 text-gray-500">
              Loading packages...
            </div>
          ) : packages?.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              No packages available
            </div>
          ) : (
            <select
              value={packageId ?? ""}
              onChange={(e) => {
                const value = e.target.value;
                setPackageId(value === "" ? null : value);
              }}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Không chọn</option>
              {packages?.map((pkg) => (
                <option key={pkg.packageId} value={pkg.packageId}>
                  {pkg.name} - {pkg.currency} {pkg.price.toLocaleString()}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-2 pt-2">
          <Button className="flex-1 cursor-pointer" onClick={onSubmit}>
            Check Availability
          </Button>
          {checkIn &&
            checkOut &&
            noOfAdults >= 1 &&
            noOfInfants >= 0 &&
            noOfPets >= 0 && (
              <Button
                className="flex-1 cursor-pointer bg-green-600 hover:bg-green-700"
                onClick={handleBook}
              >
                Book
              </Button>
            )}
        </div>
      </CardContent>
    </Card>
  );
}

export default BookingBox;
