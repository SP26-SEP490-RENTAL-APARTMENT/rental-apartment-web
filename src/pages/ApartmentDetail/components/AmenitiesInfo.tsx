import type { Amenity } from "@/types/amenity";
import {
  Building,
  Car,
  Dumbbell,
  Flame,
  HelpCircle,
  Tv,
  Utensils,
  WashingMachine,
  Waves,
  Wifi,
  Wind,
  WindArrowDownIcon,
} from "lucide-react";
import { useTranslation } from "react-i18next";

const amenityIconMap: Record<string, React.ReactNode> = {
  Gym: <Dumbbell size={20} />,
  "Phòng gym": <Dumbbell size={20} />,

  "Hồ bơi": <Waves size={20} />,
  Bếp: <Utensils size={20} />,

  "Máy giặt": <WashingMachine size={20} />,
  Tivi: <Tv size={20} />,
  WiFi: <Wifi size={20} />,

  "Chỗ đậu xe": <Car size={20} />,
  "Nước nóng": <Flame size={20} />,

  "Máy lạnh": <WindArrowDownIcon size={20} />,
  "Air conditioning": <Wind size={20} />,

  "Thang máy": <Building size={20} />,
  Elevator: <Building size={20} />,
};

function AmenitiesInfo({ amenities }: { amenities: Amenity[] }) {
  const { i18n } = useTranslation();
  const lang = i18n.language;

  return (
    <div className="bg-white rounded-2xl shadow-sm border p-6 space-y-6">

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {amenities.map((item) => {
          const label = lang === "en" ? item.nameEn : item.nameVi;

          const icon = amenityIconMap[item.nameEn] ||
            amenityIconMap[item.nameVi] || <HelpCircle size={20} />;

          return (
            <div
              key={item.amenityId}
              className="flex items-center gap-3 p-3 rounded-xl border hover:shadow-sm transition"
            >
              <div className="text-gray-600">{icon}</div>
              <span className="text-sm font-medium text-gray-800">{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
export default AmenitiesInfo;
