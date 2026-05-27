import { differenceInDays } from "date-fns";
import type { Apartment } from "@/types/apartment";
import { calculateTotal } from "./booking-utils";
import { useTranslation } from "react-i18next";

interface Props {
  apartment: Apartment;
  checkIn?: Date;
  checkOut?: Date;
}

export default function BookingSummary({
  apartment,
  checkIn,
  checkOut,
}: Props) {
  const {t} = useTranslation('book');
  return (
    <div className="flex gap-2 justify-center items-center">
      <p className="text-black">{calculateTotal(apartment, checkIn, checkOut).toLocaleString('vi-VN')} ₫</p>{" "}
      {t("booking.for")}{" "}
      <p>
        {checkIn && checkOut ? differenceInDays(checkOut, checkIn) : 0} {t("booking.nights")}
      </p>
    </div>
  );
}
