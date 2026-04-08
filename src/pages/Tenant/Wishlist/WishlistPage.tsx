import { collectionsApi } from "@/services/privateApi/tenantApi";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import WishlistCardSkeleton from "./components/WishlistCardSkeleton";
import WishlistCard from "./components/WishlistCard";
import type { Wishlist } from "@/types/wishlist";

function WishlistPage() {
  const { collectionId } = useParams();
  const [wishlists, setWishlists] = useState<Wishlist[]>([]);
  const [page] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchWishlist = useCallback(async () => {
    if (!collectionId) return;
    setLoading(true);
    try {
      const response = await collectionsApi.getWishlists(collectionId, {
        page,
        pageSize: 6,
        sortBy: "createdAt",
        sortOrder: "desc",
        search: "",
      });
      const data = response.data.data
      localStorage.setItem("collectionName", data.items[0].collectionName);
      setWishlists(data.items);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [page, collectionId]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);
  return (
    <div>
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <WishlistCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {wishlists.map((item) => (
            <WishlistCard key={item.wishlistId} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

export default WishlistPage;
