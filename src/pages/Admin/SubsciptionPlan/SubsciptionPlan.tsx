import DataTable from "@/components/ui/dataTable/DataTable";
import { subscriptionPlanManagementApi } from "@/services/privateApi/adminApi";
import type { SubscriptionPlan } from "@/types/subscriptionPlan";
import { useEffect, useState } from "react";
import { SubscriptionPlanColumns } from "./components/SubscriptionPlanColumns";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import type {
  CreateSubscriptionPlanFormData,
  UpdateSubscriptionPlanFormData,
} from "@/schemas/subscriptionPlanSchema";
import SubscriptionPlanForm from "./components/SubscriptionPlanForm";
import SubscriptionPlanFilter from "./components/SubscriptionPlanFilter";

function SubsciptionPlan() {
  const { t: subscriptionPlanTranslation } = useTranslation("subscriptionPlan");
  const [data, setData] = useState<SubscriptionPlan[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(5);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<keyof SubscriptionPlan>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [loading, setLoading] = useState(false);

  // Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(
    null,
  );
  const [formMode, setFormMode] = useState<"create" | "update">("create");

  const fetchSubscriptionPlans = async () => {
    setLoading(true);
    try {
      const response =
        await subscriptionPlanManagementApi.getAllSubscriptionPlans({
          page,
          pageSize,
          search,
          sortBy,
          sortOrder,
        });
      setData(response.data.items);
      setTotal(response.data.totalCount);
    } catch (error) {
      console.error("Error fetching subscription plans:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubscriptionPlan = async (subscriptionPlanId: string) => {
    try {
      await subscriptionPlanManagementApi.deleteSubscriptionPlan(
        subscriptionPlanId,
      );
      toast.success("Subscription plan deleted successfully");
      fetchSubscriptionPlans();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to delete subscription plan",
      );
    }
  };

  const handleCreateSubscriptionPlan = async (
    planData: CreateSubscriptionPlanFormData,
  ) => {
    try {
      await subscriptionPlanManagementApi.createSubscriptionPlan(planData);
      toast.success("Subscription plan created successfully");
      fetchSubscriptionPlans();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to create subscription plan",
      );
    }
  };

  const handleUpdateSubscriptionPlan = async (
    planData: UpdateSubscriptionPlanFormData,
  ) => {
    if (!selectedPlan) return;
    try {
      await subscriptionPlanManagementApi.updateSubscriptionPlan(
        selectedPlan.planId,
        planData,
      );
      fetchSubscriptionPlans();
      toast.success("Subscription plan updated successfully");
    } catch (error) {
      toast.error("Failed to update subscription plan");
    }
  };

  const triggerUpdateSubscriptionPlan = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setFormMode("update");
    setIsFormOpen(true);
  };

  const triggerCreateSubscriptionPlan = () => {
    setSelectedPlan(null);
    setFormMode("create");
    setIsFormOpen(true);
  };

  useEffect(() => {
    fetchSubscriptionPlans();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, search, sortBy, sortOrder]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          {subscriptionPlanTranslation("subsriptionManagement")}
        </h1>
        <Button onClick={triggerCreateSubscriptionPlan}>
          <Plus className="mr-2 h-4 w-4" />
          {subscriptionPlanTranslation("createSubscriptionPlan")}
        </Button>
      </div>

      <SubscriptionPlanFilter
        onSearchChange={setSearch}
        onSortByChange={setSortBy}
        onSortOrderChange={setSortOrder}
        search={search}
        sortBy={sortBy}
        sortOrder={sortOrder}
      />

      <DataTable
        columns={SubscriptionPlanColumns(
          handleDeleteSubscriptionPlan,
          triggerUpdateSubscriptionPlan,
        )}
        data={data}
        limit={pageSize}
        loading={loading}
        page={page}
        total={total}
        onPageChange={handlePageChange}
      />

      <SubscriptionPlanForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={
          formMode === "create"
            ? handleCreateSubscriptionPlan
            : handleUpdateSubscriptionPlan
        }
        subscriptionPlan={selectedPlan}
        mode={formMode}
      />
    </div>
  );
}

export default SubsciptionPlan;
