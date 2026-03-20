import { useEffect, useState } from "react";
import ApartmentCard from "../../components/ui/apartmentCard/ApartmentCard";
import type { Apartment } from "@/types/apartment";
import { apartmentApi } from "@/services/publicApi/apartmentApi";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import ApartmentCardSkeleton from "@/components/ui/apartmentCard/ApartmentCardSkeleton";

function Home() {
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(6);
  const [total, setTotal] = useState(0);
  const [search] = useState("");
  const [sortBy] = useState<keyof Apartment>("address");
  const [sortOrder] = useState<"asc" | "desc">("asc");
  const [loading, setLoading] = useState(false);

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
        setLoading(false)
      }
    };

    fetchApartments();
  }, [page, search, sortBy, sortOrder, pageSize]);

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 m-10">
        {loading
  ? Array.from({ length: 6 }).map((_, i) => (
      <ApartmentCardSkeleton key={i} />
    ))
  : apartments.map((a) => (
      <ApartmentCard key={a.apartmentId} apartment={a} />
    ))}
      </div>
      <Pagination>
        <PaginationContent>
          {/* Prev */}
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              className={page === 1 ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>

          {/* Page numbers */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <PaginationItem key={p}>
              <PaginationLink isActive={p === page} onClick={() => setPage(p)}>
                {p}
              </PaginationLink>
            </PaginationItem>
          ))}

          {/* Next */}
          <PaginationItem>
            <PaginationNext
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              className={
                page === totalPages ? "pointer-events-none opacity-50" : ""
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

export default Home;
