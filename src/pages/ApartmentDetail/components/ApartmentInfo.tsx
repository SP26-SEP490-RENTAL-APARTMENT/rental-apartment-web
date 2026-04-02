import {
  CircleCheck,
  CircleX,
  HandCoins,
  MapPin,
  PawPrint,
  Users,
} from "lucide-react";
import { useTranslation } from "react-i18next";

interface ApartmentInfoProps {
  description: string;
  host: {
    name: string;
    avatarUrl: string;
  };
  address: string;
  district: string;
  price: number;
  maxOccupants: number;
  isPetAllowed: boolean;
}
function ApartmentInfo({
  description,
  host,
  address,
  district,
  price,
  maxOccupants,
  isPetAllowed,
}: ApartmentInfoProps) {
  const { t: apartmentTranslate } = useTranslation("apartment");

  return (
    <div className="bg-white rounded-2xl shadow-sm border p-6 space-y-8">
      {/* Host */}
      <div className="flex items-center gap-4 pb-6 border-b">
        <img
          className="w-16 h-16 rounded-full object-cover"
          src={host.avatarUrl}
          alt={host.name}
        />
        <div>
          <p className="text-sm text-gray-500">
            {apartmentTranslate("hostedBy")}
          </p>
          <p className="text-lg font-semibold text-gray-900">
            {host.name}
          </p>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-900">
          {apartmentTranslate("aboutThisPlace")}
        </h3>
        <p className="text-gray-600 leading-relaxed text-sm">
          {description}
        </p>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-2 gap-6">
        {/* Location */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-gray-500">
            <MapPin size={16} />
            <span className="text-sm">
              {apartmentTranslate("location")}
            </span>
          </div>
          <p className="font-semibold text-gray-900">
            {address}, {district}
          </p>
        </div>

        {/* Price */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-gray-500">
            <HandCoins size={16} />
            <span className="text-sm">
              {apartmentTranslate("pricePerNight")}
            </span>
          </div>
          <p className="text-xl font-bold text-blue-600">
            {price.toLocaleString("vi-VN")} ₫
          </p>
        </div>

        {/* Pet */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-gray-500">
            <PawPrint size={16} />
            <span className="text-sm">
              {apartmentTranslate("isPetAllowed")}
            </span>
          </div>

          <div className="flex items-center gap-2 font-medium">
            {isPetAllowed ? (
              <>
                <span className="text-green-600">
                  {apartmentTranslate("allowPets")}
                </span>
                <CircleCheck className="text-green-600" size={18} />
              </>
            ) : (
              <>
                <span className="text-red-500">
                  {apartmentTranslate("notAllowPets")}
                </span>
                <CircleX className="text-red-500" size={18} />
              </>
            )}
          </div>
        </div>

        {/* Occupants */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-gray-500">
            <Users size={16} />
            <span className="text-sm">
              {apartmentTranslate("maxOccupants")}
            </span>
          </div>
          <p className="text-lg font-semibold text-gray-900">
            {maxOccupants}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ApartmentInfo;
