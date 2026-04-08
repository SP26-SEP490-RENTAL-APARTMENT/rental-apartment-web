import { Outlet, useParams } from "react-router-dom";
import CollectionBreadScrumb from "./CollectionBreadScrumb";
import { useEffect, useState } from "react";
import { collectionsApi } from "@/services/privateApi/tenantApi";

function CollectionLayout() {
  const { collectionId } = useParams();
  const [collectionName, setCollectionName] = useState<string>('');

  useEffect(() => {
    const fetchCollectionName = async () => {
      if (!collectionId) {
        setCollectionName('');
        return;
      }

      try {
        const res = await collectionsApi.getWishlists(collectionId, {
          page: 1,
          pageSize: 20,
          sortBy: "createdAt",
          sortOrder: "desc",
          search: "",
        });
        const data = res.data.data;
        setCollectionName(data.items[0].collectionName);
      } catch (err) {
        console.log(err);
      }
    };

    fetchCollectionName();
  }, [collectionId]);

  return (
    <div className="space-y-4 p-10">
      {/* luôn có "Collections", chỉ thêm name khi có id */}
      <CollectionBreadScrumb collectionName={collectionName} />

      <Outlet />
    </div>
  );
}

export default CollectionLayout;
