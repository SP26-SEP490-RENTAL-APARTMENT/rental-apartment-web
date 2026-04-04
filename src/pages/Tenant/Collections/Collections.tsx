import { collectionsApi } from "@/services/privateApi/tenantApi";
import type { Collection } from "@/types/collection";
import { useCallback, useEffect, useState } from "react";
import CollectionBox from "./components/CollectionBox";
import CollectionSkeleton from "./components/CollectionSkeleton";

function Collections() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(false);
  // const [totalCount, setTotalCount] = useState(0);
  const [page] = useState(1);
  const [search] = useState("");
  const [sortBy] = useState("createdAt");
  const [sortOrder] = useState("desc");

  const fetchCollections = useCallback(async () => {
    setLoading(true);
    try {
      const response = await collectionsApi.getAllCollections({
        page,
        pageSize: 6,
        search,
        sortBy,
        sortOrder,
      });
      setCollections(response.data.data.items);
      // setTotalCount(response.data.data.totalCount);
    } catch (error) {
      console.error("Error fetching collections:", error);
    } finally {
      setLoading(false);
    }
  }, [page, search, sortBy, sortOrder]);

  useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

  return (
    <div>
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <CollectionSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {collections.map((c) => (
            <CollectionBox key={c.collectionId} collection={c} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Collections;
