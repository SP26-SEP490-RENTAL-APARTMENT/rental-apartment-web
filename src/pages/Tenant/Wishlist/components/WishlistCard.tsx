import { PUBLIC_ROUTES } from "@/constants/routes";
import type { Wishlist } from "@/types/wishlist";
import { Heart, MapPin, Calendar, NotebookText } from "lucide-react";
import { useNavigate } from "react-router-dom";

type Props = {
  item: Wishlist;
};

function WishlistCard({ item }: Props) {
  const navigate = useNavigate();

  const apartment = item.apartmentDetails;

  return (
    <div
      onClick={() =>
        navigate(
          PUBLIC_ROUTES.APARTMENT_DETAIL.replace(
            ":id",
            item.apartmentId.toString(),
          ),
        )
      }
      className="border rounded-2xl p-4 bg-white shadow-sm hover:shadow-md transition cursor-pointer space-y-3"
    >
      {/* Header */}
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold line-clamp-1">
          {apartment.title}
        </h3>

        {item.isFavorite && (
          <Heart className="text-red-500 fill-red-500" size={18} />
        )}
      </div>

      <div className="text-pink-600 font-semibold">
        {apartment.basePricePerNight.toLocaleString("vi-VN")}đ / đêm
      </div>

      <div className="flex items-center gap-1 text-sm text-gray-500">
        <MapPin size={14} />
        <span>
          {apartment.district}, {apartment.city}
        </span>
      </div>

      {item.notes && (
        <p className="text-sm text-gray-600 line-clamp-2 flex gap-1 items-center">
          <NotebookText size={14} /> {item.notes}
        </p>
      )}

      <div className="flex justify-between items-center text-xs text-gray-400">
        <div className="flex items-center gap-1">
          <Calendar size={12} />
          {new Date(item.addedAt).toLocaleDateString("vi-VN")}
        </div>

        {/* Collection name */}
        <span className="bg-gray-100 px-2 py-1 rounded-full">
          {item.collectionName}
        </span>
      </div>
    </div>
  );
}

export default WishlistCard;
