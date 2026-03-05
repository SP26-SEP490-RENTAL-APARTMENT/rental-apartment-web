import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MapPin, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ApartmentCardProps {
  image: string;
  name: string;
  location: string;
  description: string;
  rate: number;
  price: number;
}

function ApartmentCard({
  image,
  name,
  location,
  description,
  rate,
  price,
}: ApartmentCardProps) {
  const navigate = useNavigate();
  return (
    <Card
      onClick={() => navigate("/apartment-detail")}
      className="overflow-hidden hover:shadow-xl transition duration-300 pt-0 cursor-pointer"
    >
      <img src={image} alt={name} className="w-full h-52 object-cover" />

      <CardHeader>
        <CardTitle className="text-lg">{name}</CardTitle>
        <CardDescription className="flex gap-2 items-center">
          <span>
            <MapPin size={15} />
          </span>
          <span>{location}</span>
        </CardDescription>
      </CardHeader>

      <CardContent className="border-b pb-2">
        <p className="text-sm text-gray-600 line-clamp-2">{description}</p>

        <div className="flex items-center mt-2">
          <Star className="text-yellow-500 fill-yellow-500" />
          <span className="text-2xl ml-2 font-bold">{rate}</span>
        </div>
      </CardContent>

      <CardFooter className="font-semibold text-primary text-lg flex justify-end gap-2">
        <span className="text-blue-500 text-2xl">$ {price}</span>
        <span>/night</span>
      </CardFooter>
    </Card>
  );
}

export default ApartmentCard;
