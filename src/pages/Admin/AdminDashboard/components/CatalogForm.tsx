import { getDefaultSchema } from "@/api/reports";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { catalogSchema, type CatalogFormData } from "@/schemas/catalogSchema";
import type { ReportSchema } from "@/types/reports";
import { humanizeReportField } from "@/utils/reportLabels";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";

export interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CatalogFormData) => void;
}

const createMetricRow = (schema?: ReportSchema | null) => ({
  field: schema?.metricFields?.[0] ?? "booking_count",
  aggregation: schema?.aggregations?.[0] ?? "count",
  alias: "",
});

const toggleDimensionValue = (
  current: CatalogFormData["dimensions"],
  dimensionField: string,
  checked: boolean,
) => {
  if (checked) {
    if (current.some((dimension) => dimension.field === dimensionField)) {
      return current;
    }

    return [...current, { field: dimensionField, alias: dimensionField }];
  }

  return current.filter((dimension) => dimension.field !== dimensionField);
};

function CatalogForm({ isOpen, onClose, onSubmit }: Props) {
  const [schema, setSchema] = useState<ReportSchema | null>(null);
  const [schemaLoading, setSchemaLoading] = useState(false);
  const [schemaError, setSchemaError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CatalogFormData>({
    resolver: zodResolver(catalogSchema),
    mode: "onTouched",
    defaultValues: {
      isActive: true,
      dimensions: [],
      metrics: [createMetricRow()],
    },
  });

  const {
    fields: metricFields,
    append: appendMetric,
    remove: removeMetric,
  } = useFieldArray({
    control,
    name: "metrics",
  });

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    let cancelled = false;

    const loadSchema = async () => {
      setSchemaLoading(true);
      setSchemaError(null);

      console.log("CatalogForm: loadSchema start, isOpen =", isOpen);
      try {
        const nextSchema = await getDefaultSchema();
        console.log("CatalogForm: getDefaultSchema resolved", nextSchema);
        if (cancelled) {
          return;
        }

        setSchema(nextSchema);
        reset({
          name: "",
          category: "",
          type: "custom",
          description: "",
          isActive: true,
          dimensions: [],
          metrics: [createMetricRow(nextSchema)],
        });
      } catch (err) {
        console.error("CatalogForm: getDefaultSchema error", err);
        if (!cancelled) {
          setSchemaError("Failed to load report schema options.");
          setSchema({
            dimensions: [],
            metricFields: ["booking_count"],
            aggregations: ["count"],
            operators: [],
          });
          reset({
            name: "",
            category: "",
            type: "custom",
            description: "",
            isActive: true,
            dimensions: [],
            metrics: [createMetricRow()],
          });
        }
      } finally {
        if (!cancelled) {
          setSchemaLoading(false);
        }
      }
    };

    void loadSchema();

    return () => {
      cancelled = true;
    };
  }, [isOpen, reset]);

  const handleFormSubmit = async (data: CatalogFormData) => {
    try {
      await onSubmit(data);
      reset();
      onClose();
    } catch {
      // Error handling is done in the parent component
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleAddMetric = () => {
    appendMetric(createMetricRow(schema));
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create report</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Controller
                control={control}
                name="name"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full max-w-48">
                      <SelectValue placeholder="Select a name" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Name of report</SelectLabel>
                        <SelectItem value="General">General</SelectItem>
                        <SelectItem value="Revenue">Revenue</SelectItem>
                        <SelectItem value="Booking">Booking</SelectItem>
                        <SelectItem value="Booking Status">Booking Status</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                type="text"
                placeholder="Enter category"
                {...register("category")}
              />
              {errors.category && (
                <p className="text-sm text-destructive">{errors.category.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                type="text"
                placeholder="Enter description"
                {...register("description")}
              />
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="type">Type</Label>
              <Controller
                control={control}
                name="type"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full max-w-48">
                      <SelectValue placeholder="Select a type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Types</SelectLabel>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                        <SelectItem value="real_time">Real-time</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.type && (
                <p className="text-sm text-destructive">{errors.type.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label>Active</Label>
              <Controller
                control={control}
                name="isActive"
                render={({ field }) => (
                  <RadioGroup
                    value={field.value ? "true" : "false"}
                    onValueChange={(val) => field.onChange(val === "true")}
                    className="flex gap-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="true" id="active-yes" />
                      <Label htmlFor="active-yes">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="false" id="active-no" />
                      <Label htmlFor="active-no">No</Label>
                    </div>
                  </RadioGroup>
                )}
              />
              {errors.isActive && (
                <p className="text-sm text-destructive">{errors.isActive.message}</p>
              )}
            </div>

            <div className="grid gap-4 rounded-lg border bg-muted/20 p-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <Label>Dimensions</Label>
                  <span className="text-xs text-muted-foreground">
                    Multi-select from allowed schema fields
                  </span>
                </div>

                {schemaError && (
                  <p className="text-sm text-destructive">{schemaError}</p>
                )}

                <Controller
                  control={control}
                  name="dimensions"
                  render={({ field }) => {
                    const selectedDimensions = field.value ?? [];
                    const dimensionOptions = schema?.dimensions ?? [];

                    return (
                      <div className="space-y-3">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              type="button"
                              variant="outline"
                              className="w-full justify-between"
                              disabled={schemaLoading}
                            >
                              <span>
                                {selectedDimensions.length > 0
                                  ? `${selectedDimensions.length} dimension${selectedDimensions.length > 1 ? "s" : ""} selected`
                                  : "Select dimensions"}
                              </span>
                              <ChevronDown className="h-4 w-4 opacity-60" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-96">
                            <div className="space-y-3">
                              <div>
                                <p className="text-sm font-medium">Available dimensions</p>
                                <p className="text-xs text-muted-foreground">
                                  Only fields allowed by the backend schema are shown here.
                                </p>
                              </div>

                              <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
                                {dimensionOptions.length > 0 ? (
                                  dimensionOptions.map((dimensionField) => {
                                    const checked = selectedDimensions.some(
                                      (dimension) => dimension.field === dimensionField,
                                    );

                                    return (
                                      <label
                                        key={dimensionField}
                                        className="flex cursor-pointer items-center gap-3 rounded-md border px-3 py-2 hover:bg-muted/40"
                                      >
                                        <Checkbox
                                          checked={checked}
                                          disabled={schemaLoading}
                                          onCheckedChange={(checkedValue) => {
                                            field.onChange(
                                              toggleDimensionValue(
                                                selectedDimensions,
                                                dimensionField,
                                                checkedValue === true,
                                              ),
                                            );
                                          }}
                                        />
                                        <span className="text-sm">
                                          {humanizeReportField(dimensionField)}
                                        </span>
                                      </label>
                                    );
                                  })
                                ) : (
                                  <p className="text-sm text-muted-foreground">
                                    {schemaLoading
                                      ? "Loading schema options..."
                                      : "No schema options available."}
                                  </p>
                                )}
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>

                        <div className="flex flex-wrap gap-2">
                          {selectedDimensions.length > 0 ? (
                            selectedDimensions.map((dimension) => (
                              <Badge key={dimension.field} variant="secondary">
                                {humanizeReportField(dimension.alias ?? dimension.field)}
                              </Badge>
                            ))
                          ) : (
                            <p className="text-xs text-muted-foreground">
                              No dimensions selected.
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  }}
                />
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <Label>Metrics</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddMetric}
                    disabled={schemaLoading}
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add metric
                  </Button>
                </div>

                <div className="space-y-3">
                  {metricFields.map((metricField, index) => (
                    <div
                      key={metricField.id}
                      className="grid gap-3 rounded-lg border bg-background p-3"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-medium">Metric {index + 1}</p>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeMetric(index)}
                          disabled={metricFields.length <= 1 || schemaLoading}
                          className="gap-2 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                          Remove
                        </Button>
                      </div>

                      <div className="grid gap-3 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)]">
                        <div className="grid gap-2">
                          <Label htmlFor={`metrics.${index}.field`}>Field</Label>
                          <Controller
                            control={control}
                            name={`metrics.${index}.field`}
                            render={({ field }) => (
                              <Select
                                value={field.value}
                                onValueChange={field.onChange}
                                disabled={schemaLoading}
                              >
                                <SelectTrigger id={`metrics.${index}.field`}>
                                  <SelectValue placeholder="Select metric field" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectLabel>Allowed metric fields</SelectLabel>
                                    {(schema?.metricFields ?? ["booking_count"]).map((option) => (
                                      <SelectItem key={option} value={option}>
                                        {humanizeReportField(option)}
                                      </SelectItem>
                                    ))}
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            )}
                          />
                          {errors.metrics?.[index]?.field && (
                            <p className="text-sm text-destructive">
                              {errors.metrics[index]?.field?.message}
                            </p>
                          )}
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor={`metrics.${index}.aggregation`}>Aggregation</Label>
                          <Controller
                            control={control}
                            name={`metrics.${index}.aggregation`}
                            render={({ field }) => (
                              <Select
                                value={field.value}
                                onValueChange={field.onChange}
                                disabled={schemaLoading}
                              >
                                <SelectTrigger id={`metrics.${index}.aggregation`}>
                                  <SelectValue placeholder="Select aggregation" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectLabel>Allowed aggregations</SelectLabel>
                                    {(schema?.aggregations ?? ["count"]).map((option) => (
                                      <SelectItem key={option} value={option}>
                                        {humanizeReportField(option)}
                                      </SelectItem>
                                    ))}
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            )}
                          />
                          {errors.metrics?.[index]?.aggregation && (
                            <p className="text-sm text-destructive">
                              {errors.metrics[index]?.aggregation?.message}
                            </p>
                          )}
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor={`metrics.${index}.alias`}>Alias</Label>
                          <Input
                            id={`metrics.${index}.alias`}
                            placeholder="Optional alias"
                            disabled={schemaLoading}
                            {...register(`metrics.${index}.alias` as const)}
                          />
                          {errors.metrics?.[index]?.alias && (
                            <p className="text-sm text-destructive">
                              {errors.metrics[index]?.alias?.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {errors.metrics && !Array.isArray(errors.metrics) && (
                  <p className="text-sm text-destructive">{errors.metrics.message}</p>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || schemaLoading}>
              {isSubmitting ? "Loading..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CatalogForm;