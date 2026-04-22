import DataTable from "@/components/ui/dataTable/DataTable";
import { subscriptionPlanManagementApi } from "@/services/privateApi/adminApi";
import type { SubscriptionPlan } from "@/types/subscriptionPlan";
import { useEffect, useState } from "react";
import { SubscriptionPlanColumns } from "./components/SubscriptionPlanColumns";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Plus, Zap } from "lucide-react";
import type { CreateSubscriptionPlanFormData, UpdateSubscriptionPlanFormData } from "@/schemas/subscriptionPlanSchema";
import SubscriptionPlanForm from "./components/SubscriptionPlanForm";
import SubscriptionPlanFilter from "./components/SubscriptionPlanFilter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function SubsciptionPlan() {
  const [data, setData] = useState<SubscriptionPlan[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(8);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<keyof SubscriptionPlan>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [loading, setLoading] = useState(false);

  // Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [formMode, setFormMode] = useState<"create" | "update">("create");

  const fetchSubscriptionPlans = async () => {
    setLoading(true);
    try {
      const response = await subscriptionPlanManagementApi.getAllSubscriptionPlans({
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
      await subscriptionPlanManagementApi.deleteSubscriptionPlan(subscriptionPlanId);
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Zap className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Subscription Plans
                </h1>
                <p className="text-gray-600 mt-1">
                  Manage available subscription plans
                </p>
              </div>
            </div>
            <Button
              onClick={triggerCreateSubscriptionPlan}
              className="bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white font-semibold gap-2"
            >
              <Plus className="h-4 w-4" />
              New Plan
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Filter Card */}
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-6">
            <SubscriptionPlanFilter
              onSearchChange={setSearch}
              onSortByChange={setSortBy}
              onSortOrderChange={setSortOrder}
              search={search}
              sortBy={sortBy}
              sortOrder={sortOrder}
            />
          </CardContent>
        </Card>

        {/* Data Table Card */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="border-b border-gray-100">
            <CardTitle>
              Plans ({total})
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
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
          </CardContent>
        </Card>
      </div>

      {/* Subscription Plan Form Modal */}
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
    
