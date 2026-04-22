import DataTable from "@/components/ui/dataTable/DataTable";
import { documentsManagement, userManagementApi } from "@/services/privateApi/adminApi";
import type { Document } from "@/types/document";
import { useCallback, useEffect, useState } from "react";
import { DocumentColumns } from "./components/DocumentColumns";
import type { User } from "@/types/user";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import UserDetailDialog from "@/components/ui/userDetailDialog/UserDetailDialog";
import DocumentApproveForm from "./components/DocumentApproveForm";
import type { DocumentApproveFormData } from "@/schemas/documentApproveSchema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileCheck } from "lucide-react";

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
        pageSize: 8,
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileCheck className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Documents Management</h1>
              <p className="text-gray-600 mt-1">
                Review and approve user identity documents
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="border-0 shadow-sm">
          <CardHeader className="border-b border-gray-100">
            <CardTitle>
              Documents ({totalCount})
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <DataTable
              columns={DocumentColumns(triggerApprove, fetchUserDetail)}
              data={documents}
              limit={8}
              loading={loading}
              onPageChange={handlePageChane}
              total={totalCount}
              page={page}
            />
          </CardContent>
        </Card>
      </div>

      {/* Document Approve Form Modal */}
      <DocumentApproveForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleApproveDocument}
        documentId={selectedDocumentId}
      />

      {/* User Detail Modal */}
      <Dialog open={userDialogOpen} onOpenChange={() => setUserDialogOpen(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {user && <UserDetailDialog user={user} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default DocumentsManagement;
        
