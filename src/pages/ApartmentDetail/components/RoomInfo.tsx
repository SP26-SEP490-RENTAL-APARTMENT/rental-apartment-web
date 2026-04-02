import type { Room } from "@/types/apartment";
import { Bath, Bed, CircleCheck, CircleX, Home, Ruler } from "lucide-react";
import { useTranslation } from "react-i18next";

function RoomInfo({ room }: { room: Room }) {
  const { t } = useTranslation("room");

  return (
    <div className="bg-white rounded-2xl shadow-sm border p-6 space-y-6">
      {/* Title */}
      <div className="pb-4 border-b">
        <h2 className="text-xl font-semibold text-gray-900">
          {room.title}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          {room.roomType} • {room.bedType}
        </p>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <h3 className="text-md font-semibold text-gray-900">
          {t("description")}
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          {room.description}
        </p>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-2 gap-6">
        {/* Size */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-gray-500">
            <Ruler size={16} />
            <span className="text-sm">{t("size")}</span>
          </div>
          <p className="font-semibold text-gray-900">
            {room.sizeSqm} m²
          </p>
        </div>

        {/* Bed Type */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-gray-500">
            <Bed size={16} />
            <span className="text-sm">{t("bedType")}</span>
          </div>
          <p className="font-semibold text-gray-900 capitalize">
            {room.bedType}
          </p>
        </div>

        {/* Room Type */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-gray-500">
            <Home size={16} />
            <span className="text-sm">{t("roomType")}</span>
          </div>
          <p className="font-semibold text-gray-900 capitalize">
            {room.roomType.replace("_", " ")}
          </p>
        </div>

        {/* Bathroom */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-gray-500">
            <Bath size={16} />
            <span className="text-sm">{t("bathroom")}</span>
          </div>

          <div className="flex items-center gap-2 font-medium">
            {room.isPrivateBathroom ? (
              <>
                <span className="text-green-600">
                  {t("privateBathroom")}
                </span>
                <CircleCheck className="text-green-600" size={18} />
              </>
            ) : (
              <>
                <span className="text-orange-500">
                  {t("sharedBathroom")}
                </span>
                <CircleX className="text-orange-500" size={18} />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-4 border-t text-xs text-gray-400">
        {t("createdAt")}:{" "}
        {new Date(room.createdAt).toLocaleDateString("vi-VN")}
      </div>
    </div>
  );
}

export default RoomInfo;