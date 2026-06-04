import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Users,
  Bed,
  Wifi,
  Car,
  Tv,
  WashingMachine,
} from "lucide-react";
import type { AlternativeApartment } from "@/types/apartment";
import { useNavigate } from "react-router-dom";
import { PUBLIC_ROUTES } from "@/constants/routes";

interface AlternativeApartmentCardProps {
  data: AlternativeApartment;
}

export default function AlternativeApartmentCard({
  data,
}: AlternativeApartmentCardProps) {
  const navigate = useNavigate();
  const getAmenityIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case "wifi":
        return <Wifi className="h-4 w-4" />;
      case "parking":
        return <Car className="h-4 w-4" />;
      case "tv":
        return <Tv className="h-4 w-4" />;
      case "washing machine":
        return <WashingMachine className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <Card
      onClick={() =>
        navigate(
          PUBLIC_ROUTES.APARTMENT_DETAIL.replace(
            ":id",
            data.apartment.apartmentId.toString(),
          ),
        )
      }
      className="overflow-hidden hover:shadow-lg transition-all pt-0 cursor-pointer"
    >
      <div className="relative">
        <img
          src={data.apartment.photos?.[0]}
          alt={data.apartment.title}
          className="h-56 w-full object-cover"
        />

        <Badge
          className={`absolute top-3 right-3 ${
            data.adjustmentType === "upgrade"
              ? "bg-green-600"
              : data.adjustmentType === "downgrade"
                ? "bg-orange-500"
                : "bg-blue-500"
          }`}
        >
          {data.adjustmentType === "upgrade"
            ? "Upgrade"
            : data.adjustmentType === "downgrade"
              ? "Downgrade"
              : "Same Level"}
        </Badge>
      </div>

      <CardContent className="space-y-4 pt-4">
        <div>
          <h3 className="font-semibold text-lg line-clamp-1">
            {data.apartment.title}
          </h3>

          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
            <MapPin className="h-4 w-4" />
            <span>{data.distanceKm} km away</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-xl font-bold">
              {data.estimatedTotalPrice.toLocaleString()} đ
            </p>
            <p
              className={`text-sm ${
                data.priceDifference < 0 ? "text-green-600" : "text-red-500"
              }`}
            >
              {data.priceDifference < 0 ? "-" : "+"}
              {Math.abs(data.priceDifference).toLocaleString()} đ
            </p>
          </div>

          <div className="flex gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {data.apartment.maxOccupants}
            </div>

            <div className="flex items-center gap-1">
              <Bed className="h-4 w-4" />
              {data.apartment.room?.bedType}
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-green-50 border border-green-200 p-3">
          {data.reasons.map((reason: string, index: number) => (
            <p key={index} className="text-sm text-green-700">
              ✓ {reason}
            </p>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {data.apartment.amenities?.slice(0, 4).map((item: any) => (
            <Badge key={item.amenityId} variant="secondary" className="gap-1">
              {getAmenityIcon(item.nameEn)}
              {item.nameEn}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
