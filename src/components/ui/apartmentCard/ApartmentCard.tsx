import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PUBLIC_ROUTES } from "@/constants/routes";
import type { Apartment } from "@/types/apartment";
import { Heart, MapPin, Star } from "lucide-react";
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
      className="overflow-hidden hover:shadow-xl transition duration-300 pt-0 cursor-pointer"
    >
      <div className="relative">
        <img
          src={apartment.photos[0]}
          alt={apartment.title}
          className="w-full h-52 object-cover"
        />
        <Button
          onClick={(e) => {
            e.stopPropagation(); // tránh trigger navigate
            onClickHeart(apartment.apartmentId);
          }}
          variant="secondary"
          className="absolute top-2 right-2 hover:bg-white p-2 shadow"
        >
          <Heart />
        </Button>
      </div>

      <CardHeader>
        <CardTitle className="text-lg">{apartment.title}</CardTitle>
        <CardDescription className="flex gap-2 items-center">
          <span>
            <MapPin size={15} />
          </span>
          <span>{apartment.address}</span>
        </CardDescription>
      </CardHeader>

      <CardContent className="border-b pb-2">
        <p className="text-sm text-gray-600 line-clamp-2">
          {apartment.description}
        </p>

        <div className="flex items-center mt-2">
          <Star className="text-yellow-500 fill-yellow-500" />
          <span className="text-2xl ml-2 font-bold">0</span>
        </div>
      </CardContent>

      <CardFooter className="font-semibold text-primary text-lg flex justify-end gap-2">
        <span className="text-blue-500 text-2xl">
          {apartment.basePricePerNight.toLocaleString("vi-VN")} đ
        </span>
        <span>/night</span>
      </CardFooter>
    </Card>
  );
}

export default ApartmentCard;
