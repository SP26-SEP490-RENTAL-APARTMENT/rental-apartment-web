import { TENANT_ROUTES } from "@/constants/routes";
import type { Collection } from "@/types/collection";
import { Heart, Star, Check, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

function CollectionBox({
  collection,
  isSelected = false,
}: {
  collection: Collection;
  isSelected?: boolean;
}) {
  const navigate = useNavigate();

  return (
    <Card
      onClick={() =>
        navigate(
          TENANT_ROUTES.WISHLIST.replace(
            ":collectionId",
            collection.collectionId.toString(),
          ),
        )
      }
      className={`border-0 cursor-pointer transition-all duration-300 hover:shadow-lg overflow-hidden group ${
        isSelected
          ? "ring-2 ring-purple-500 shadow-lg"
          : "shadow-sm hover:shadow-md"
      }`}
    >
      <CardContent className="p-6 space-y-4">
        {/* Header with Icon and Badge */}
        <div className="flex items-start justify-between">
          <div
            className={`w-12 h-12 flex items-center justify-center rounded-xl transition-transform group-hover:scale-110 ${
              isSelected
                ? "bg-gradient-to-br from-purple-200 to-purple-300 text-purple-700"
                : "bg-gradient-to-br from-purple-100 to-purple-50 text-purple-500"
            }`}
          >
            <Heart size={24} />
          </div>

          {isSelected && (
            <div className="flex items-center justify-center w-7 h-7 rounded-full bg-purple-500 text-white shadow-md">
              <Check size={16} />
            </div>
          )}

          {collection?.isDefault && !isSelected && (
            <div className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 font-semibold">
              <Star size={12} className="fill-current" />
              Default
            </div>
          )}
        </div>

        {/* Title */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-purple-600 transition-colors">
            {collection.name}
          </h3>
          <p className="text-sm text-gray-500 line-clamp-2 mt-2">
            {collection.description || "No description yet"}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <span className="text-xs text-gray-400 font-medium">
            {new Date(collection.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
          <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-purple-600 transition-colors" />
        </div>
      </CardContent>
    </Card>
  );
}

export default CollectionBox;
