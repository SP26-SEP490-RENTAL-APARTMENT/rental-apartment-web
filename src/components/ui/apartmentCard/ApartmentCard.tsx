import {
  Card
} from "@/components/ui/card";
import { PUBLIC_ROUTES } from "@/constants/routes";
import type { Apartment } from "@/types/apartment";
import { Heart, MapPin, PawPrint, UsersRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../button";

interface ApartmentCardProps {
  apartment: Apartment;
  onClickHeart: (apartmentId: string) => void;
}

function ApartmentCard({ apartment, onClickHeart }: ApartmentCardProps) {
  const navigate = useNavigate();

  return (
    <Card
      onClick={() =>
        navigate(
          PUBLIC_ROUTES.APARTMENT_DETAIL.replace(
            ":id",
            apartment.apartmentId.toString(),
          ),
        )
      }
      className="group overflow-hidden rounded-2xl border hover:shadow-xl transition-all duration-300 cursor-pointer pt-0"
    >
      {/* IMAGE */}
      <div className="relative">
        <img
          src={apartment.photos[0]}
          alt={apartment.title}
          className="w-full h-56 object-cover group-hover:scale-105 transition duration-300"
        />

        {/* HEART */}
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onClickHeart(apartment.apartmentId);
          }}
          variant="secondary"
          size="icon"
          className="absolute top-3 right-3 bg-white/80 backdrop-blur hover:bg-white shadow"
        >
          <Heart size={18} />
        </Button>

        {/* PRICE OVERLAY */}
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur px-3 py-1 rounded-lg shadow text-sm font-semibold">
          {apartment.basePricePerNight.toLocaleString("vi-VN")} đ / đêm
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-4 space-y-2">
        {/* TITLE */}
        <h3 className="font-semibold text-lg line-clamp-1">
          {apartment.title}
        </h3>

        {/* LOCATION */}
        <div className="flex items-center text-sm text-gray-500 gap-1">
          <MapPin size={14} />
          <span className="line-clamp-1">
            {apartment.district}, {apartment.city}
          </span>
        </div>

        {/* INFO */}
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <div className="flex gap-2 items-center">
            <UsersRound size={16} /> <p>{apartment.maxOccupants}</p>
          </div>
          {apartment.isPetAllowed && (
            <div className="flex items-center gap-2">
              <PawPrint size={16} /> <p>Pet</p>
            </div>
          )}
        </div>

        {/* DESCRIPTION */}
        <p className="text-sm text-gray-500 line-clamp-2">
          {apartment.description}
        </p>
      </div>
    </Card>
  );
}

export default ApartmentCard;
