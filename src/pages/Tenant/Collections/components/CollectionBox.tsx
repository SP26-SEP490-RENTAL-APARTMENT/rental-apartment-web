import { TENANT_ROUTES } from "@/constants/routes";
import type { Collection } from "@/types/collection";
import { Heart, Star, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

function CollectionBox({
  collection,
  isSelected = false,
}: {
  collection: Collection;
  isSelected?: boolean;
}) {
  const navigate = useNavigate()
  return (
    <div
    onClick={() =>
            navigate(
              TENANT_ROUTES.WISHLIST.replace(
                ":collectionId",
                collection.collectionId.toString(),
              ),
            )}
      className={`border-2 rounded-2xl p-5 bg-white shadow-sm hover:shadow-md transition cursor-pointer relative ${
        isSelected ? "border-pink-500 bg-pink-50" : "border-gray-200"
      }`}
    >
      {isSelected && (
        <div className="absolute top-3 right-3 flex items-center justify-center w-6 h-6 rounded-full bg-pink-500 text-white">
          <Check size={16} />
        </div>
      )}

      {collection?.isDefault && !isSelected && (
        <span className="absolute top-3 right-3 flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-600">
          <Star size={12} />
          Default
        </span>
      )}

      <div
        className={`w-10 h-10 flex items-center justify-center rounded-xl mb-4 ${
          isSelected ? "bg-pink-200 text-pink-600" : "bg-pink-100 text-pink-500"
        }`}
      >
        <Heart size={20} />
      </div>

      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
          {collection.name}
        </h3>
        <p className="text-sm text-gray-500 line-clamp-2">
          {collection.description}
        </p>
      </div>

      <div className="mt-4 text-xs text-gray-400">
        {new Date(collection.createdAt).toLocaleDateString("vi-VN")}
      </div>
    </div>
  );
}

export default CollectionBox;
