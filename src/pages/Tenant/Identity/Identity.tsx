import { indentityApi } from "@/services/privateApi/tenantApi";
import type { Document } from "@/types/document";
import { useCallback, useEffect, useState } from "react";
import IdentityCard from "./components/IdentityCard";
import IdentitySkeleton from "./components/IdentitySkeleton";
import IdentityForm from "./components/IdentityForm";
import PaginationComponent from "@/components/ui/paginationComponent/PaginationComponent";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import type { CreateIdentityFormData } from "@/schemas/identitySchema";

function Identity() {
  const { t: identityT } = useTranslation("identity");
  const [identities, setIdentities] = useState<Document[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [search] = useState("");
  const [sortBy] = useState("");
  const [sortOrder] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchIdentities = useCallback(async () => {
    setLoading(true);
    try {
      const response = await indentityApi.getMyIdentity({
        page,
        pageSize: 4,
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

  const handleCreateIdentity = async (data: CreateIdentityFormData) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("DocumentType", data.DocumentType);
      formData.append("Side", data.Side);
      formData.append("Files", data.Files[0]);
      if (data.Notes) {
        formData.append("Notes", data.Notes);
      }

      await indentityApi.createIdentity(formData);
      toast.success(identityT("createSuccess"));
      setIsFormOpen(false);
      // Refresh the list
      fetchIdentities();
    } catch (error) {
      console.error("Create identity error:", error);
      toast.error(identityT("createError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalPages = Math.ceil(totalCount / 4);
  return (
    <div className="p-10">
      <div className="flex justify-end">
        <Button onClick={() => setIsFormOpen(true)}>
          {identityT("createIdentity")}
        </Button>
      </div>
      <IdentityForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleCreateIdentity}
        isLoading={isSubmitting}
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-10 mt-10">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <IdentitySkeleton key={i} />
            ))
          : identities.map((doc) => (
              <IdentityCard key={doc.documentId} document={doc} />
            ))}
      </div>

      <div>
        <PaginationComponent
          onPageChange={setPage}
          page={page}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
}

export default Identity;
