import { amenityManagementApi } from "@/services/privateApi/adminApi";
import type { Amenity } from "@/types/amenity";
import { useEffect, useState } from "react";

export interface UseAmenityProps {
  page: number;
  pageSize: number;
  search: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
  enable?: boolean;
}

function useAmenity({
  page,
  pageSize,
  search,
  sortBy,
  sortOrder,
  enable,
}: UseAmenityProps) {
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const fetchAmenities = async () => {
    setLoading(true);
    try {
      const response = await amenityManagementApi.getAllAmenities({
        page,
        pageSize,
        search,
        sortBy,
        sortOrder,
      });

      const data = response.data.data.items;
      setAmenities(data);
      setTotal(response.data.data.totalCount);
    } catch (error) {
      console.error("Error fetching amenities:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!enable) return;
    fetchAmenities();
  }, [page, pageSize, search, sortBy, sortOrder, enable]);
  return {
    amenities,
    total,
    loading,
    refetch: fetchAmenities,
  };
}

export default useAmenity;
