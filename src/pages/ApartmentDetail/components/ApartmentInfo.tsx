import { getDisplayPrice } from "@/components/ui/apartmentCard/getPrice";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Apartment } from "@/types/apartment";
import {
  CircleCheck,
  CircleX,
  HandCoins,
  Info,
  MapPin,
  PawPrint,
  Users,
  Zap,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import PriceChangeInfo from "./PriceChangeInfo";

interface ApartmentInfoProps {
  apartment: Apartment;
}
function ApartmentInfo({ apartment }: ApartmentInfoProps) {
  const { t } = useTranslation("book");
  const hasDynamicPrice = apartment.priceChanges.length > 0;
  const { min, max } = getDisplayPrice(apartment);

  return (
    <div className="bg-white rounded-2xl shadow-sm border p-6 space-y-8">
      {/* Host */}
      <div className="flex items-center gap-4 pb-6 border-b">
        <div className="w-12 h-12 rounded-full bg-linear-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold">
          {apartment.landlordName.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-sm text-gray-500">{t("apartment.hostedBy")}</p>
          <p className="text-lg font-semibold text-gray-900">
            {apartment.landlordName}
          </p>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-900">
          {t("apartment.description")}
        </h3>
        <p className="text-gray-600 leading-relaxed text-sm">
          {apartment.description}
        </p>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-2 gap-6">
        {/* Location */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-gray-500">
            <MapPin size={16} />
            <span className="text-sm">{t("apartment.location")}</span>
          </div>
          <p className="font-semibold text-gray-900">
            {apartment.address}, {apartment.district}
          </p>
        </div>

        {/* Price */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-gray-500">
            <HandCoins size={16} />
            <span className="text-sm">{t("apartment.pricePerNight")}</span>
          </div>
          <div className="flex gap-2 items-center">
            <p className="text-xl font-bold text-blue-600">
              {apartment.basePricePerNight.toLocaleString("vi-VN")} ₫
            </p>
            {hasDynamicPrice && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info size={15} />
                  </TooltipTrigger>
                  <TooltipContent className="bg-white bg-linear-to-r from-gray-50 to-white text-gray-900 shadow-lg border">
                    {apartment.priceChanges.map((change) => (
                      <PriceChangeInfo priceChange={change} />
                    ))}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          {hasDynamicPrice && (
            <div className="flex gap-1 items-center">
              <Zap size={12} className="text-gray-400 fill-gray-400" />{" "}
              <p className="text-gray-400 text-sm">
                Price may vary by date {min.toLocaleString("vi-VN")} ~ {max.toLocaleString("vi-VN")} ₫
              </p>
            </div>
          )}
        </div>

        {/* Pet */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-gray-500">
            <PawPrint size={16} />
            <span className="text-sm">{t("apartment.isPetAllowed")}</span>
          </div>

          <div className="flex items-center gap-2 font-medium">
            {apartment.isPetAllowed ? (
              <>
                <span className="text-green-600">
                  {t("apartment.allowPets")}
                </span>
                <CircleCheck className="text-green-600" size={18} />
                <p className="text-lg font-semibold text-gray-900">
                  ({apartment.maxPets})
                </p>
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
            <span className="text-sm">{t("apartment.maxOccupants")}</span>
          </div>
          <p className="text-lg font-semibold text-gray-900">
            {apartment.maxOccupants}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ApartmentInfo;
