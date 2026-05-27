import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { bookingApi, packageApi } from "@/services/privateApi/tenantApi";
import type { Package } from "@/types/package";
import type { ParamsProp } from "@/types/params";
import { ROUTES } from "@/constants/routes";
import type { Apartment } from "@/types/apartment";
import { toast } from "sonner";
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
import type { DateRange } from "react-day-picker";
import { format, set } from "date-fns";
import BookingSummary from "./BookingSummary";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import PriceDay from "./PriceDay";
import { useTranslation } from "react-i18next";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

export interface Props {
  apartmentId: string;
  onSubmit: () => void;
  apartment: Apartment;
}

function BookingBox({ apartmentId, onSubmit, apartment }: Props) {
  const { t } = useTranslation("book");
  const navigate = useNavigate();
  const [checkIn, setCheckIn] = useState<Date | undefined>(undefined);
  const [checkOut, setCheckOut] = useState<Date | undefined>(undefined);
  const [noOfAdults, setNoOfAdults] = useState(1);
  const [noOfInfants, setNoOfInfants] = useState(0);
  const [noOfChildren, setNoOfChildren] = useState(0);
  const [noOfPets, setNoOfPets] = useState(0);
  const [packageId, setPackageId] = useState<string | null>(null);
  const [packages, setPackages] = useState<Package[]>([]);
  const [loadingPackages, setLoadingPackages] = useState(false);
  const [range, setRange] = useState<DateRange | undefined>();
  const [checkInTime, setCheckInTime] = useState("14:00");
  const [checkOutTime, setCheckOutTime] = useState("12:00");

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

  const mergeDateTime = (date: Date, time: string) => {
    const [hours, minutes] = time.split(":").map(Number);

    return set(date, {
      hours,
      minutes,
      seconds: 0,
      milliseconds: 0,
    });
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
      noOfChildren,
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
      <CardHeader className="bg-linear-to-r from-blue-500 to-blue-600 text-white py-6">
        <CardTitle className="text-center text-2xl font-bold">
          {checkIn && checkOut ? (
            <BookingSummary
              apartment={apartment}
              checkIn={range?.from}
              checkOut={range?.to}
            />
          ) : (
            t("booking.bookNow")
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Check-in & Check-out */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-blue-600" />
            {t("booking.checkIn")} & {t("booking.checkOut")}
          </Label>

          {/* <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start border-gray-300"
              >
                {range?.from ? (
                  range.to ? (
                    <>
                      {format(range.from, "dd/MM/yyyy")} -{" "}
                      {format(range.to, "dd/MM/yyyy")}
                    </>
                  ) : (
                    format(range.from, "dd/MM/yyyy")
                  )
                ) : (
                  t("booking.selectDate")
                )}
              </Button>
            </PopoverTrigger>

            <PopoverContent
              align="end"
              className="w-auto p-4 bg-white border rounded-xl shadow-xl z-50"
            >
              <Calendar
                mode="range"
                numberOfMonths={2}
                selected={range}
                onSelect={(value) => {
                  setRange(value);

                  if (value?.from) {
                    setCheckIn(mergeDateTime(value.from, checkInTime));
                  }

                  if (value?.to) {
                    setCheckOut(mergeDateTime(value.to, checkOutTime));
                  }
                }}
                disabled={disableCheckIn}
                components={{
                  DayButton: ({ day, ...props }) => (
                    <button {...props} className="h-12 w-12">
                      <PriceDay date={day.date} apartment={apartment} />
                    </button>
                  ),
                }}
              />
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Check in time</label>
                  <input
                    type="time"
                    value={checkInTime}
                    onChange={(e) => {
                      const time = e.target.value;
                      setCheckInTime(time);

                      if (range?.from) {
                        setCheckIn(mergeDateTime(range.from, time));
                      }
                    }}
                    className="w-full mt-1 border rounded-md px-3 py-2"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Check out time</label>
                  <input
                    type="time"
                    value={checkOutTime}
                    onChange={(e) => {
                      const time = e.target.value;
                      setCheckOutTime(time);

                      if (range?.to) {
                        setCheckOut(mergeDateTime(range.to, time));
                      }
                    }}
                    className="w-full mt-1 border rounded-md px-3 py-2"
                  />
                </div>
              </div>
            </PopoverContent>
          </Popover> */}
          <Drawer>
            <DrawerTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start border-gray-300"
              >
                {range?.from ? (
                  range.to ? (
                    <>
                      {format(range.from, "dd/MM/yyyy")} -{" "}
                      {format(range.to, "dd/MM/yyyy")}
                    </>
                  ) : (
                    format(range.from, "dd/MM/yyyy")
                  )
                ) : (
                  t("booking.selectDate")
                )}
              </Button>
            </DrawerTrigger>

            <DrawerContent className="max-h-[90vh]">
              <DrawerHeader>
                <DrawerTitle>{t("booking.selectDate")}</DrawerTitle>
              </DrawerHeader>

              <div className="px-4 pb-6 overflow-y-auto">
                <Calendar
                  mode="range"
                  numberOfMonths={2} // mobile nên để 1 tháng
                  selected={range}
                  onSelect={(value) => {
                    setRange(value);

                    if (value?.from) {
                      setCheckIn(mergeDateTime(value.from, checkInTime));
                    }

                    if (value?.to) {
                      setCheckOut(mergeDateTime(value.to, checkOutTime));
                    }
                  }}
                  disabled={disableCheckIn}
                  className="mx-auto"
                  components={{
                    DayButton: ({ day, ...props }) => (
                      <button {...props} className="h-12 w-12">
                        <PriceDay date={day.date} apartment={apartment} />
                      </button>
                    ),
                  }}
                />

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Check in</label>
                    <input
                      type="time"
                      value={checkInTime}
                      onChange={(e) => {
                        const time = e.target.value;
                        setCheckInTime(time);

                        if (range?.from) {
                          setCheckIn(mergeDateTime(range.from, time));
                        }
                      }}
                      className="w-full mt-1 border rounded-md px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Check out</label>
                    <input
                      type="time"
                      value={checkOutTime}
                      onChange={(e) => {
                        const time = e.target.value;
                        setCheckOutTime(time);

                        if (range?.to) {
                          setCheckOut(mergeDateTime(range.to, time));
                        }
                      }}
                      className="w-full mt-1 border rounded-md px-3 py-2"
                    />
                  </div>
                </div>
              </div>

              <DrawerFooter>
                <DrawerClose asChild>
                  <Button>{t("booking.done")}</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>

        {/* Guests */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <Users className="h-4 w-4 text-blue-600" />
            {t("booking.guests")}
          </Label>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <Label
                htmlFor="adults"
                className="text-xs text-gray-700 mb-1 block"
              >
                {t("booking.occupants")}
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start border-gray-300"
                  >
                    {(noOfAdults + noOfChildren) | 0}
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start">
                  <div className="grid grid-cols-2 gap-2 w-full">
                    <div className="grid gap-2">
                      <Label className="text-xs text-gray-700 mb-1 block">
                        {t("booking.adults")}
                      </Label>
                      <Input
                        id="adults"
                        type="number"
                        min="0"
                        max={apartment.maxOccupants - noOfChildren}
                        value={noOfAdults}
                        onChange={(e) => setNoOfAdults(Number(e.target.value))}
                        className="border-gray-300"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label className="text-xs text-gray-700 mb-1 block">
                        {t("booking.children")} (2-12 {t("booking.years")})
                      </Label>
                      <Input
                        id="children"
                        type="number"
                        min="0"
                        max={apartment.maxOccupants - noOfAdults}
                        value={noOfChildren}
                        onChange={(e) =>
                          setNoOfChildren(Number(e.target.value))
                        }
                        className="border-gray-300"
                      />
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-xs text-gray-500">
                      {t("booking.maxOccupantsWarning", {
                        maxOccupants: apartment.maxOccupants,
                      })}
                    </p>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label
                htmlFor="infants"
                className="text-xs text-gray-700 mb-1 block"
              >
                {t("booking.infants")}
              </Label>
              <Input
                id="infants"
                type="number"
                min="0"
                max={apartment.maxInfants}
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
                {t("booking.pets").charAt(0).toUpperCase() +
                  t("booking.pets").slice(1)}
              </Label>
              <Input
                id="pets"
                type="number"
                min="0"
                max={apartment.isPetAllowed ? apartment.maxPets || 0 : 0}
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
            {t("booking.package")}
          </Label>
          {loadingPackages ? (
            <div className="text-center py-4 text-gray-500 text-sm">
              {t("booking.loadingPackages")}
            </div>
          ) : packages?.length === 0 ? (
            <div className="text-center py-4 text-gray-500 text-sm">
              {t("booking.noPackagesAvailable")}
            </div>
          ) : (
            <Select
              value={packageId ?? ""}
              onValueChange={(value) => {
                setPackageId(value === "noPackage" ? null : value);
              }}
            >
              <SelectTrigger className="border-gray-300">
                <SelectValue placeholder={t("booking.noPackage")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="noPackage">
                  {t("booking.noPackage")}
                </SelectItem>
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
            {t("booking.checkAvailability")}
          </Button>
          {checkIn && checkOut && noOfAdults >= 1 && (
            <Button
              className="w-full cursor-pointer bg-linear-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-2.5"
              onClick={handleBook}
            >
              {t("booking.reserve")}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default BookingBox;
