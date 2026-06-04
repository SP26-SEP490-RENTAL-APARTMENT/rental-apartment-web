import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Navigate, useNavigate } from "react-router-dom";
import { useBookingStore } from "@/store/bookingStore";
import { useTranslation } from "react-i18next";
import { CheckCircle, Calendar, Users, CreditCard, Home } from "lucide-react";

function FinishPayment() {
  const navigate = useNavigate();
  const { t } = useTranslation("book");
  const bookingData = useBookingStore((state) => state.bookingData);
  const clearBookingData = useBookingStore((state) => state.clearBookingData);

  const handleNavigate = (path: string) => {
    clearBookingData();
    navigate(path);
  };

  if (!bookingData) {
    return <Navigate to="/" replace />;
  }

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("vi-VN");

  const totalGuests = bookingData.noOfAdults + bookingData.noOfChildren;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-green-50 flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-2xl rounded-2xl shadow-lg border-0 py-0 overflow-hidden">
        <CardHeader className="bg-linear-to-r from-green-600 to-emerald-600 text-white">
          <div className="text-center py-8">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-white/20 rounded-full backdrop-blur-sm">
                <CheckCircle className="h-12 w-12 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold">
              {t("finish.title")}
            </CardTitle>
            <p className="text-green-100 mt-2 font-medium">
              {t("finish.subtitle")}
            </p>
          </div>
        </CardHeader>

        <CardContent className="pt-8 px-6 pb-8">
          {/* Booking Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Dates Card */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-5 border border-blue-200/60 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <Calendar className="h-4 w-4 text-white" />
                </div>
                <h3 className="font-bold text-gray-900">
                  {t("finish.bookDate")}
                </h3>
              </div>
              <div className="space-y-3">
                <div className="bg-white rounded-lg p-3 border border-blue-100/50">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Check-in
                  </p>
                  <p className="text-base font-bold text-blue-600 mt-1">
                    {formatDate(bookingData.checkInDateTime)}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-blue-100/50">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Check-out
                  </p>
                  <p className="text-base font-bold text-blue-600 mt-1">
                    {formatDate(bookingData.checkOutDateTime)}
                  </p>
                </div>
              </div>
            </div>

            {/* Guests Card */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 border border-purple-200/60 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-purple-600 rounded-lg">
                  <Users className="h-4 w-4 text-white" />
                </div>
                <h3 className="font-bold text-gray-900">
                  {t("finish.guestDetails")}
                </h3>
              </div>
              <div className="space-y-3">
                <div className="bg-white rounded-lg p-3 border border-purple-100/50">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    {t("finish.duration")}
                  </p>
                  <p className="text-base font-bold text-purple-600 mt-1">
                    {bookingData.nights} {t("booking.nights")}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-purple-100/50">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    {t("finish.guests")}
                  </p>
                  <p className="text-base font-bold text-purple-600 mt-1">
                    {totalGuests}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Info Card */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-5 border border-amber-200/60 shadow-sm hover:shadow-md transition-shadow mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-amber-600 rounded-lg">
                <CreditCard className="h-4 w-4 text-white" />
              </div>
              <h3 className="font-bold text-gray-900">
                {t("finish.paymentInfo")}
              </h3>
            </div>
            <div className="bg-white rounded-lg p-4 border border-amber-100/50">
              <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </p>
              <p className="text-lg font-bold text-amber-600 mt-2">
                {bookingData.paymentMode === "partial"
                  ? t("confirm.deposit")
                  : t("confirm.full")}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 pt-2">
            <Button
              onClick={() => handleNavigate("/tenant/booking-history")}
              className="w-full h-12 bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold gap-2 rounded-xl shadow-md hover:shadow-lg transition-all"
            >
              <Calendar className="h-4 w-4" />
              {t("finish.bookingHistory")}
            </Button>

            <Button
              variant="outline"
              onClick={() => handleNavigate("/")}
              className="w-full h-12 font-bold gap-2 rounded-xl border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all"
            >
              <Home className="h-4 w-4" />
              {t("finish.home")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default FinishPayment;
