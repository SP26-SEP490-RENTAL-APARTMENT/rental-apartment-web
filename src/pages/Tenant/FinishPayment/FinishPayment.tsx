import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ROUTES } from "@/constants/routes";
import { formatDate } from "@/lib/utils";
import { CheckCircle } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function FinishPayment() {
  const navigate = useNavigate();

  const [data] = useState(() => {
    const stored = sessionStorage.getItem("payment_info");
    if (stored) {
      const parsed = JSON.parse(stored);

      // clear data
      sessionStorage.removeItem("payment_info");

      return parsed;
    }
    return null;
  });
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-lg shadow-xl rounded-2xl">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex flex-col items-center text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mb-3" />
            <h2 className="text-2xl font-semibold text-gray-900">
              Payment Successful 🎉
            </h2>
            <p className="text-gray-600 mt-1">
              Your booking has been confirmed.
            </p>
          </div>

          {/* Info */}
          <div className="mt-6 space-y-4">
            {/* Date */}
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Check-in</span>
              <span className="font-medium">
                {formatDate(data.checkInDate)}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Check-out</span>
              <span className="font-medium">
                {formatDate(data.checkOutDate)}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Nights</span>
              <span className="font-medium">{data.nights}</span>
            </div>

            {/* Guests */}
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Guests</span>
              <span className="font-medium">
                {data.noOfAdults} adults
                {data.noOfInfants > 0 && `, ${data.noOfInfants} infants`}
                {data.noOfPets > 0 && `, ${data.noOfPets} pets`}
              </span>
            </div>

            {/* Payment */}
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Payment Mode</span>
              <Badge variant="secondary">
                {data.paymentMode === "partial" ? "Deposit" : "Full"}
              </Badge>
            </div>

            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Provider</span>
              <Badge variant="outline">{data.paymentProvider}</Badge>
            </div>

            {/* Divider */}
            <div className="border-t pt-4 flex justify-between text-sm">
              <span className="text-gray-500">Apartment ID</span>
              <span className="font-medium">{data.apartmentId}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <Button
              className="w-full"
              onClick={() => navigate(ROUTES.TENANT_BOOKING_HISTORY)}
            >
              View Booking
            </Button>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate(ROUTES.HOME)}
            >
              Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default FinishPayment;
