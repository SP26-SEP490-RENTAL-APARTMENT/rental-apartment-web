import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { PricingTemplate } from "@/types/pricingTemplate";
import { useEffect, useState } from "react";
import PricingTemplateDetail from "./PricingTemplateDetail";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  pricingPolicySchema,
  type PricingPolicyFormData,
} from "@/schemas/pricingPolicy";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { pricingPolicyApi } from "@/services/privateApi/landlordApi";
import { toast } from "sonner";
import { AlertCircle, Calendar, Zap } from "lucide-react";
import { useTranslation } from "react-i18next";

interface Props {
  open: boolean;
  onClose: () => void;
  templateList: PricingTemplate[];
  apartmentId: string;
  refetch?: () => void;
}

function PricingPolicyForm({
  open,
  onClose,
  templateList,
  apartmentId,
  refetch,
}: Props) {
  const { t } = useTranslation("landlord");
  const [selectedTemplate, setSelectedTemplate] =
    useState<PricingTemplate | null>(null);

  const {
    register,
    setValue,
    watch,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(pricingPolicySchema),
    defaultValues: {
      templateId: "",
      startDate: "",
      endDate: "",
      isEnabled: true,
      overrides: {},
    },
  });

  useEffect(() => {
    if (!selectedTemplate) return;

    const overrides: Record<string, number> = {};

    selectedTemplate.parameters.forEach((p) => {
      if (p.isAdjustable) {
        overrides[p.parameterKey] = Number(p.defaultValue);
      }
    });

    reset({
      templateId: selectedTemplate.templateId,
      startDate: "",
      endDate: "",
      isEnabled: true,
      overrides,
    });
  }, [selectedTemplate, reset]);

  const onSubmit = async (data: PricingPolicyFormData) => {
    try {
      await pricingPolicyApi.applyPolicy(apartmentId, data);
      onClose();
      refetch?.();
      toast.success(t("pricingPolicy.form.successMessage"));
    } catch (error) {
      toast.error(t("pricingPolicy.form.errorMessage"));
      console.log(error);
    }
  };

  const handleSelectTemplate = (id: string) => {
    const found = templateList.find((t) => t.templateId === id);
    setSelectedTemplate(found ?? null);
    setValue("templateId", id);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="overflow-y-auto max-h-[90vh] sm:max-w-3xl">
        <DialogHeader className="pb-4 border-b">
          <DialogTitle className="text-2xl font-bold">
            {t("pricingPolicy.form.title")}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
          {/* Template Selection */}
          <Card className="border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Zap className="w-5 h-5 text-blue-500" />
                {t("pricingPolicy.form.selectTemplate")}
              </CardTitle>
              <CardDescription>
                {t("pricingPolicy.form.selectTemplateDescription")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select
                value={selectedTemplate?.templateId || ""}
                onValueChange={handleSelectTemplate}
              >
                <SelectTrigger className="border-slate-300 focus:border-blue-500">
                  <SelectValue
                    placeholder={t(
                      "pricingPolicy.form.selectTemplateplaceholder",
                    )}
                  />
                </SelectTrigger>
                <SelectContent>
                  {templateList.map((item) => (
                    <SelectItem key={item.templateId} value={item.templateId}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.templateId && (
                <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.templateId.message}
                </p>
              )}
            </CardContent>
          </Card>

          {selectedTemplate && (
            <>
              {/* Template Details */}

              <PricingTemplateDetail template={selectedTemplate} />

              {/* Date Range */}
              <Card className="border-slate-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-green-500" />
                    {t("pricingPolicy.form.policyPeriod")}
                  </CardTitle>
                  <CardDescription>
                    {t("pricingPolicy.form.policyPeriodDescription")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startDate" className="font-semibold">
                        {t("pricingPolicy.form.startDate")}
                      </Label>
                      <Input
                        id="startDate"
                        type="date"
                        {...register("startDate")}
                        className="border-slate-300 focus:border-blue-500"
                      />
                      {errors.startDate && (
                        <p className="text-red-500 text-sm flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.startDate.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="endDate" className="font-semibold">
                        {t("pricingPolicy.form.endDate")}
                      </Label>
                      <Input
                        id="endDate"
                        type="date"
                        {...register("endDate")}
                        className="border-slate-300 focus:border-blue-500"
                      />
                      {errors.endDate && (
                        <p className="text-red-500 text-sm flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.endDate.message}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Policy Status */}
              <Card className="border-slate-200 bg-linear-to-r from-blue-50 to-indigo-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">
                    {t("pricingPolicy.form.policyStatus")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 rounded-lg border border-blue-200 bg-white">
                    <div>
                      <p className="font-semibold text-gray-700">
                        {t("pricingPolicy.form.enablePolicy")}
                      </p>
                      <p className="text-sm text-gray-500">
                        {watch("isEnabled")
                          ? t("pricingPolicy.form.policyIsActive")
                          : t("pricingPolicy.form.policyIsInactive")}
                      </p>
                    </div>
                    <Switch
                      checked={watch("isEnabled")}
                      onCheckedChange={(value) => setValue("isEnabled", value)}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Adjustable Parameters */}
              {selectedTemplate.parameters.filter((p) => p.isAdjustable)
                .length > 0 && (
                <Card className="border-slate-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">
                      {t("pricingPolicy.form.adjustParameters")}
                    </CardTitle>
                    <CardDescription>
                      {t("pricingPolicy.form.adjustParametersDescription")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {selectedTemplate.parameters
                        .filter((p) => p.isAdjustable)
                        .map((param) => (
                          <div key={param.parameterId} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <Label
                                htmlFor={param.parameterKey}
                                className="font-semibold text-gray-700"
                              >
                                {param.displayName}
                              </Label>
                              <span className="text-xs text-gray-500">
                                {Number(param.minValue)} -{" "}
                                {Number(param.maxValue)}
                              </span>
                            </div>
                            <Input
                              id={param.parameterKey}
                              type="number"
                              step="0.1"
                              min={Number(param.minValue)}
                              max={Number(param.maxValue)}
                              {...register(
                                `overrides.${param.parameterKey}` as any,
                                {
                                  valueAsNumber: true,
                                },
                              )}
                              className="border-slate-300 focus:border-blue-500"
                            />
                            {errors.overrides?.[param.parameterKey] && (
                              <p className="text-red-500 text-sm flex items-center gap-1">
                                <AlertCircle className="w-4 h-4" />
                                {
                                  (errors.overrides[param.parameterKey] as any)
                                    ?.message
                                }
                              </p>
                            )}
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isSubmitting
                    ? t("pricingPolicy.form.savingButton")
                    : t("pricingPolicy.form.saveButton")}
                </Button>
              </div>
            </>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default PricingPolicyForm;
