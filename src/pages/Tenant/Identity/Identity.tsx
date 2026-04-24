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
import { Shield, Plus } from "lucide-react";

function Identity() {
  const { t: userT } = useTranslation("user");
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
        pageSize: 8,
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
      toast.success('ok');
      setIsFormOpen(false);
      // Refresh the list
      fetchIdentities();
    } catch (error) {
      console.error("Create identity error:", error);
      toast.error('no');
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalPages = Math.ceil(totalCount / 8);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {userT("identityVerification.label")}
                </h1>
                <p className="text-gray-600 mt-1">
                  {userT("identityVerification.description")}
                </p>
              </div>
            </div>
            <Button
              onClick={() => setIsFormOpen(true)}
              className="bg-linear-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold gap-2"
            >
              <Plus className="h-4 w-4" />
              {userT("identityVerification.upload")}
            </Button>
          </div>
        </div>
      </div>

      {/* Form Modal */}
      <IdentityForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleCreateIdentity}
        isLoading={isSubmitting}
      />

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {identities.length > 0 || loading ? (
          <>
            {/* Documents Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {loading
                ? Array.from({ length: 8 }).map((_, i) => (
                    <IdentitySkeleton key={i} />
                  ))
                : identities.map((doc) => (
                    <IdentityCard key={doc.documentId} document={doc} />
                  ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center">
                <PaginationComponent
                  onPageChange={setPage}
                  page={page}
                  totalPages={totalPages}
                />
              </div>
            )}
          </>
        ) : (
          /* Empty State */
          <div className="w-full h-full text-gray-400">No documents found</div>
        )}
      </div>
    </div>
  );
}

export default Identity;
