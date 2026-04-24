import { Card } from "@/components/ui/card";
import { PUBLIC_ROUTES } from "@/constants/routes";
import type { Apartment } from "@/types/apartment";
import { Heart, MapPin, PawPrint, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../button";
import { useState } from "react";

interface ApartmentCardProps {
  apartment: Apartment;
  onClickHeart: (apartmentId: string) => void;
}

function ApartmentCard({ apartment, onClickHeart }: ApartmentCardProps) {
  const navigate = useNavigate();
  const [isHeartHovered, setIsHeartHovered] = useState(false);

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
      className="group overflow-hidden rounded-xl border pt-0 border-gray-200 hover:border-gray-300 hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col h-full bg-white"
    >
      {/* IMAGE CONTAINER */}
      <div className="relative overflow-hidden bg-gray-200 h-64">
        <img
          src={apartment.photos[0]}
          alt={apartment.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* PRICE BADGE */}
        <div className="absolute top-3 left-3 bg-linear-to-r from-blue-600 to-blue-700 text-white px-3 py-1.5 rounded-lg shadow-md text-sm font-bold">
          {apartment.basePricePerNight.toLocaleString('vi-VN')} VNĐ/night
        </div>

        {/* HEART BUTTON */}
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onClickHeart(apartment.apartmentId);
          }}
          onMouseEnter={() => setIsHeartHovered(true)}
          onMouseLeave={() => setIsHeartHovered(false)}
          variant="ghost"
          size="icon"
          className={`absolute top-3 right-3 rounded-full transition-all duration-200 ${
            isHeartHovered
              ? "bg-white shadow-lg scale-110"
              : "bg-white/80 backdrop-blur"
          }`}
        >
          <Heart
            size={18}
            className={isHeartHovered ? "fill-red-500 text-red-500" : ""}
          />
        </Button>
      </div>

      {/* CONTENT */}
      <div className="p-4 flex flex-col grow space-y-3">
        {/* TITLE */}
        <div>
          <h3 className="font-bold text-lg text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
            {apartment.title}
          </h3>
        </div>

        {/* LOCATION */}
        <div className="flex items-center gap-1.5 text-sm text-gray-600">
          <MapPin size={16} className="text-blue-600 shrink-0" />
          <span className="line-clamp-1 text-xs">
            {apartment.district}, {apartment.city}
          </span>
        </div>

        {/* DESCRIPTION */}
        <p className="text-xs text-gray-500 line-clamp-2 grow">
          {apartment.description}
        </p>

        {/* AMENITIES */}
        <div className="flex items-center gap-2 text-xs text-gray-600 pt-1 border-t border-gray-100">
          <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 rounded">
            <Users size={14} className="text-gray-600" />
            <span>{apartment.maxOccupants} guests</span>
          </div>
          {apartment.isPetAllowed && (
            <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 rounded">
              <PawPrint size={14} className="text-gray-600" />
            </div>
          )}
        </div>
      </div>

      {/* FOOTER - BOOK NOW BUTTON */}
      {/* <div className="p-4 border-t border-gray-100">
        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold">
          View Details
        </Button>
      </div> */}
    </Card>
  );
}

export default ApartmentCard;
