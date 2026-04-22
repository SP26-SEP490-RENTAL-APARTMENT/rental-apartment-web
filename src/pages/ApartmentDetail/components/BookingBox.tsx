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
import { useTranslation } from "react-i18next";
import { CalendarIcon, Users, Zap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface Props {
  apartmentId: string;
  onSubmit: () => void;
  apartment: Apartment;
}

function BookingBox({ apartmentId, onSubmit, apartment }: Props) {
  const { t } = useTranslation("booking");
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
    <Card className="shadow-xl border-0 bg-white overflow-hidden pt-0">
      <CardHeader className="bg-linear-to-r from-blue-600 to-blue-700 text-white py-6">
        <CardTitle className="text-center text-2xl font-bold">
          {t("bookNow")}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Check-in & Check-out */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-blue-600" />
            Check-in & Check-out
          </Label>
          <div className="flex gap-2">
            <div className="flex-1">
              <Popover.Root>
                <Popover.Trigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal border-gray-300 hover:bg-gray-50"
                  >
                    {checkIn ? formatDates(checkIn) : "Select date"}
                  </Button>
                </Popover.Trigger>

                <Popover.Content className="p-3 bg-white flex flex-col gap-2 rounded-lg shadow-lg">
                  <Calendar
                    mode="single"
                    selected={checkIn}
                    onSelect={(date) => {
                      if (date) {
                        const newDate = new Date(date);
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

                  <input
                    type="time"
                    className="border border-gray-300 rounded p-2 text-sm"
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

            <div className="flex-1">
              <Popover.Root>
                <Popover.Trigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal border-gray-300 hover:bg-gray-50"
                  >
                    {checkOut ? formatDates(checkOut) : "Select date"}
                  </Button>
                </Popover.Trigger>

                <Popover.Content className="p-3 bg-white flex flex-col gap-2 rounded-lg shadow-lg">
                  <Calendar
                    mode="single"
                    selected={checkOut}
                    onSelect={(date) => {
                      if (date) {
                        const newDate = new Date(date);
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

                  <input
                    type="time"
                    className="border border-gray-300 rounded p-2 text-sm"
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
        </div>

        {/* Guests */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <Users className="h-4 w-4 text-blue-600" />
            Guests
          </Label>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <Label
                htmlFor="adults"
                className="text-xs text-gray-700 mb-1 block"
              >
                Adults
              </Label>
              <Input
                id="adults"
                type="number"
                min="1"
                max={apartment.maxOccupants}
                value={noOfAdults}
                onChange={(e) => setNoOfAdults(Number(e.target.value))}
                className="border-gray-300"
              />
            </div>
            <div>
              <Label
                htmlFor="infants"
                className="text-xs text-gray-700 mb-1 block"
              >
                Infants
              </Label>
              <Input
                id="infants"
                type="number"
                min="0"
                max="3"
                value={noOfInfants}
                onChange={(e) => setNoOfInfants(Number(e.target.value))}
                className="border-gray-300"
              />
            </div>
            <div>
              <Label
                htmlFor="pets"
                className="text-xs text-gray-700 mb-1 block"
              >
                Pets
              </Label>
              <Input
                id="pets"
                type="number"
                min="0"
                value={noOfPets}
                onChange={(e) => setNoOfPets(Number(e.target.value))}
                className="border-gray-300"
              />
            </div>
          </div>
        </div>

        {/* Package Selection */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <Zap className="h-4 w-4 text-blue-600" />
            Package
          </Label>
          {loadingPackages ? (
            <div className="text-center py-4 text-gray-500 text-sm">
              Loading packages...
            </div>
          ) : packages?.length === 0 ? (
            <div className="text-center py-4 text-gray-500 text-sm">
              No packages available
            </div>
          ) : (
            <Select
              value={packageId ?? ""}
              onValueChange={(value) => {
                setPackageId(value === "" ? null : value);
              }}
            >
              <SelectTrigger className="border-gray-300">
                <SelectValue placeholder="Select a package" />
              </SelectTrigger>
              <SelectContent>
                {/* <SelectItem value="">No Package</SelectItem> */}
                {packages?.map((pkg) => (
                  <SelectItem key={pkg.packageId} value={pkg.packageId}>
                    {pkg.name} - {pkg.currency} {pkg.price.toLocaleString()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-200" />

        {/* Buttons */}
        <div className="flex flex-col gap-2 pt-2">
          <Button
            className="w-full cursor-pointer bg-gray-100 text-gray-900 hover:bg-gray-200 font-semibold"
            onClick={onSubmit}
          >
            Check Availability
          </Button>
          {checkIn && checkOut && noOfAdults >= 1 && (
            <Button
              className="w-full cursor-pointer bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-2.5"
              onClick={handleBook}
            >
              Reserve Now
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default BookingBox;
