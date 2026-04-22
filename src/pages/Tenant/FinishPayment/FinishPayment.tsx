import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useBookingStore } from "@/store/bookingStore";
import { useTranslation } from "react-i18next";
import { CheckCircle, Calendar, Users, CreditCard, Home } from "lucide-react";

function FinishPayment() {
  const navigate = useNavigate();
  const { t } = useTranslation("tenant");
  const bookingData = useBookingStore((state) => state.bookingData);
  const clearBookingData = useBookingStore((state) => state.clearBookingData);

  const handleNavigate = (path: string) => {
    clearBookingData();
    navigate(path);
  };

  if (!bookingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        {t("finishPayment.notFound")}
      </div>
    );
  }

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("vi-VN");

  const totalGuests =
    bookingData.noOfAdults + bookingData.noOfInfants + bookingData.noOfPets;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-2xl rounded-xl shadow-sm border-0">
        <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-xl">
          <div className="text-center py-6">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-green-500 bg-opacity-30 rounded-full">
                <CheckCircle className="h-12 w-12 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold">
              {t("finishPayment.title")}
            </CardTitle>
            <p className="text-green-100 mt-2">{t("finishPayment.subtitle")}</p>
          </div>
        </CardHeader>

        <CardContent className="pt-8 px-6 pb-6">
          {/* Booking Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Dates Card */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900">Booking Dates</h3>
              </div>
              <div className="space-y-2">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">
                    Check-in
                  </p>
                  <p className="text-lg font-medium text-gray-900">
                    {formatDate(bookingData.checkInDateTime)}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">
                    Check-out
                  </p>
                  <p className="text-lg font-medium text-gray-900">
                    {formatDate(bookingData.checkOutDateTime)}
                  </p>
                </div>
              </div>
            </div>

            {/* Guests Card */}
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <div className="flex items-center gap-2 mb-3">
                <Users className="h-5 w-5 text-purple-600" />
                <h3 className="font-semibold text-gray-900">Guest Details</h3>
              </div>
              <div className="space-y-2">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">
                    Duration
                  </p>
                  <p className="text-lg font-medium text-gray-900">
                    {bookingData.nights} {t("booking.nightsUnit")}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">
                    Guests
                  </p>
                  <p className="text-lg font-medium text-gray-900">
                    {totalGuests} {totalGuests > 1 ? "people" : "person"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Info Card */}
          <Card className="bg-amber-50 border-amber-200 mb-8">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-3">
                <CreditCard className="h-5 w-5 text-amber-600" />
                <h3 className="font-semibold text-gray-900">Payment Mode</h3>
              </div>
              <p className="text-lg font-medium text-amber-900">
                {bookingData.paymentMode === "partial"
                  ? t("finishPayment.depositMode")
                  : t("finishPayment.fullMode")}
              </p>
            </CardContent>
          </Card>

          {/* Divider */}
          <div className="border-t border-gray-200 my-6" />

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <Button
              onClick={() => handleNavigate("/tenant/booking-history")}
              className="w-full h-11 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold gap-2"
            >
              <Calendar className="h-4 w-4" />
              {t("finishPayment.viewBookings")}
            </Button>

            <Button
              variant="outline"
              onClick={() => handleNavigate("/")}
              className="w-full h-11 font-semibold gap-2"
            >
              <Home className="h-4 w-4" />
              {t("finishPayment.backHome")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default FinishPayment;
