import { useTranslation } from "react-i18next";

export const useFormatDate = () => {
  const { t: booking } = useTranslation("booking");
  return (date?: Date) => date ? date.toLocaleDateString() : booking("selectDate");
};