import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  createTemplateSchema,
  updateTemplateSchema,
  type CreateTemplateFormData,
  type UpdateTemplateFormData,
} from "@/schemas/pricingTemplateSchema";
import type { PricingTemplate } from "@/types/pricingTemplate";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Trash2, Plus } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTemplateFormData | UpdateTemplateFormData) => void;
  mode: "create" | "edit";
  template: PricingTemplate | null;
}

function TemplateForm({ open, onClose, onSubmit, mode, template }: Props) {
  const isCreate = mode === "create";
  const schema = isCreate ? createTemplateSchema : updateTemplateSchema;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateTemplateFormData | UpdateTemplateFormData>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: {
      parameters: [],
    },
  });

  const parameters = watch("parameters");

  useEffect(() => {
    if (open) {
      if (isCreate) {
        reset({
          name: "",
          nameVi: "",
          description: "",
          descriptionVi: "",
          code: "",
          isActive: true,
          parameters: [
            {
              parameterKey: "",
              displayName: "",
              displayNameVi: "",
              defaultValue: 0,
              minValue: 0,
              maxValue: 0,
              isAdjustable: false,
            },
          ],
        });
      } else if (template) {
        reset({
          name: template.name,
          nameVi: template.nameVi,
          description: template.description,
          descriptionVi: template.descriptionVi,
          code: template.code,
          isActive: template.isActive,
          parameters: template.parameters,
        });
      }
    }
  }, [open, isCreate, template, reset]);

  const addParameter = () => {
    const currentParams = watch("parameters") || [];
    setValue("parameters", [
      ...currentParams,
      {
        parameterKey: "",
        displayName: "",
        displayNameVi: "",
        defaultValue: 0,
        minValue: 0,
        maxValue: 0,
        isAdjustable: false,
      },
    ]);
  };

  const removeParameter = (index: number) => {
    const currentParams = watch("parameters") || [];
    setValue(
      "parameters",
      currentParams.filter((_, i) => i !== index),
    );
  };

  const handleFormSubmit = handleSubmit((data) => {
    onSubmit(data);
    reset();
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isCreate ? "Create" : "Edit"} Template</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleFormSubmit} className="space-y-6">
          {/* Basic Information Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Basic Information</h3>

            {/* Template Name */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Template Name (EN) *</Label>
                <Input
                  id="name"
                  placeholder="Enter template name in English"
                  {...register("name")}
                  disabled={isSubmitting}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="nameVi">Template Name (VI) *</Label>
                <Input
                  id="nameVi"
                  placeholder="Enter template name in Vietnamese"
                  {...register("nameVi")}
                  disabled={isSubmitting}
                />
                {errors.nameVi && (
                  <p className="text-sm text-red-500">
                    {errors.nameVi.message}
                  </p>
                )}
              </div>
            </div>

            {/* Code */}
            <div className="space-y-2">
              <Label htmlFor="code">Code *</Label>
              <Input
                id="code"
                placeholder="e.g., TEMPLATE_001"
                {...register("code")}
                disabled={isSubmitting}
              />
              <p className="text-xs text-gray-500">
                Only uppercase letters, numbers, and underscores allowed
              </p>
              {errors.code && (
                <p className="text-sm text-red-500">{errors.code.message}</p>
              )}
            </div>

            {/* Description */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="description">Description (EN)</Label>
                <Textarea
                  id="description"
                  placeholder="Enter template description in English"
                  {...register("description")}
                  disabled={isSubmitting}
                  className="min-h-20"
                />
                {errors.description && (
                  <p className="text-sm text-red-500">
                    {errors.description.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="descriptionVi">Description (VI)</Label>
                <Textarea
                  id="descriptionVi"
                  placeholder="Enter template description in Vietnamese"
                  {...register("descriptionVi")}
                  disabled={isSubmitting}
                  className="min-h-20"
                />
                {errors.descriptionVi && (
                  <p className="text-sm text-red-500">
                    {errors.descriptionVi.message}
                  </p>
                )}
              </div>
            </div>

            {/* Active Status */}
            <div className="flex items-center justify-between rounded-lg border p-3">
              <Label htmlFor="isActive" className="cursor-pointer">
                Active Status
              </Label>
              <Controller
                name="isActive"
                control={control}
                render={({ field }) => (
                  <Switch
                    id="isActive"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isSubmitting}
                  />
                )}
              />
            </div>
          </div>

          {/* Parameters Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">Parameters *</h3>
              <Button
                type="button"
                size="sm"
                onClick={addParameter}
                disabled={isSubmitting}
                className="gap-1"
              >
                <Plus className="h-4 w-4" />
                Add Parameter
              </Button>
            </div>

            {errors.parameters?.message && (
              <p className="text-sm text-red-500">
                {errors.parameters.message}
              </p>
            )}

            <div className="space-y-4">
              {parameters && parameters.length > 0 ? (
                parameters.map((_param, index) => (
                  <div key={index} className="space-y-3 rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium">
                        Parameter {index + 1}
                      </h4>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => removeParameter(index)}
                        disabled={isSubmitting}
                        className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Group 1: Key, Display Name, Adjustable */}
                    <div className="grid gap-3 sm:grid-cols-3">
                      <div className="space-y-2">
                        <Label htmlFor={`param-key-${index}`}>
                          Parameter Key *
                        </Label>
                        <Controller
                          name={`parameters.${index}.parameterKey`}
                          control={control}
                          render={({ field }) => (
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                              disabled={isSubmitting}
                            >
                              <SelectTrigger
                                id={`param-key-${index}`}
                                className="w-full"
                              >
                                <SelectValue placeholder="Select parameter key" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="holiday_multiplier">
                                  Holiday Multiplier
                                </SelectItem>
                                <SelectItem value="weekend_multiplier">
                                  Weekend Multiplier
                                </SelectItem>
                                <SelectItem value="multiplier">
                                  Multiplier
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        />
                        {errors.parameters?.[index]?.parameterKey && (
                          <p className="text-xs text-red-500">
                            {errors.parameters[index]?.parameterKey?.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`param-display-${index}`}>
                          Display Name (EN) *
                        </Label>
                        <Input
                          id={`param-display-${index}`}
                          placeholder="e.g., Price"
                          {...register(`parameters.${index}.displayName`)}
                          disabled={isSubmitting}
                        />
                        {errors.parameters?.[index]?.displayName && (
                          <p className="text-xs text-red-500">
                            {errors.parameters[index]?.displayName?.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`param-display-${index}`}>
                          Display Name (VI) *
                        </Label>
                        <Input
                          id={`param-display-${index}`}
                          placeholder="e.g., Price"
                          {...register(`parameters.${index}.displayNameVi`)}
                          disabled={isSubmitting}
                        />
                        {errors.parameters?.[index]?.displayNameVi && (
                          <p className="text-xs text-red-500">
                            {errors.parameters[index]?.displayNameVi?.message}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Group 2: Min, Max, Default Values */}
                    <div className="grid gap-3 sm:grid-cols-3">
                      <div className="space-y-2">
                        <Label htmlFor={`param-min-${index}`}>
                          Min Value *
                        </Label>
                        <Input
                          id={`param-min-${index}`}
                          type="number"
                          placeholder="1.0"
                          min={1}
                          step={0.1}
                          {...register(`parameters.${index}.minValue`, {
                            valueAsNumber: true,
                          })}
                          disabled={isSubmitting}
                        />
                        {errors.parameters?.[index]?.minValue && (
                          <p className="text-xs text-red-500">
                            {errors.parameters[index]?.minValue?.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`param-max-${index}`}>
                          Max Value *
                        </Label>
                        <Input
                          id={`param-max-${index}`}
                          type="number"
                          placeholder="5.0"
                          min={1}
                          step={0.1}
                          {...register(`parameters.${index}.maxValue`, {
                            valueAsNumber: true,
                          })}
                          disabled={isSubmitting}
                        />
                        {errors.parameters?.[index]?.maxValue && (
                          <p className="text-xs text-red-500">
                            {errors.parameters[index]?.maxValue?.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`param-default-${index}`}>
                          Default Value *
                        </Label>
                        <Input
                          id={`param-default-${index}`}
                          type="number"
                          placeholder="1.2"
                          min={1}
                          step={0.1}
                          {...register(`parameters.${index}.defaultValue`, {
                            valueAsNumber: true,
                          })}
                          disabled={isSubmitting}
                        />
                        {errors.parameters?.[index]?.defaultValue && (
                          <p className="text-xs text-red-500">
                            {errors.parameters[index]?.defaultValue?.message}
                          </p>
                        )}
                      </div>

                      <div className="flex items-end justify-end">
                        <div className="w-full space-y-2">
                          <Label className="text-xs">Adjustable</Label>
                          <div className="flex items-center space-x-2">
                            <Controller
                              name={`parameters.${index}.isAdjustable`}
                              control={control}
                              render={({ field }) => (
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  disabled={isSubmitting}
                                />
                              )}
                            />
                            <span className="text-xs text-gray-600">
                              {watch(`parameters.${index}.isAdjustable`)
                                ? "Yes"
                                : "No"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-lg border border-dashed p-6 text-center">
                  <p className="text-sm text-gray-500">
                    No parameters added yet. Click "Add Parameter" to get
                    started.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-2 border-t pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Saving..."
                : isCreate
                  ? "Create Template"
                  : "Update Template"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default TemplateForm;
