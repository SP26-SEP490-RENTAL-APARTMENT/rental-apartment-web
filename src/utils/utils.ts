import { useTranslation } from "react-i18next";

export const useFormatDate = () => {
  const { t: booking } = useTranslation("booking");
  return (date?: Date) => date ? date.toLocaleDateString() : booking("selectDate");
};

export const formatDateTime = (date?: string | null) => {
  if (!date) return "--";

  return new Date(date).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("vi-VN").format(value) + "đ";

export const diffMinutes = (
  actual: string,
  scheduled: string
): number => {
  const actualTime = new Date(actual).getTime();
  const scheduledTime = new Date(scheduled).getTime();

  return Math.floor((actualTime - scheduledTime) / (1000 * 60));
};

export const formatDuration = (minutes: number) => {
  const abs = Math.abs(minutes);

  const h = Math.floor(abs / 60);
  const m = abs % 60;

  if (h === 0) return `${m} mins`;
  return `${h}h ${m}m`;
};