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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";

function BookingConfirm() {
  const { t } = useTranslation("book");
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
      noOfChildren: quoteData?.noOfChildren || 0,
      noOfInfants: quoteData?.noOfInfants || 0,
      noOfPets: quoteData?.noOfPets || 0,
      packageId: quoteData?.packageId || null,
      paymentMode: "partial" as const,
      paymentProvider: "payos" as const,
      devicePlatform: "web" as const,
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
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-blue-50">
      {/* Sticky Header */}
      <div className="sticky top-0 z-30 bg-linear-to-r from-white to-blue-50 border-b border-gray-100 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="h-10 w-10 hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-700" />
            </Button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-linear-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                {t("confirm.title")}
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                {t("confirm.description")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-linear-to-r from-red-50 to-rose-50 border border-red-200 rounded-xl shadow-sm flex items-start gap-3">
            <div className="flex-1">
              <p className="text-red-800 font-medium text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Success Alert */}
        {successMessage && (
          <div className="mb-6 p-4 bg-linear-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl shadow-sm flex items-start gap-3">
            <div className="flex-1">
              <p className="text-green-800 font-medium text-sm">
                {successMessage}
              </p>
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
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow rounded-2xl overflow-hidden group">
              {/* <div className="absolute inset-0 bg-linear-to-br from-blue-600 to-cyan-500/5 group-hover:from-blue-500/10 group-hover:to-cyan-500/10 transition-all" /> */}
              <CardHeader className="border-b border-gray-100/50 relative">
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-linear-to-br from-blue-600 to-cyan-600 rounded-lg">
                    <Calendar className="h-5 w-5 text-white" />
                  </div>
                  <span className="bg-linear-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    {t("confirm.detail.title")}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4 relative">
                <div className="space-y-4">
                  <div className="bg-linear-to-r from-blue-50 to-cyan-50 rounded-lg p-4">
                    <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                      {t("confirm.detail.checkIn")}
                    </p>
                    <p className="text-lg font-bold text-gray-900 mt-1">
                      {format(
                        new Date(quoteData.checkInDateTime),
                        "dd/MM/yyyy HH:mm",
                      )}
                    </p>
                  </div>
                  <div className="bg-linear-to-r from-blue-50 to-cyan-50 rounded-lg p-4">
                    <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                      {t("confirm.detail.checkOut")}
                    </p>
                    <p className="text-lg font-bold text-gray-900 mt-1">
                      {format(
                        new Date(quoteData.checkOutDateTime),
                        "dd/MM/yyyy HH:mm",
                      )}
                    </p>
                  </div>
                  <Separator className="my-2 bg-linear-to-r from-blue-200 to-cyan-200" />
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white border border-blue-100 rounded-lg p-3">
                      <p className="text-xs font-semibold text-gray-500 uppercase">
                        {t("confirm.detail.duration")}
                      </p>
                      <p className="text-lg font-bold text-blue-600 mt-1">
                        {quoteData.nights} {t("booking.nights")}
                      </p>
                    </div>
                    <div className="bg-white border border-cyan-100 rounded-lg p-3">
                      <p className="text-xs font-semibold text-gray-500 uppercase">
                        {t("confirm.detail.guests")}
                      </p>
                      <p className="text-lg font-bold text-cyan-600 mt-1">
                        {quoteData.noOfAdults + quoteData.noOfChildren}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Price Details Card */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow rounded-2xl overflow-hidden group bg-linear-to-br from-green-50 to-emerald-50">
              <CardHeader className="border-b border-gray-100/50 relative">
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-linear-to-br from-green-600 to-emerald-600 rounded-lg">
                    <DollarSign className="h-5 w-5 text-white" />
                  </div>
                  <span className="bg-linear-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    {t("confirm.price.title")}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-3 relative">
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors">
                    <span className="text-gray-600 font-medium">
                      {t("confirm.price.nightlyRate")}
                    </span>
                    <span className="font-bold text-gray-900">
                      {quoteData.resolvedPricePerNight.toLocaleString("vi-VN")}{" "}
                      đ
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors">
                    <span className="text-gray-600 font-medium">
                      {t("confirm.price.baseAmount")} ({quoteData.nights}{" "}
                      {t("confirm.price.nights")})
                    </span>
                    <span className="font-bold text-gray-900">
                      {quoteData.baseAmount.toLocaleString("vi-VN")} đ
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors">
                    <span className="text-gray-600 font-medium">
                      {t("confirm.price.package")}
                    </span>
                    <span className="font-bold text-gray-900">
                      {quoteData.packageAmount.toLocaleString("vi-VN")} đ
                    </span>
                  </div>
                  <Separator className="my-2 bg-linear-to-r from-green-200 to-emerald-200" />
                  <div className="flex justify-between items-center p-4 bg-linear-to-r from-green-600 to-emerald-600 rounded-xl">
                    <span className="font-bold text-white">
                      {t("confirm.price.total")}
                    </span>
                    <span className="font-bold text-white text-xl">
                      {quoteData.totalPrice.toLocaleString("vi-VN")} đ
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Plan Selection */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-gray-100/50 relative">
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-linear-to-br from-purple-600 to-pink-600 rounded-lg">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <span className="bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {t("confirm.guestInfo")}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 relative">
              <div className="grid grid-cols-4 gap-3 mb-6">
                <div className="bg-linear-to-br from-blue-600 to-blue-700 rounded-xl p-4 text-white hover:shadow-lg transition-all transform hover:scale-105">
                  <p className="text-xs font-semibold opacity-90 uppercase tracking-wide">
                    {t("booking.adults")}
                  </p>
                  <p className="text-3xl font-bold mt-2">
                    {quoteData.noOfAdults}
                  </p>
                </div>
                <div className="bg-linear-to-br from-cyan-600 to-cyan-700 rounded-xl p-4 text-white hover:shadow-lg transition-all transform hover:scale-105">
                  <p className="text-xs font-semibold opacity-90 uppercase tracking-wide">
                    {t("booking.children")}
                  </p>
                  <p className="text-3xl font-bold mt-2">
                    {quoteData.noOfChildren}
                  </p>
                </div>
                <div className="bg-linear-to-br from-purple-600 to-purple-700 rounded-xl p-4 text-white hover:shadow-lg transition-all transform hover:scale-105">
                  <p className="text-xs font-semibold opacity-90 uppercase tracking-wide">
                    {t("booking.infants")}
                  </p>
                  <p className="text-3xl font-bold mt-2">
                    {quoteData.noOfInfants}
                  </p>
                </div>
                <div className="bg-linear-to-br from-orange-600 to-orange-700 rounded-xl p-4 text-white hover:shadow-lg transition-all transform hover:scale-105">
                  <p className="text-xs font-semibold opacity-90 uppercase tracking-wide">
                    {t("booking.pets")}
                  </p>
                  <p className="text-3xl font-bold mt-2">
                    {quoteData.noOfPets}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method Selection */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-gray-100/50 relative">
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-linear-to-br from-amber-600 to-orange-600 rounded-lg">
                  <CreditCard className="h-5 w-5 text-white" />
                </div>
                <span className="bg-linear-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                  {t("confirm.paymentMethod")}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6 relative">
              {/* Payment Mode */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-4">
                  {t("confirm.selectPaymentOption")}
                </label>

                <Controller
                  name="paymentMode"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup
                      value={field.value}
                      onValueChange={field.onChange}
                      className="grid md:grid-cols-2 gap-4"
                    >
                      {/* Partial */}
                      <Label
                        htmlFor="partial"
                        className={`flex items-center gap-4 rounded-xl border-2 p-5 cursor-pointer transition-all transform hover:scale-102 ${
                          field.value === "partial"
                            ? "border-blue-500 bg-linear-to-br from-blue-50 to-cyan-50 shadow-lg"
                            : "border-gray-200 hover:border-blue-300 bg-white hover:shadow-md"
                        }`}
                      >
                        <RadioGroupItem
                          value="partial"
                          id="partial"
                          className="h-6 w-6"
                        />
                        <div className="flex-1">
                          <span className="block font-bold text-gray-900">
                            {t("confirm.deposit")}
                          </span>
                          <span className="block text-sm font-semibold text-blue-600 mt-1">
                            {quoteData.suggestedDeposit.toLocaleString("vi-VN")}{" "}
                            đ
                          </span>
                          <span className="block text-xs text-gray-500 mt-1">
                            (~
                            {Math.round(
                              (quoteData.suggestedDeposit /
                                quoteData.totalPrice) *
                                100,
                            )}
                            % of total)
                          </span>
                        </div>
                      </Label>

                      {/* Full */}
                      <Label
                        htmlFor="full"
                        className={`flex items-center gap-4 rounded-xl border-2 p-5 cursor-pointer transition-all transform hover:scale-102 ${
                          field.value === "full"
                            ? "border-green-500 bg-linear-to-br from-green-50 to-emerald-50 shadow-lg"
                            : "border-gray-200 hover:border-green-300 bg-white hover:shadow-md"
                        }`}
                      >
                        <RadioGroupItem
                          value="full"
                          id="full"
                          className="h-6 w-6"
                        />
                        <div className="flex-1">
                          <span className="block font-bold text-gray-900">
                            {t("confirm.full")}
                          </span>
                          <span className="block text-sm font-semibold text-green-600 mt-1">
                            {quoteData.totalPrice.toLocaleString("vi-VN")} đ
                          </span>
                          <span className="block text-xs text-gray-500 mt-1">
                            (100% of total)
                          </span>
                        </div>
                      </Label>
                    </RadioGroup>
                  )}
                />
              </div>

              {/* Payment Provider */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-4">
                  {t("confirm.paymentProvider")}
                </label>

                <Controller
                  name="paymentProvider"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup
                      value={field.value}
                      onValueChange={field.onChange}
                      className="space-y-3"
                    >
                      <Label
                        htmlFor="payos"
                        className={`flex items-center gap-4 rounded-xl border-2 p-5 cursor-pointer transition-all transform hover:scale-102 ${
                          field.value === "payos"
                            ? "border-blue-500 bg-linear-to-br from-blue-50 to-cyan-50 shadow-lg"
                            : "border-gray-200 hover:border-blue-300 bg-white hover:shadow-md"
                        }`}
                      >
                        <RadioGroupItem
                          value="payos"
                          id="payos"
                          className="h-6 w-6"
                        />
                        <div className="flex-1">
                          <span className="font-bold text-gray-900">PayOS</span>
                          <span className="block text-xs text-gray-500 mt-1">
                            Safe and secure payment processing with VietQR
                          </span>
                        </div>
                      </Label>
                      {/* Stripe */}
                      <Label
                        htmlFor="stripe"
                        className={`flex items-center gap-4 rounded-xl border-2 p-5 cursor-pointer transition-all transform hover:scale-102 ${
                          field.value === "stripe"
                            ? "border-purple-500 bg-linear-to-br from-purple-50 to-pink-50 shadow-lg"
                            : "border-gray-200 hover:border-purple-300 bg-white hover:shadow-md"
                        }`}
                      >
                        <RadioGroupItem
                          value="stripe"
                          id="stripe"
                          className="h-6 w-6"
                        />
                        <div className="flex-1">
                          <span className="font-bold text-gray-900">
                            Stripe
                          </span>
                          <span className="block text-xs text-gray-500 mt-1">
                            {t("confirm.creditCard")}
                          </span>
                        </div>
                      </Label>
                    </RadioGroup>
                  )}
                />

                {errors.paymentProvider && (
                  <p className="mt-3 text-sm text-red-600 font-medium">
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
          <div className="flex gap-4 pt-8 pb-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
              className="flex-1 h-12 rounded-xl border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 font-semibold transition-all"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t("confirm.back")}
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 h-12 rounded-xl bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {t("confirm.processing")}
                </>
              ) : (
                <>
                  <CreditCard className="h-4 w-4 mr-2" />
                  {t("confirm.confirmNPay")}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BookingConfirm;
