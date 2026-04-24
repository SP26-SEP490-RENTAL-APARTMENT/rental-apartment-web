import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation, useNavigate } from "react-router-dom";
import {
  bookingConfirmSchema,
  type BookingConfirmFormData,
} from "@/schemas/bookingSchema";
import { bookingApi } from "@/services/privateApi/tenantApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useBookingStore } from "@/store/bookingStore";
import {
  ArrowLeft,
  Calendar,
  CreditCard,
  DollarSign,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";

function BookingConfirm() {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const setBookingData = useBookingStore((state) => state.setBookingData);

  const quoteData = location.state;

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(bookingConfirmSchema),
    defaultValues: {
      apartmentId: quoteData?.apartmentId || "",
      checkInDateTime: quoteData?.checkInDateTime || "",
      checkOutDateTime: quoteData?.checkOutDateTime || "",
      nights: quoteData?.nights || 1,
      noOfAdults: quoteData?.noOfAdults || 1,
      noOfInfants: quoteData?.noOfInfants || 0,
      noOfPets: quoteData?.noOfPets || 0,
      packageId: quoteData?.packageId || null,
      paymentMode: "partial" as const,
      paymentProvider: "stripe" as const,
    },
  });

  const onSubmit = async (data: BookingConfirmFormData) => {
    console.log(data);

    try {
      setError(null);
      const response = await bookingApi.confirmBooking(data);
      setBookingData(data);
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
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="h-10 w-10"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Confirm Booking
              </h1>
              <p className="text-gray-600 mt-1">
                Review and complete your reservation
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <div className="flex-1">
              <p className="text-red-800 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Success Alert */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
            <div className="flex-1">
              <p className="text-green-800 font-medium">{successMessage}</p>
            </div>
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit, (errors) => {
            console.log("VALIDATION ERRORS:", errors);
          })}
          className="space-y-6"
        >
          {/* Booking Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Booking Info Card */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  Booking Details
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase">
                      Check-in
                    </p>
                    <p className="text-lg font-medium text-gray-900">
                      {new Date(quoteData.checkInDateTime).toLocaleDateString(
                        "en-US",
                        {
                          weekday: "short",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        },
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase">
                      Check-out
                    </p>
                    <p className="text-lg font-medium text-gray-900">
                      {new Date(quoteData.checkOutDateTime).toLocaleDateString(
                        "en-US",
                        {
                          weekday: "short",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        },
                      )}
                    </p>
                  </div>
                  <Separator className="my-3" />
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase">
                        Duration
                      </p>
                      <p className="text-lg font-medium text-gray-900">
                        {quoteData.nights} nights
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase">
                        Guests
                      </p>
                      <p className="text-lg font-medium text-gray-900">
                        {quoteData.noOfAdults + quoteData.noOfInfants}
                        {quoteData.noOfPets > 0 && ` + ${quoteData.noOfPets}P`}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Price Details Card */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  Price Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Nightly rate</span>
                    <span className="font-medium text-gray-900">
                      {quoteData.basePricePerNight.toLocaleString("vi-VN")} đ
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">
                      Base amount ({quoteData.nights}N)
                    </span>
                    <span className="font-medium text-gray-900">
                      {quoteData.baseAmount.toLocaleString("vi-VN")} đ
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Package</span>
                    <span className="font-medium text-gray-900">
                      {quoteData.packageAmount.toLocaleString("vi-VN")} đ
                    </span>
                  </div>
                  <Separator className="my-3" />
                  <div className="flex justify-between items-center text-lg">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="font-bold text-green-600">
                      {quoteData.totalPrice.toLocaleString("vi-VN")} đ
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Plan Selection */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                Guest Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-xs font-semibold text-gray-500 uppercase">
                    Adults
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {quoteData.noOfAdults}
                  </p>
                </div>
                <div className="bg-purple-50 rounded-lg p-3">
                  <p className="text-xs font-semibold text-gray-500 uppercase">
                    Infants
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {quoteData.noOfInfants}
                  </p>
                </div>
                <div className="bg-orange-50 rounded-lg p-3">
                  <p className="text-xs font-semibold text-gray-500 uppercase">
                    Pets
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {quoteData.noOfPets}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method Selection */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-purple-600" />
                Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              {/* Payment Mode */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Select Payment Option
                </label>
                <Controller
                  name="paymentMode"
                  control={control}
                  render={({ field }) => (
                    <div className="flex gap-3">
                      <label
                        className="flex-1 flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-400 transition"
                        style={{
                          borderColor:
                            field.value === "partial"
                              ? "rgb(59, 130, 246)"
                              : undefined,
                          backgroundColor:
                            field.value === "partial"
                              ? "rgb(239, 246, 255)"
                              : undefined,
                        }}
                      >
                        <input
                          {...field}
                          type="radio"
                          value="partial"
                          className="w-4 h-4 accent-blue-600"
                        />
                        <span className="ml-3">
                          <span className="block font-medium text-gray-900">
                            Deposit
                          </span>
                          <span className="block text-sm text-green-600">
                            {quoteData.suggestedDeposit.toLocaleString("vi-VN")}{" "}
                            đ
                          </span>
                        </span>
                      </label>
                      <label
                        className="flex-1 flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-400 transition"
                        style={{
                          borderColor:
                            field.value === "full"
                              ? "rgb(59, 130, 246)"
                              : undefined,
                          backgroundColor:
                            field.value === "full"
                              ? "rgb(239, 246, 255)"
                              : undefined,
                        }}
                      >
                        <input
                          {...field}
                          type="radio"
                          value="full"
                          className="w-4 h-4 accent-blue-600"
                        />
                        <span className="ml-3">
                          <span className="block font-medium text-gray-900">
                            Full Payment
                          </span>
                          <span className="block text-sm text-green-600">
                            {quoteData.totalPrice.toLocaleString("vi-VN")} đ
                          </span>
                        </span>
                      </label>
                    </div>
                  )}
                />
              </div>

              {/* Payment Provider */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Payment Provider
                </label>
                <Controller
                  name="paymentProvider"
                  control={control}
                  render={({ field }) => (
                    <div className="space-y-2">
                      <label
                        className="flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-400 transition"
                        style={{
                          borderColor:
                            field.value === "stripe"
                              ? "rgb(59, 130, 246)"
                              : undefined,
                          backgroundColor:
                            field.value === "stripe"
                              ? "rgb(239, 246, 255)"
                              : undefined,
                        }}
                      >
                        <input
                          {...field}
                          type="radio"
                          value="stripe"
                          className="w-4 h-4 accent-blue-600"
                        />
                        <span className="ml-3">
                          <span className="font-medium text-gray-900">
                            Stripe
                          </span>
                          <span className="text-sm text-gray-500 ml-1">
                            (Credit/Debit Card)
                          </span>
                        </span>
                      </label>
                      <label
                        className="flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-400 transition"
                        style={{
                          borderColor:
                            field.value === "momo"
                              ? "rgb(59, 130, 246)"
                              : undefined,
                          backgroundColor:
                            field.value === "momo"
                              ? "rgb(239, 246, 255)"
                              : undefined,
                        }}
                      >
                        <input
                          {...field}
                          type="radio"
                          value="momo"
                          className="w-4 h-4 accent-blue-600"
                        />
                        <span className="ml-3">
                          <span className="font-medium text-gray-900">
                            Momo
                          </span>
                          <span className="text-sm text-gray-500 ml-1">
                            (Mobile Wallet)
                          </span>
                        </span>
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
            </CardContent>
          </Card>

          {/* Hidden Fields */}
          <Controller
            name="apartmentId"
            control={control}
            render={({ field }) => <input {...field} type="hidden" />}
          />
          <Controller
            name="checkInDateTime"
            control={control}
            render={({ field }) => <input {...field} type="hidden" />}
          />
          <Controller
            name="checkOutDateTime"
            control={control}
            render={({ field }) => <input {...field} type="hidden" />}
          />
          <Controller
            name="nights"
            control={control}
            render={({ field }) => (
              <input {...field} type="hidden" value={quoteData.nights} />
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

          {/* Action Buttons */}
          <div className="flex gap-3 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
              className="flex-1 h-11"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 h-11 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold"
            >
              {isSubmitting ? "Processing..." : "Confirm & Pay"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BookingConfirm;
