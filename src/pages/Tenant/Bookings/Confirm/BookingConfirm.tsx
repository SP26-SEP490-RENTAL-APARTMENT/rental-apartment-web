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

function BookingConfirm() {
  const { t } = useTranslation("book");
  const { i18n } = useTranslation();
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

  const getViDate = () => (i18n.language === "vi" ? "vi-VN" : "en-US");

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
                {t("confirm.title")}
              </h1>
              <p className="text-gray-600 mt-1">{t("confirm.description")}</p>
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
                  {t("confirm.detail.title")}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase">
                      {t("confirm.detail.checkIn")}
                    </p>
                    <p className="text-lg font-medium text-gray-900">
                      {new Date(quoteData.checkInDateTime).toLocaleDateString(
                        getViDate(),
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
                      {t("confirm.detail.checkOut")}
                    </p>
                    <p className="text-lg font-medium text-gray-900">
                      {new Date(quoteData.checkOutDateTime).toLocaleDateString(
                        getViDate(),
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
                        {t("confirm.detail.duration")}
                      </p>
                      <p className="text-lg font-medium text-gray-900">
                        {quoteData.nights} {t("booking.nights")}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase">
                        {t("confirm.detail.guests")}
                      </p>
                      <p className="text-lg font-medium text-gray-900">
                        {quoteData.noOfAdults +
                          quoteData.noOfInfants +
                          quoteData.noOfChildren}
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
                  {t("confirm.price.title")}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">
                      {t("confirm.price.nightlyRate")}
                    </span>
                    <span className="font-medium text-gray-900">
                      {quoteData.basePricePerNight.toLocaleString("vi-VN")} đ
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">
                      {t("confirm.price.baseAmount")} ({quoteData.nights}{" "}
                      {t("confirm.price.nights")})
                    </span>
                    <span className="font-medium text-gray-900">
                      {quoteData.baseAmount.toLocaleString("vi-VN")} đ
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">
                      {t("confirm.price.package")}
                    </span>
                    <span className="font-medium text-gray-900">
                      {quoteData.packageAmount.toLocaleString("vi-VN")} đ
                    </span>
                  </div>
                  <Separator className="my-3" />
                  <div className="flex justify-between items-center text-lg">
                    <span className="font-semibold text-gray-900">
                      {t("confirm.price.total")}
                    </span>
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
                {t("confirm.guestInfo")}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-xs font-semibold text-gray-500 uppercase">
                    {t("booking.adults")}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {quoteData.noOfAdults}
                  </p>
                </div>
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-xs font-semibold text-gray-500 uppercase">
                    {t("booking.children")}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {quoteData.noOfChildren}
                  </p>
                </div>
                <div className="bg-purple-50 rounded-lg p-3">
                  <p className="text-xs font-semibold text-gray-500 uppercase">
                    {t("booking.infants")}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {quoteData.noOfInfants}
                  </p>
                </div>
                <div className="bg-orange-50 rounded-lg p-3">
                  <p className="text-xs font-semibold text-gray-500 uppercase">
                    {t("booking.pets")}
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
                {t("confirm.paymentMethod")}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              {/* Payment Mode */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  {t("confirm.selectPaymentOption")}
                </label>

                <Controller
                  name="paymentMode"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup
                      value={field.value}
                      onValueChange={field.onChange}
                      className="grid md:grid-cols-2 gap-3"
                    >
                      {/* Partial */}
                      <Label
                        htmlFor="partial"
                        className={`flex items-center gap-3 rounded-lg border-2 p-4 cursor-pointer transition-all ${
                          field.value === "partial"
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-blue-400"
                        }`}
                      >
                        <RadioGroupItem value="partial" id="partial" />
                        <div className="flex-1">
                          <span className="block font-medium text-gray-900">
                            {t("confirm.deposit")}
                          </span>
                          <span className="block text-sm text-green-600">
                            {quoteData.suggestedDeposit.toLocaleString("vi-VN")}{" "}
                            đ
                          </span>
                        </div>
                      </Label>

                      {/* Full */}
                      <Label
                        htmlFor="full"
                        className={`flex items-center gap-3 rounded-lg border-2 p-4 cursor-pointer transition-all ${
                          field.value === "full"
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-blue-400"
                        }`}
                      >
                        <RadioGroupItem value="full" id="full" />
                        <div className="flex-1">
                          <span className="block font-medium text-gray-900">
                            {t("confirm.full")}
                          </span>
                          <span className="block text-sm text-green-600">
                            {quoteData.totalPrice.toLocaleString("vi-VN")} đ
                          </span>
                        </div>
                      </Label>
                    </RadioGroup>
                  )}
                />
              </div>

              {/* Payment Provider */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
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
                      {/* Stripe */}
                      <Label
                        htmlFor="stripe"
                        className={`flex items-center gap-3 rounded-lg border-2 p-4 cursor-pointer transition-all ${
                          field.value === "stripe"
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-blue-400"
                        }`}
                      >
                        <RadioGroupItem value="stripe" id="stripe" />
                        <div className="flex-1">
                          <span className="font-medium text-gray-900">
                            Stripe
                          </span>
                          <span className="ml-1 text-sm text-gray-500">
                            ({t("confirm.creditCard")})
                          </span>
                        </div>
                      </Label>

                      {/* Momo */}
                      <Label
                        htmlFor="momo"
                        className={`flex items-center gap-3 rounded-lg border-2 p-4 cursor-pointer transition-all ${
                          field.value === "momo"
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-blue-400"
                        }`}
                      >
                        <RadioGroupItem value="momo" id="momo" />
                        <div className="flex-1">
                          <span className="font-medium text-gray-900">
                            Momo
                          </span>
                          <span className="ml-1 text-sm text-gray-500">
                            ({t("confirm.momoWallet")})
                          </span>
                        </div>
                      </Label>
                    </RadioGroup>
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
              {t("confirm.back")}
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 h-11 bg-linear-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold"
            >
              {t("confirm.confirmNPay")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BookingConfirm;
