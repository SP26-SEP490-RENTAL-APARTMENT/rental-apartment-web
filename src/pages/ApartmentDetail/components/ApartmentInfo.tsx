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
  landlordName: string;
  address: string;
  district: string;
  price: number;
  maxOccupants: number;
  isPetAllowed: boolean;
}
function ApartmentInfo({
  description,
  landlordName,
  address,
  district,
  price,
  maxOccupants,
  isPetAllowed,
}: ApartmentInfoProps) {
  const { t } = useTranslation("book");

  return (
    <div className="bg-white rounded-2xl shadow-sm border p-6 space-y-8">
      {/* Host */}
      <div className="flex items-center gap-4 pb-6 border-b">
        <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
          {landlordName.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-sm text-gray-500">
            {t("apartment.hostedBy")}
          </p>
          <p className="text-lg font-semibold text-gray-900">
            {landlordName}
          </p>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-900">
          {t("apartment.description")}
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
              {t("apartment.location")}
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
              {t("apartment.pricePerNight")}
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
              {t("apartment.isPetAllowed")}
            </span>
          </div>

          <div className="flex items-center gap-2 font-medium">
            {isPetAllowed ? (
              <>
                <span className="text-green-600">
                  {t("apartment.allowPets")}
                </span>
                <CircleCheck className="text-green-600" size={18} />
              </>
            ) : (
              <>
                <span className="text-red-500">
                  {t("apartment.notAllowPets")}
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
              {t("apartment.maxOccupants")}
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
