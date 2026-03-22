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
  const { t: apartment } = useTranslation("apartment");
  return (
    <div className="space-y-8 px-6 py-8">
      <div className="flex items-center gap-4 pb-6 border-b">
        <img
          className="w-20 h-20 rounded-full object-cover ring-2 ring-gray-200"
          src={host.avatarUrl}
          alt={host.name}
        />
        <div>
          <p className="text-sm text-gray-500">{apartment("hostedBy")}</p>
          <p className="text-xl font-semibold text-gray-900">{host.name}</p>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-900">
          {apartment("aboutThisPlace")}
        </h3>
        <p className="text-gray-600 leading-relaxed">{description}</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-1">
          <div className="flex items-end gap-2">
            <p className="text-sm font-medium text-gray-500">
              <MapPin />
            </p>
            <p className="font-medium text-gray-500">{apartment("location")}</p>
          </div>

          <div className="flex gap-1">
            <p className="font-bold text-xl">{address},</p>
            <p className="font-bold text-xl">{district}</p>
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex items-end gap-2">
            <p className="text-sm font-medium text-gray-500">
              <HandCoins />
            </p>
            <p className="font-medium text-gray-500">
              {apartment("pricePerNight")}
            </p>
          </div>
          <p className="text-2xl font-bold text-blue-600">
            {price.toLocaleString("vi-VN")}
          </p>
        </div>
        <div className="space-y-1">
          <div className="flex items-end gap-2">
            <p className="text-sm font-medium text-gray-500">
              <PawPrint />
            </p>
            <p className="font-medium text-gray-500">
              {apartment("isPetAllowed")}
            </p>
          </div>
          <p className="font-bold">
            {isPetAllowed === true ? (
              <div className="flex items-end gap-2">
                <p className="text-xl">{apartment("allowPets")}</p>
                <p>
                  <CircleCheck />
                </p>
              </div>
            ) : (
              <div className="flex items-end gap-2">
                <p className="text-xl">{apartment("notAllowPets")}</p>
                <p>
                  <CircleX />
                </p>
              </div>
            )}
          </p>
        </div>
        <div className="space-y-1">
          <div className="flex items-end gap-2">
            <p className="text-sm font-medium text-gray-500">
              <Users />
            </p>
            <p className="font-medium text-gray-500">
              {apartment("maxOccupants")}
            </p>
          </div>
          <p className="font-bold text-xl">
            {maxOccupants}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ApartmentInfo;
