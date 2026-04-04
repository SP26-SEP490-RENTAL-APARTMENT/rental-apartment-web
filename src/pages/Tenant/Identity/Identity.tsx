import { indentityApi } from "@/services/privateApi/tenantApi";
import type { Document } from "@/types/document";
import { useCallback, useEffect, useState } from "react";
import IdentityCard from "./components/IdentityCard";

function Identity() {
  const [identities, setIdentities] = useState<Document[]>([]);
  const [page] = useState(1);
  const [loading, setLoading] = useState(false);
  const [search] = useState("");
  const [sortBy] = useState("");
  const [sortOrder] = useState("");
  const [totalCount, setTotalCount] = useState(0);

  const fetchIdentities = useCallback(async () => {
    setLoading(true);
    try {
      const response = await indentityApi.getMyIdentity({
        page,
        pageSize: 10,
        search,
        sortBy,
        sortOrder,
      });
      const data = response.data.data;
      setIdentities(data.items);
      setTotalCount(data.totalCount);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [page, search, sortBy, sortOrder]);

  useEffect(() => {
    fetchIdentities();
  }, [fetchIdentities]);
  return (
    <div className="p-10">
      {identities.map((identity) => (
        <IdentityCard key={identity.documentId} document={identity} />
      ))}
      {totalCount}
      {loading}
    </div>
  );
}

export default Identity;
