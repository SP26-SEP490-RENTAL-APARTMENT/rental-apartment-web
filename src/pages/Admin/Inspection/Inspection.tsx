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

function Inspections() {
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const { user } = useAuthStore();
  const [selectedId, setSelectedId] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ decision: "approve", reason: "" });
  const [reviewForm, setReviewForm] = useState(false);

  const fetchInspections = async () => {
    if (!user) return;

    setLoading(true);
    try {
      let response;

      if (user.role === "admin") {
        response = await inspectionApi.getAllInspection({
          page,
          pageSize: 5,
          search: "",
          sortBy: "scheduledDate",
          sortOrder: "desc",
        });
      } else if (user.role === "staff") {
        response = await inspectionApi.getMyInspection({
          page,
          pageSize: 5,
          search: "",
          sortBy: "scheduledDate",
          sortOrder: "desc",
        });
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

  useEffect(() => {
    fetchInspections();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, user]);

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
  return (
    <div>
      <DataTable
        columns={InspectionColumns(
          handleStartInspection,
          triggerInspectionForm,
          triggerReviewInspection,
        )}
        data={inspections}
        limit={5}
        loading={loading}
        onPageChange={handlePageChange}
        page={page}
        total={totalCount}
      />

      <InspectionForm
        onClose={() => setOpen(false)}
        onSubmit={handleFillInspection}
        open={open}
      />

      <ReviewForm
        form={form}
        onClose={() => setReviewForm(false)}
        onSubmit={handleReviewInspection}
        open={reviewForm}
        setForm={setForm}
      />
    </div>
  );
}

export default Inspections;
