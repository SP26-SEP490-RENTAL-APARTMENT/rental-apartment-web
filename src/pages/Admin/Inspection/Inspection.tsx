import DataTable from "@/components/ui/dataTable/DataTable";
import { inspectionApi } from "@/services/privateApi/adminApi";
import type { Inspection } from "@/types/inspection";
import { useEffect, useState } from "react";
import { InspectionColumns } from "./components/InspectionColumns";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import type { InspectionFormData } from "@/schemas/inspectionSchema";
import InspectionForm from "./components/InspectionForm";
import ReviewForm from "./components/ReviewForm";
import { apartmentApi } from "@/services/publicApi/apartmentApi";
import type { Apartment } from "@/types/apartment";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ApartmentDetailDialog from "@/components/ui/apartmentDetailDialog/ApartmentDetailDialog";
import InspectionFilter, { type InspectionFilterValues } from "./components/InspectionFilter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardCheck } from "lucide-react";

function Inspections() {
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [apartment, setApartment] = useState<Apartment>();
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const { user } = useAuthStore();
  const [selectedId, setSelectedId] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ decision: "approve", reason: "" });
  const [reviewForm, setReviewForm] = useState(false);
  const [filters, setFilters] = useState<InspectionFilterValues>({
    sortBy: "scheduledDate",
    sortOrder: "desc",
    status: "",
    scheduledDate: "",
    search: "",
  });

  const fetchInspections = async () => {
    if (!user) return;

    setLoading(true);
    try {
      let response;

      const requestParams = {
        page,
        pageSize: 8,
        search: filters.search,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
        ...(filters.status && { status: filters.status }),
        ...(filters.scheduledDate && { scheduledDate: filters.scheduledDate }),
      };

      if (user.role === "admin") {
        response = await inspectionApi.getAllInspection(requestParams);
      } else if (user.role === "staff") {
        response = await inspectionApi.getMyInspection(requestParams);
      }

      if (response) {
        setInspections(response.data.items);
        setTotalCount(response.data.totalCount);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewInspection = async () => {
    try {
      await inspectionApi.reviewInspection(selectedId, form);
      toast.success("Review done");
      fetchInspections();
      setReviewForm(false);
    } catch (error) {
      console.log(error);
      toast.error("Fail");
    }
  };

  const handleGetApartment = async (id: string) => {
    try {
      const res = await apartmentApi.getApartmentById(id);
      setApartment(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchInspections();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, user, page]);

  const handleStartInspection = async (id: string) => {
    try {
      await inspectionApi.startInspection(id);
      toast.success("Inspection started");
      fetchInspections();
    } catch (error) {
      console.log(error);
      toast.error("Error");
    }
  };

  const handleFillInspection = async (
    data: InspectionFormData,
    files: File[],
  ) => {
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("Photos", file);
      });
      formData.append("OverallCondition", data.OverallCondition);
      formData.append("IssuesFound", data.IssuesFound);
      formData.append("Recommendations", data.Recommendations);

      await inspectionApi.fillInspection(selectedId, formData);

      toast.success("Upload successfully");
      fetchInspections();
    } catch (error) {
      toast.error("Upload fail");
      console.error(error);
    }
  };

  const handlePageChange = (page: number) => {
    setPage(page);
  };

  const triggerInspectionForm = (id: string) => {
    setSelectedId(id);
    setOpen(true);
  };

  const triggerReviewInspection = (id: string) => {
    setSelectedId(id);
    setReviewForm(true);
  };

  const handleFilterChange = (newFilters: InspectionFilterValues) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters({
      sortBy: "scheduledDate",
      sortOrder: "desc",
      status: "",
      scheduledDate: "",
      search: "",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <ClipboardCheck className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Inspections</h1>
              <p className="text-gray-600 mt-1">
                Schedule and manage apartment inspections
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Filter Card */}
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-6">
            <InspectionFilter
              filters={filters}
              onFilterChange={handleFilterChange}
              onReset={handleResetFilters}
            />
          </CardContent>
        </Card>

        {/* Data Table Card */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="border-b border-gray-100">
            <CardTitle>
              Inspections ({totalCount})
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <DataTable
              columns={InspectionColumns(
                handleStartInspection,
                triggerInspectionForm,
                triggerReviewInspection,
                handleGetApartment,
              )}
              data={inspections}
              limit={8}
              loading={loading}
              onPageChange={handlePageChange}
              page={page}
              total={totalCount}
            />
          </CardContent>
        </Card>
      </div>

      {/* Inspection Form Modal */}
      <InspectionForm
        onClose={() => setOpen(false)}
        onSubmit={handleFillInspection}
        open={open}
      />

      {/* Review Form Modal */}
      <ReviewForm
        form={form}
        onClose={() => setReviewForm(false)}
        onSubmit={handleReviewInspection}
        open={reviewForm}
        setForm={setForm}
      />

      {/* Apartment Detail Modal */}
      <Dialog open={!!apartment} onOpenChange={() => setApartment(undefined)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{apartment?.title || "Apartment"}</DialogTitle>
          </DialogHeader>
          {apartment && <ApartmentDetailDialog apartment={apartment} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Inspections;
      
