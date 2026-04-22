import { collectionsApi } from "@/services/privateApi/tenantApi";
import type { Collection } from "@/types/collection";
import { useCallback, useEffect, useState } from "react";
import CollectionBox from "./components/CollectionBox";
import CollectionSkeleton from "./components/CollectionSkeleton";
import { Card, CardContent } from "@/components/ui/card";
import { FolderPlus, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";

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
        pageSize: 12,
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Bookmark className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Collections
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  {collections.length}{" "}
                  {collections.length === 1 ? "collection" : "collections"}
                </p>
              </div>
            </div>
            <Button className="bg-linear-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold gap-2">
              <FolderPlus className="h-4 w-4" />
              New Collection
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <CollectionSkeleton key={i} />
            ))}
          </div>
        ) : collections.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections.map((c) => (
              <CollectionBox key={c.collectionId} collection={c} />
            ))}
          </div>
        ) : (
          /* Empty State */
          <Card className="border-0 shadow-sm bg-white">
            <CardContent className="py-16 text-center">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-purple-50 rounded-full">
                  <Bookmark className="h-8 w-8 text-purple-600" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                No collections yet
              </h2>
              <p className="text-gray-600 mb-6">
                Create your first collection to organize and save your favorite
                apartments.
              </p>
              <Button className="bg-linear-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold gap-2">
                <FolderPlus className="h-4 w-4" />
                Create Collection
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default Collections;
