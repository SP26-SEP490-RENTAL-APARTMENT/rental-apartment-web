import { collectionsApi } from "@/services/privateApi/tenantApi";
import type { Collection } from "@/types/collection";
import { useCallback, useEffect, useState } from "react";
import CollectionBox from "./components/CollectionBox";

function Collections() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
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
      setTotalCount(response.data.data.totalCount);
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {collections.map((item) => (
        <CollectionBox key={item.collectionId} collection={item} />
      ))}
      {totalCount}
      {loading}
    </div>
  );
}

export default Collections;
