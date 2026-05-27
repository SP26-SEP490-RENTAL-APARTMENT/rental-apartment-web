import { useTranslation } from "react-i18next";
import { Controller } from "react-hook-form";
import { CreditCard, AlertCircle } from "lucide-react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface PaymentMethodSectionProps {
  control: any;
  errors: any;
}

interface PaymentOptionProps {
  id: string;
  value: string;
  label: string;
  description?: string;
  amount?: string;
  isSelected: boolean;
}

function PaymentOption({
  id,
  value,
  label,
  description,
  amount,
  isSelected,
}: PaymentOptionProps) {
  return (
    <Label
      htmlFor={id}
      className={`flex items-center gap-4 rounded-lg border-2 p-4 cursor-pointer transition-all ${
        isSelected
          ? "border-blue-500 bg-blue-50 shadow-md"
          : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
      }`}
    >
      <RadioGroupItem value={value} id={id} className="mt-1" />
      <div className="flex-1 min-w-0">
        <span className="block font-semibold text-gray-900">{label}</span>
        {description && (
          <span className="block text-sm text-gray-600">{description}</span>
        )}
      </div>
      {amount && <span className="text-green-600 font-bold ml-2">{amount}</span>}
    </Label>
  );
}

export default function PaymentMethodSection({
  control,
  errors,
}: PaymentMethodSectionProps) {
  const { t } = useTranslation("book");

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="bg-linear-to-r from-purple-50 to-pink-50 border-b border-purple-200">
        <CardTitle className="flex items-center gap-2 text-lg">
          <CreditCard className="h-5 w-5 text-purple-600" />
          {t("confirm.paymentMethod")}
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-6 space-y-8">
        {/* Payment Mode Section */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-4">
            {t("confirm.selectPaymentOption")}
          </h3>

          <Controller
            name="paymentMode"
            control={control}
            render={({ field }) => (
              <RadioGroup
                value={field.value}
                onValueChange={field.onChange}
                className="grid grid-cols-1 md:grid-cols-2 gap-3"
              >
                <PaymentOption
                  id="partial"
                  value="partial"
                  label={t("confirm.deposit")}
                  description={t("confirm.depositDesc")}
                  isSelected={field.value === "partial"}
                />

                <PaymentOption
                  id="full"
                  value="full"
                  label={t("confirm.full")}
                  description={t("confirm.fullDesc")}
                  isSelected={field.value === "full"}
                />
              </RadioGroup>
            )}
          />
        </div>

        {/* Payment Provider Section */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">
            {t("confirm.paymentProvider")}
          </h3>

          <Controller
            name="paymentProvider"
            control={control}
            render={({ field }) => (
              <RadioGroup
                value={field.value}
                onValueChange={field.onChange}
                className="space-y-3"
              >
                <PaymentOption
                  id="payos"
                  value="payos"
                  label="PayOS"
                  description={t("confirm.payosDesc")}
                  isSelected={field.value === "payos"}
                />

                <PaymentOption
                  id="stripe"
                  value="stripe"
                  label="Stripe"
                  description={t("confirm.stripeDesc")}
                  isSelected={field.value === "stripe"}
                />
              </RadioGroup>
            )}
          />

          {/* Error Message */}
          {errors.paymentProvider && (
            <div className="mt-4 flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />
              <p className="text-sm text-red-700">
                {errors.paymentProvider.message}
              </p>
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-xs text-blue-800">
            <span className="font-semibold">{t("confirm.note")}</span>{" "}
            {t("confirm.paymentInfo")}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
