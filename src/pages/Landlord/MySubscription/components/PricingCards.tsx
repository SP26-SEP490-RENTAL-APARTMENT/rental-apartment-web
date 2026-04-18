import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import type { SubscriptionPlan } from "@/types/subscriptionPlan";

interface Props {
  plan: SubscriptionPlan;
  isHighlighted?: boolean;
  isCurrent?: boolean;
  onSelectPlan: (planId: string) => void;
}

const formatPrice = (price: number) => {
  if (price === 0) return "Free";
  return price.toLocaleString("vi-VN") + "đ";
};
const getPlanStyle = (name: string) => {
  switch (name) {
    case "Starter":
      return "border-gray-300";
    case "Pro":
      return "border-primary shadow-lg";
    case "Enterprise":
      return "bg-black text-white border-none";
    default:
      return "";
  }
};

const getCurrentStyle = () => {
  return "ring-2 ring-green-500";
};

export default function PricingCard({
  plan,
  isHighlighted,
  isCurrent,
  onSelectPlan,
}: Props) {
  return (
    <Card
      className={`p-5 flex flex-col justify-between transition-all
    ${getPlanStyle(plan.name)}
    ${isHighlighted ? "scale-105" : ""}
    ${isCurrent ? getCurrentStyle() : ""}
  `}
    >
      {/* Badge */}
      {isHighlighted && (
        <Badge className="absolute top-3 right-3">Popular</Badge>
      )}

      <CardHeader className="p-0 mb-4">
        <CardTitle className="text-xl">{plan.name}</CardTitle>
        <p className="text-sm text-muted-foreground">{plan.description}</p>
      </CardHeader>

      <CardContent className="p-0 space-y-5">
        {/* Price */}
        <div>
          <p className="text-3xl font-bold">{formatPrice(plan.priceMonthly)}</p>
          <p className="text-sm text-muted-foreground">/month</p>
        </div>

        {/* Features */}
        <ul className="space-y-2 text-sm">
          <li className="flex items-center gap-2">
            <Check size={16} />
            Up to {plan.maxApartments} apartments
          </li>

          <li className="flex items-center gap-2">
            <Check size={16} />
            {plan.features}
          </li>
        </ul>

        {/* CTA */}
        <Button
          onClick={() => onSelectPlan(plan.planId)}
          className={`w-full mt-4 ${
            plan.name === "Enterprise"
              ? "bg-white text-black hover:bg-gray-200"
              : ""
          }`}
          variant={plan.name === "Enterprise" ? "ghost" : "default"}
          disabled={isCurrent}
        >
          {isCurrent ? "Currently Using" : "Choose Plan"}
        </Button>
      </CardContent>
    </Card>
  );
}
