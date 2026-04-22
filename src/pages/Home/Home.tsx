import { useEffect, useState } from "react";
import ApartmentCard from "../../components/ui/apartmentCard/ApartmentCard";
import type { Apartment } from "@/types/apartment";
import { apartmentApi } from "@/services/publicApi/apartmentApi";
import ApartmentCardSkeleton from "@/components/ui/apartmentCard/ApartmentCardSkeleton";
import HomeFilter from "./components/HomeFilter";
import type { Collection } from "@/types/collection";
import { collectionsApi } from "@/services/privateApi/tenantApi";
import AddWishlistDialog from "./components/AddWishlistDialog";
import { toast } from "sonner";
import PaginationComponent from "@/components/ui/paginationComponent/PaginationComponent";
import { Home } from "lucide-react";
import HeroSection from "./components/HeroSection";
import { useTranslation } from "react-i18next";

function HomePage() {
  const {t} = useTranslation("common");
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedApartmentId, setSelectedApartmentId] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(12);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<keyof Apartment>("basePricePerNight");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [loading, setLoading] = useState(false);
  const [collectionDialogOpen, setCollectionDialogOpen] = useState(false);
  const [addWishlistLoading, setAddWishlistLoading] = useState(false);

  useEffect(() => {
    const fetchApartments = async () => {
      setLoading(true);
      try {
        const response = await apartmentApi.getApartments({
          page,
          pageSize,
          search,
          sortBy,
          sortOrder,
        });
        setApartments(response.data.items);
        setTotal(response.data.totalCount);
      } catch (error) {
        console.error("Error fetching apartments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApartments();
  }, [page, search, sortBy, sortOrder, pageSize]);

  const fetchCollections = async () => {
    try {
      const response = await collectionsApi.getAllCollections({
        page: 1,
        pageSize: 10,
        search: "",
        sortBy: "createdAt",
        sortOrder: "desc",
      });
      setCollections(response.data.data.items);
    } catch (error) {
      console.log(error);
    }
  };

  const handleClickHeart = async (apartmentId: string) => {
    setSelectedApartmentId(apartmentId);
    setCollectionDialogOpen(true);
    fetchCollections();
  };

  const handleSelectCollection = async (collectionId: string) => {
    if (!selectedApartmentId) return;

    setAddWishlistLoading(true);
    try {
      await collectionsApi.addWishlistToCollection({
        collectionId,
        apartmentId: selectedApartmentId,
        note: "",
      });
      toast.success("Added to collection successfully");
      setCollectionDialogOpen(false);
      setSelectedApartmentId("");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to add to collection",
      );
      console.error("Error adding to collection:", error);
    } finally {
      setAddWishlistLoading(false);
    }
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="min-h-screen bg-gray-50">
      <HeroSection />
      {/* Search & Filter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10 mb-12">
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
          <HomeFilter
            search={search}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSearchChange={setSearch}
            onSortByChange={setSortBy}
            onSortOrderChange={setSortOrder}
          />
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {addWishlistLoading}
        {collections && (
          <AddWishlistDialog
            isOpen={collectionDialogOpen}
            onClose={() => setCollectionDialogOpen(false)}
            collection={collections}
            onSelectCollection={handleSelectCollection}
          />
        )}

        {/* Results Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {t("description.availableApartments")} ({total})
            </h2>
          </div>
        </div>

        {/* Apartment Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {loading ? (
            Array.from({ length: 12 }).map((_, i) => (
              <ApartmentCardSkeleton key={i} />
            ))
          ) : apartments.length > 0 ? (
            apartments.map((a) => (
              <ApartmentCard
                key={a.apartmentId}
                apartment={a}
                onClickHeart={handleClickHeart}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <Home className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No apartments found</p>
              <p className="text-gray-400 text-sm">
                Try adjusting your search criteria
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mb-16">
            <PaginationComponent
              onPageChange={setPage}
              page={page}
              totalPages={totalPages}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage;
