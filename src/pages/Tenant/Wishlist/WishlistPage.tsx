import { collectionsApi } from "@/services/privateApi/tenantApi";
import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import WishlistCardSkeleton from "./components/WishlistCardSkeleton";
import WishlistCard from "./components/WishlistCard";
import type { Wishlist } from "@/types/wishlist";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

function WishlistPage() {
  const { collectionId } = useParams();
  const navigate = useNavigate();
  const [wishlists, setWishlists] = useState<Wishlist[]>([]);
  const [page] = useState(1);
  const [loading, setLoading] = useState(false);
  const [collectionName, setCollectionName] = useState<string>("");

  const fetchWishlist = useCallback(async () => {
    if (!collectionId) return;
    setLoading(true);
    try {
      const response = await collectionsApi.getWishlists(collectionId, {
        page,
        pageSize: 12,
        sortBy: "createdAt",
        sortOrder: "desc",
        search: "",
      });
      const data = response.data.data;
      setCollectionName(data.items[0]?.collectionName || "");
      localStorage.setItem(
        "collectionName",
        data.items[0]?.collectionName || "",
      );
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="hover:bg-gray-100"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-red-100 rounded-lg">
                <Heart className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {collectionName || "My Wishlist"}
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  {wishlists.length}{" "}
                  {wishlists.length === 1 ? "apartment" : "apartments"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <WishlistCardSkeleton key={i} />
            ))}
          </div>
        ) : wishlists.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlists.map((item) => (
              <WishlistCard key={item.wishlistId} item={item} />
            ))}
          </div>
        ) : (
          /* Empty State */
          <Card className="border-0 shadow-sm bg-white">
            <CardContent className="py-16 text-center">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-red-50 rounded-full">
                  <Heart className="h-8 w-8 text-red-600" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                This collection is empty
              </h2>
              <p className="text-gray-600 mb-6">
                Start adding apartments to your wishlist to keep track of your
                favorite stays.
              </p>
              <a
                href="/"
                className="inline-block px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg transition-all duration-200"
              >
                Browse Apartments
              </a>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default WishlistPage;
