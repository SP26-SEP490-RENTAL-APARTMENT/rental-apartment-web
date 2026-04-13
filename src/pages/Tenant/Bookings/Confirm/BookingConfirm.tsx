import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation, useNavigate } from "react-router-dom";
import {
  bookingConfirmSchema,
  type BookingConfirmFormData,
} from "@/schemas/bookingSchema";
import { bookingApi } from "@/services/privateApi/tenantApi";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

function BookingConfirm() {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const quoteData = location.state;

  // Calculate number of nights
  const calculateNights = () => {
    if (!quoteData?.checkInDate || !quoteData?.checkOutDate) return 0;
    const checkIn = new Date(quoteData.checkInDate);
    const checkOut = new Date(quoteData.checkOutDate);
    const nights = Math.ceil(
      (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24),
    );
    return nights;
  };

  const nights = calculateNights();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(bookingConfirmSchema),
    defaultValues: {
      apartmentId: quoteData?.apartmentId || "",
      checkInDate: quoteData?.checkInDate || "",
      checkOutDate: quoteData?.checkOutDate || "",
      nights: nights || 1,
      noOfAdults: quoteData?.noOfAdults || 1,
      noOfInfants: quoteData?.noOfInfants || 0,
      noOfPets: quoteData?.noOfPets || 0,
      packageId: quoteData?.packageId || "",
      paymentMode: "partial" as const,
      paymentProvider: "stripe" as const,
    },
  });

  const onSubmit = async (data: BookingConfirmFormData) => {
    try {
      setError(null);
      const response = await bookingApi.confirmBooking(data);
      sessionStorage.setItem("payment_info", JSON.stringify(data));
      const paymentLink = response.data.data.paymentLink.url;
      setSuccessMessage("Booking confirmed successfully!");
      window.location.href = paymentLink;
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to confirm booking");
      console.error("Error confirming booking:", err);
      setError("Failed to confirm booking. Please try again.");
    }
  };

  if (!quoteData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold mb-2">Confirm Booking</h1>
        <p className="text-gray-600 mb-8">
          Review your booking details and complete the confirmation.
        </p>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
            {successMessage}
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit, (errors) => {
            console.log("VALIDATION ERRORS:", errors);
          })}
        >
          {/* Booking Summary Section */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <h2 className="text-lg font-semibold text-gray-900">
              Booking Summary
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* LEFT - Booking Info */}
              <Card>
                <CardContent className="p-4 space-y-4">
                  <h3 className="font-semibold text-lg">Booking Info</h3>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Check-in</p>
                      <p className="font-medium">
                        {new Date(quoteData.checkInDate).toLocaleDateString()}
                      </p>
                    </div>

                    <div>
                      <p className="text-muted-foreground">Check-out</p>
                      <p className="font-medium">
                        {new Date(quoteData.checkOutDate).toLocaleDateString()}
                      </p>
                    </div>

                    <div>
                      <p className="text-muted-foreground">Nights</p>
                      <p className="font-medium">{nights} nights</p>
                    </div>

                    <div>
                      <p className="text-muted-foreground">Guests</p>
                      <p className="font-medium">
                        {quoteData.noOfAdults + quoteData.noOfInfants} people
                        {quoteData.noOfPets > 0 &&
                          ` + ${quoteData.noOfPets} pet(s)`}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* RIGHT - Pricing */}
              <Card>
                <CardContent className="p-4 space-y-4">
                  <h3 className="font-semibold text-lg">Price Details</h3>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Price / night
                      </span>
                      <span>
                        {quoteData.basePricePerNight.toLocaleString("vi-VN")} đ
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Base amount</span>
                      <span>
                        {quoteData.baseAmount.toLocaleString("vi-VN")} đ
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Package</span>
                      <span>
                        {quoteData.packageAmount.toLocaleString("vi-VN")} đ
                      </span>
                    </div>

                    <Separator />

                    <div className="flex justify-between font-semibold text-base">
                      <span>Total</span>
                      <span>
                        {quoteData.totalPrice.toLocaleString("vi-VN")} đ
                      </span>
                    </div>

                    <div className="flex justify-between text-green-600">
                      <span>Deposit</span>
                      <span>
                        {quoteData.suggestedDeposit.toLocaleString("vi-VN")} đ
                      </span>
                    </div>

                    <div className="flex justify-between text-red-500">
                      <span>Remaining</span>
                      <span>
                        {quoteData.remainingBalance.toLocaleString("vi-VN")} đ
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Guests Information */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">
              Guests Information
            </h3>
            <div className="space-y-2 text-sm text-gray-700">
              <p>Adults: {quoteData.noOfAdults}</p>
              <p>Infants: {quoteData.noOfInfants}</p>
              <p>Pets: {quoteData.noOfPets}</p>
            </div>
          </div>

          {/* Hidden fields for read-only data */}
          <Controller
            name="apartmentId"
            control={control}
            render={({ field }) => <input {...field} type="hidden" />}
          />
          <Controller
            name="checkInDate"
            control={control}
            render={({ field }) => <input {...field} type="hidden" />}
          />
          <Controller
            name="checkOutDate"
            control={control}
            render={({ field }) => <input {...field} type="hidden" />}
          />
          <Controller
            name="nights"
            control={control}
            render={({ field }) => (
              <input {...field} type="hidden" value={nights} />
            )}
          />
          <Controller
            name="noOfAdults"
            control={control}
            render={({ field }) => <input {...field} type="hidden" />}
          />
          <Controller
            name="noOfInfants"
            control={control}
            render={({ field }) => <input {...field} type="hidden" />}
          />
          <Controller
            name="noOfPets"
            control={control}
            render={({ field }) => <input {...field} type="hidden" />}
          />
          <Controller
            name="packageId"
            control={control}
            render={({ field }) => <input {...field} type="hidden" />}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Payment method
            </label>
            <Controller
              name="paymentMode"
              control={control}
              render={({ field }) => (
                <div className="flex w-full gap-3">
                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition flex-1">
                    <input
                      {...field}
                      type="radio"
                      value="partial"
                      checked={field.value === "partial"}
                      className="w-4 h-4"
                    />
                    <span className="ml-3 font-medium text-gray-900">
                      Deposit
                    </span>
                  </label>

                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition flex-1">
                    <input
                      {...field}
                      type="radio"
                      value="full"
                      checked={field.value === "full"}
                      className="w-4 h-4"
                    />
                    <span className="ml-3 font-medium text-gray-900">Full</span>
                  </label>
                </div>
              )}
            />
            {errors.paymentProvider && (
              <p className="mt-2 text-sm text-red-600">
                {errors.paymentProvider.message}
              </p>
            )}
          </div>

          {/* Payment Provider */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Payment Provider *
            </label>
            <Controller
              name="paymentProvider"
              control={control}
              render={({ field }) => (
                <div className="space-y-2">
                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition">
                    <input
                      {...field}
                      type="radio"
                      value="stripe"
                      checked={field.value === "stripe"}
                      className="w-4 h-4"
                    />
                    <span className="ml-3 font-medium text-gray-900">
                      Stripe
                    </span>
                  </label>
                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition">
                    <input
                      {...field}
                      type="radio"
                      value="momo"
                      checked={field.value === "momo"}
                      className="w-4 h-4"
                    />
                    <span className="ml-3 font-medium text-gray-900">Momo</span>
                  </label>
                </div>
              )}
            />
            {errors.paymentProvider && (
              <p className="mt-2 text-sm text-red-600">
                {errors.paymentProvider.message}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition"
            >
              {isSubmitting ? "Confirming..." : "Confirm Booking"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BookingConfirm;
