import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatPrice = (price: number, currency: string) => {
  return price.toLocaleString("vi-VN") + " " + currency;
};

export const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("vi-VN");
