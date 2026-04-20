import { mySubscriptionApi } from "@/services/privateApi/landlordApi";
import type { SubscriptionPlan } from "@/types/subscriptionPlan";
import { useCallback, useEffect, useState } from "react";
import PricingCard from "./components/PricingCards";
import { useAuthStore } from "@/store/authStore";
import CheckoutDialog from "./components/CheckoutDialog";
import { toast } from "sonner";

function MySubscription() {
  const [subscriptions, setSubscriptions] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    renewalType: "",
    autoRenew: true,
  });

  const { user } = useAuthStore();

  const fetchSubscriptions = useCallback(async () => {
    setLoading(true);
    try {
      const response = await mySubscriptionApi.getSubscription({
        page: 1,
        pageSize: 10,
      });
      const data = response.data.items.sort(
        (a: any, b: any) => a.priceMonthly - b.priceMonthly,
      );
      setSubscriptions(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleCheckout = async () => {
    if (!selectedPlanId) return;
    try {
      const response = await mySubscriptionApi.momoCheckout({
        ...form,
        planId: selectedPlanId,
      });
      setOpen(false)
      const paymentUrl = response.data.data.payUrl
      window.location.href = paymentUrl;
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Checkout failed");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  const handleSelectPlan = (planId: string) => {
    setSelectedPlanId(planId);
    setOpen(true);
  };

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {loading
          ? "Loading..."
          : subscriptions.map((sub) => {
              const isCurrent =
                user?.subscriptionPlanId === sub.planId ||
                (!user?.subscriptionPlanId && sub.name === "Starter");

              const isHighlighted = sub.name === "Pro";

              return (
                <PricingCard
                  onSelectPlan={handleSelectPlan}
                  key={sub.planId}
                  plan={sub}
                  isCurrent={isCurrent}
                  isHighlighted={isHighlighted}
                />
              );
            })}
      </div>
      <CheckoutDialog
        form={form}
        onClose={() => setOpen(false)}
        onSubmit={handleCheckout}
        setForm={setForm}
        open={open}
      />
    </div>
  );
}

export default MySubscription;
