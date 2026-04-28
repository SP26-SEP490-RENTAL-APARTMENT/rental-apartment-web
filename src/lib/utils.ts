import { clsx, type ClassValue } from "clsx";
import { useTranslation } from "react-i18next";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatPrice = (price: number, currency: string) => {
  return price.toLocaleString("vi-VN") + " " + currency;
};

export const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("vi-VN");

export const useGetStatus = (status: string) => {
  const { t } = useTranslation("user");
  switch (status) {
    case "paid":
      return t("booking.paid");
    case "pending":
      return t("booking.pending");
    case "confirmed":
      return t("booking.confirmed");
    case "cancelled":
      return t("booking.cancelled");
    default:
      return status;
  }
};

export const useGetPaymentMode = (paymentMode: string) => {
  const { t } = useTranslation("user");
  switch (paymentMode) {
    case "full":
      return t("booking.fullPayment");
    case "partial":
      return t("booking.partialPayment");
    default:
      return paymentMode;
  }
};
