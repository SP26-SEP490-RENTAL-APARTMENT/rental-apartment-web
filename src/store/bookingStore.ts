import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { BookingConfirmFormData } from "@/schemas/bookingSchema";

interface BookingStore {
  bookingData: BookingConfirmFormData | null;
  setBookingData: (data: BookingConfirmFormData) => void;
  clearBookingData: () => void;
}

export const useBookingStore = create<BookingStore>()(
  persist(
    (set) => ({
      bookingData: null,

      setBookingData: (data) =>
        set({
          bookingData: data,
        }),

      clearBookingData: () =>
        set({
          bookingData: null,
        }),
    }),
    {
      name: "booking-storage",
    },
  ),
);
