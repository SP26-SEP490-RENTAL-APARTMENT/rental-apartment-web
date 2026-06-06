import { Card, CardContent } from "@/components/ui/card";
import { PUBLIC_ROUTES } from "@/constants/routes";
import type { Apartment } from "@/types/apartment";
import { Heart, MapPin, PawPrint, Star, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "../button";
import { getDisplayPrice } from "./getPrice";

interface ApartmentCardProps {
  apartment: Apartment;
  onClickHeart: (apartmentId: string) => void;
}

function ApartmentCard({ apartment, onClickHeart }: ApartmentCardProps) {
  const navigate = useNavigate();
  const { t } = useTranslation("book");

  const { min, max } = getDisplayPrice(apartment);

  const thumbnail =
    apartment.photos?.find((url) => !url.includes("/video/upload/")) ||
    "/placeholder-image.jpg";

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
      className="border-0 shadow-none overflow-hidden cursor-pointer bg-transparent group"
    >
      {/* IMAGE */}
      <div className="relative aspect-4/3 overflow-hidden rounded-2xl">
        <img
          src={thumbnail}
          alt={apartment.title}
          className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
        />

        {/* FAVORITE */}
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onClickHeart(apartment.apartmentId);
          }}
          className="absolute top-3 right-3 bg-white/90 hover:bg-white rounded-full shadow-md"
        >
          <Heart
            size={18}
            className="text-gray-700 hover:fill-red-500 hover:text-red-500"
          />
        </Button>
      </div>

      {/* CONTENT */}
      <CardContent className="px-0 pt-3 pb-0">
        {/* TITLE + RATING */}
        <div className="flex justify-between gap-2">
          <h3 className="font-semibold line-clamp-1">{apartment.title}</h3>

          {apartment.totalReviews > 0 && (
            <div className="flex items-center gap-1 shrink-0 text-sm">
              <Star size={14} className="fill-black text-black" />
              <span>{apartment.averageRating.toFixed(1)}</span>
            </div>
          )}
        </div>

        {/* LOCATION */}
        <p className="text-sm text-gray-500 line-clamp-1 flex items-center gap-1">
          <MapPin size={14} />
          {apartment.district}, {apartment.city}
        </p>

        {/* GUEST */}
        <p className="text-sm text-gray-500 flex items-center gap-1">
          <Users size={14} />
          {t("apartment.upToGuests", { maxOccupants: apartment.maxOccupants })}
        </p>

        {/* PET */}
        {apartment.isPetAllowed && (
          <p className="text-sm text-gray-500 flex items-center gap-1">
            <PawPrint size={14} />
            {t("apartment.petFriendly")}
          </p>
        )}

        {/* PRICE */}
        <div className="mt-2 text-sm">
          <span className="font-bold text-black">
            {min === max
              ? min.toLocaleString("vi-VN")
              : `${min.toLocaleString("vi-VN")} - ${max.toLocaleString("vi-VN")}`}
            ₫
          </span>
          <span className="text-gray-500">
            {" "}
            {t("apartment.pricePerNightShort")}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

export default ApartmentCard;
