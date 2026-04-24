import { mySubscriptionApi } from "@/services/privateApi/landlordApi";
import type { SubscriptionPlan } from "@/types/subscriptionPlan";
import { useCallback, useEffect, useState } from "react";
import PricingCard from "./components/PricingCards";
import { useAuthStore } from "@/store/authStore";
import CheckoutDialog from "./components/CheckoutDialog";
import { toast } from "sonner";
import { Zap } from "lucide-react";

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
      setOpen(false);
      const paymentUrl = response.data.data.payUrl;
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Zap className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Subscription Plans
              </h1>
              <p className="text-gray-600 mt-1">
                Choose the perfect plan for your needs
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Current Plan Info */}
        {user?.subscriptionPlanId && (
          <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <p className="text-sm text-blue-900 font-medium">
              💡 Your current plan is displayed below. You can upgrade anytime
              to access more features.
            </p>
          </div>
        )}

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-96 bg-white rounded-xl shadow-sm animate-pulse"
                />
              ))
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

        {/* FAQ Section */}
        <div className="mt-16 bg-white rounded-xl p-8 shadow-sm border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Can I upgrade or downgrade anytime?
              </h3>
              <p className="text-gray-600 text-sm">
                Yes, you can upgrade or downgrade your plan at any time. Changes
                will take effect on your next billing cycle.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-600 text-sm">
                We accept payments via Momo wallet, bank transfer, and other
                local payment methods.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Is there a free trial?
              </h3>
              <p className="text-gray-600 text-sm">
                All new users start with the Starter plan free for 7 days. No
                credit card required.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Can I cancel my subscription?
              </h3>
              <p className="text-gray-600 text-sm">
                Yes, you can cancel anytime. Your access will remain active
                until the end of your billing period.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Dialog */}
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
