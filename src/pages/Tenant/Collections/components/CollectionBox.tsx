import type { Collection } from "@/types/collection";
import { Heart, Star } from "lucide-react";

function CollectionBox({ collection }: { collection: Collection }) {
  return (
    <div className="border rounded-2xl p-5 bg-white shadow-sm hover:shadow-md transition cursor-pointer relative">
      {/* Default badge */}
      {collection.isDefault && (
        <span className="absolute top-3 right-3 flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-600">
          <Star size={12} />
          Default
        </span>
      )}

      {/* Icon */}
      <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-pink-100 text-pink-500 mb-4">
        <Heart size={20} />
      </div>

      {/* Content */}
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
          {collection.name}
        </h3>
        <p className="text-sm text-gray-500 line-clamp-2">
          {collection.description}
        </p>
      </div>

      {/* Footer */}
      <div className="mt-4 text-xs text-gray-400">
        {new Date(collection.createdAt).toLocaleDateString("vi-VN")}
      </div>
    </div>
  );
}

export default CollectionBox;
