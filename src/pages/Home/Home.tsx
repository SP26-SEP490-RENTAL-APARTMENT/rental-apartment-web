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

function Home() {
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedApartmentId, setSelectedApartmentId] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(6);
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
    <div className="">
      <div className="m-10">
        <HomeFilter
          search={search}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSearchChange={setSearch}
          onSortByChange={setSortBy}
          onSortOrderChange={setSortOrder}
        />
      </div>
      {/* delete later */}
      {addWishlistLoading}
      {collections && (
        <AddWishlistDialog
          isOpen={collectionDialogOpen}
          onClose={() => setCollectionDialogOpen(false)}
          collection={collections}
          onSelectCollection={handleSelectCollection}
          // isLoading={addWishlistLoading}
        />
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 m-10">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <ApartmentCardSkeleton key={i} />
            ))
          : apartments.map((a) => (
              <ApartmentCard
                key={a.apartmentId}
                apartment={a}
                onClickHeart={handleClickHeart}
              />
            ))}
      </div>
      <div className="m-10">
        <PaginationComponent
          onPageChange={setPage}
          page={page}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
}

export default Home;
