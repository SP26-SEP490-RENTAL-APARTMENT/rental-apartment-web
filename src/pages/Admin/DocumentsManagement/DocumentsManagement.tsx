import DataTable from "@/components/ui/dataTable/DataTable";
import {
  documentsManagement,
  userManagementApi,
} from "@/services/privateApi/adminApi";
import type { Document } from "@/types/document";
import { useCallback, useEffect, useState } from "react";
import { DocumentColumns } from "./components/DocumentColumns";
import type { User } from "@/types/user";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import UserDetailDialog from "@/components/ui/userDetailDialog/UserDetailDialog";
import DocumentApproveForm from "./components/DocumentApproveForm";
import type { DocumentApproveFormData } from "@/schemas/documentApproveSchema";

function DocumentsManagement() {
  const [user, setUser] = useState<User>();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [search] = useState("");
  const [sortBy] = useState("");
  const [sortOrder] = useState("");
  const [loading, setLoading] = useState(false);
  const [userDialogOpen, setUserDialogOpen] = useState(false);

  const [selectedDocumentId, setSelectedDocumentId] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);

  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    try {
      const response = await documentsManagement.getAllDocuments({
        page,
        pageSize: 5,
        search,
        sortBy,
        sortOrder,
      });
      setDocuments(response.data.data.items);
      setTotalCount(response.data.data.totalCount);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [page, search, sortBy, sortOrder]);

  const fetchUserDetail = async (id: string) => {
    try {
      const response = await userManagementApi.getUserDetail(id);
      setUser(response.data);
      setUserDialogOpen(true);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  const handleApproveDocument = async (data: DocumentApproveFormData) => {
    try {
      await documentsManagement.approveDocument(data);
      toast.success("Document approved successfully");
      fetchDocuments();
    } catch (error) {
      console.log(error);
      toast.error("Failed to approve document");
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const triggerApprove = async (id: string) => {
    setSelectedDocumentId(id);
    setIsFormOpen(true);
  };

  const handlePageChane = (page: number) => {
    setPage(page);
  };
  return (
    <div>
      <DataTable
        columns={DocumentColumns(triggerApprove, fetchUserDetail)}
        data={documents}
        limit={5}
        loading={loading}
        onPageChange={handlePageChane}
        total={totalCount}
      />

      <DocumentApproveForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleApproveDocument}
        documentId={selectedDocumentId}
      />

      <Dialog
        open={userDialogOpen}
        onOpenChange={() => setUserDialogOpen(false)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detail</DialogTitle>
          </DialogHeader>
          {user && <UserDetailDialog user={user} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default DocumentsManagement;
