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
import { Plus, Trash2, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm, useWatch, type Control, type FieldErrors, type UseFormRegister } from "react-hook-form";

export interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CatalogFormData) => void;
  initialData?: Partial<CatalogFormData> | null;
}

// ── Entity definitions ──────────────────────────────────────────────────────
// Maps each entity to the dimension + metric field prefixes / names it owns.
// These must be substrings of the actual schema field names returned by the API.
const ENTITIES = [
  {
    key: "bookings",
    label: "Bookings",
    color: "bg-blue-100 text-blue-700 border-blue-200",
    dimPatterns: ["date", "status", "payment_mode", "nights", "booking_count"],
    metricPatterns: ["booking", "revenue", "avg_booking", "min_booking", "max_booking", "nights"],
  },
  {
    key: "apartments",
    label: "Apartments",
    color: "bg-violet-100 text-violet-700 border-violet-200",
    dimPatterns: ["apartment"],
    metricPatterns: ["apartment", "occupancy", "adr", "revpar", "available"],
  },
  {
    key: "hosts",
    label: "Hosts",
    color: "bg-orange-100 text-orange-700 border-orange-200",
    dimPatterns: ["host", "landlord"],
    metricPatterns: ["host", "landlord"],
  },
  {
    key: "guests",
    label: "Guests",
    color: "bg-emerald-100 text-emerald-700 border-emerald-200",
    dimPatterns: ["tenant", "guest", "nationality", "user"],
    metricPatterns: ["tenant", "guest", "user", "unique_tenant", "unique_paid"],
  },
  {
    key: "payments",
    label: "Payments",
    color: "bg-green-100 text-green-700 border-green-200",
    dimPatterns: ["payment", "deposit", "balance"],
    metricPatterns: ["revenue", "deposit", "balance", "refund", "payment"],
  },
  {
    key: "reviews",
    label: "Reviews",
    color: "bg-yellow-100 text-yellow-700 border-yellow-200",
    dimPatterns: ["review", "rating"],
    metricPatterns: ["review", "rating", "star", "response_rate"],
  },
  {
    key: "subscriptions",
    label: "Subscriptions",
    color: "bg-pink-100 text-pink-700 border-pink-200",
    dimPatterns: ["subscription", "plan"],
    metricPatterns: ["subscription", "churn"],
  },
] as const;

type EntityKey = (typeof ENTITIES)[number]["key"];

function fieldBelongsToEntity(field: string, entity: (typeof ENTITIES)[number]): boolean {
  const f = field.toLowerCase();
  return entity.dimPatterns.some((p) => f.includes(p)) ||
    entity.metricPatterns.some((p) => f.includes(p));
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
    if (current.some((d) => d.field === dimensionField)) return current;
    return [...current, { field: dimensionField, alias: dimensionField }];
  }
  return current.filter((d) => d.field !== dimensionField);
};

const AGG_PREFIX_RE = /^(avg|sum|count|min|max|pct|distinct_count|distinct)_/i;
const IMPLICIT_PRE_AGG = new Set(["adr", "revpar", "occupancy_percent", "response_rate", "five_star_review_percent", "one_star_review_percent", "subscription_churn_rate"]);
const isPreAggregated = (field: string) => AGG_PREFIX_RE.test(field) || IMPLICIT_PRE_AGG.has(field);

interface MetricRowProps {
  index: number;
  control: Control<CatalogFormData>;
  register: UseFormRegister<CatalogFormData>;
  errors: FieldErrors<CatalogFormData>;
  schema: ReportSchema | null;
  schemaLoading: boolean;
  visibleMetrics: string[];
  allMetrics: string[];
  selectedEntities: EntityKey[];
  canRemove: boolean;
  onRemove: () => void;
}

function MetricRow({ index, control, register, errors, schema, schemaLoading, visibleMetrics, allMetrics, selectedEntities, canRemove, onRemove }: MetricRowProps) {
  const selectedField = useWatch({ control, name: `metrics.${index}.field` });
  const preAggregated = isPreAggregated(selectedField ?? "");

  return (
    <div className="grid gap-3 rounded-lg border bg-background p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium">Metric {index + 1}</p>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onRemove}
          disabled={!canRemove || schemaLoading}
          className="gap-2 text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
          Remove
        </Button>
      </div>

      <div className="grid gap-3 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)]">
        <div className="grid gap-2">
          <Label>Field</Label>
          <Controller
            control={control}
            name={`metrics.${index}.field`}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange} disabled={schemaLoading}>
                <SelectTrigger>
                  <SelectValue placeholder="Select metric field" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>
                      {visibleMetrics.length > 0 && selectedEntities.length > 0
                        ? "Filtered metric fields"
                        : "All metric fields"}
                    </SelectLabel>
                    {(visibleMetrics.length > 0 ? visibleMetrics : allMetrics).map((option) => (
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
            <p className="text-sm text-destructive">{errors.metrics[index]?.field?.message}</p>
          )}
        </div>

        <div className="grid gap-2">
          <Label>Aggregation</Label>
          {preAggregated ? (
            <div className="flex h-9 items-center rounded-md border border-slate-200 bg-slate-50 px-3">
              <span className="text-xs text-slate-400 italic">Built-in (field pre-aggregated)</span>
            </div>
          ) : (
            <Controller
              control={control}
              name={`metrics.${index}.aggregation`}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange} disabled={schemaLoading}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select aggregation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Aggregations</SelectLabel>
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
          )}
          {errors.metrics?.[index]?.aggregation && (
            <p className="text-sm text-destructive">{errors.metrics[index]?.aggregation?.message}</p>
          )}
        </div>

        <div className="grid gap-2">
          <Label>Alias</Label>
          <Input
            placeholder="Optional alias"
            disabled={schemaLoading}
            {...register(`metrics.${index}.alias` as const)}
          />
          {errors.metrics?.[index]?.alias && (
            <p className="text-sm text-destructive">{errors.metrics[index]?.alias?.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}

function CatalogForm({ isOpen, onClose, onSubmit, initialData }: Props) {
  const [schema, setSchema] = useState<ReportSchema | null>(null);
  const [schemaLoading, setSchemaLoading] = useState(false);
  const [schemaError, setSchemaError] = useState<string | null>(null);
  const [selectedEntities, setSelectedEntities] = useState<EntityKey[]>([]);
  const [fieldSearch, setFieldSearch] = useState("");

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
  } = useFieldArray({ control, name: "metrics" });

  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;

    const loadSchema = async () => {
      setSchemaLoading(true);
      setSchemaError(null);
      try {
        const nextSchema = await getDefaultSchema();
        if (cancelled) return;
        setSchema(nextSchema);

        if (initialData) {
          reset({
            name: initialData.name ?? "",
            category: initialData.category ?? "",
            type: (initialData.type as string) ?? "custom",
            description: initialData.description ?? "",
            isActive: initialData.isActive ?? true,
            dimensions: initialData.dimensions ?? [],
            metrics:
              initialData.metrics && initialData.metrics.length > 0
                ? initialData.metrics
                : [createMetricRow(nextSchema)],
          });
        } else {
          reset({
            name: "",
            category: "",
            type: "custom",
            description: "",
            isActive: true,
            dimensions: [],
            metrics: [createMetricRow(nextSchema)],
          });
        }
      } catch {
        if (!cancelled) {
          setSchemaError("Failed to load report schema options.");
          setSchema({ dimensions: [], metricFields: ["booking_count"], aggregations: ["count"], operators: [] });
          reset({
            name: initialData?.name ?? "",
            category: initialData?.category ?? "",
            type: (initialData?.type as string) ?? "custom",
            description: initialData?.description ?? "",
            isActive: initialData?.isActive ?? true,
            dimensions: initialData?.dimensions ?? [],
            metrics: initialData?.metrics ?? [createMetricRow()],
          });
        }
      } finally {
        if (!cancelled) setSchemaLoading(false);
      }
    };

    void loadSchema();
    return () => { cancelled = true; };
  }, [isOpen, reset, initialData]);

  // Reset entity filter when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedEntities([]);
      setFieldSearch("");
    }
  }, [isOpen]);

  const handleFormSubmit = async (data: CatalogFormData) => {
    try {
      await onSubmit(data);
      reset();
      onClose();
    } catch {
      // parent handles error
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const toggleEntity = (key: EntityKey) =>
    setSelectedEntities((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );

  // Compute which schema fields are visible based on selected entities + search
  const allDimensions = schema?.dimensions ?? [];
  const allMetrics = schema?.metricFields ?? [];

  const visibleDimensions = allDimensions.filter((f) => {
    const matchesEntity =
      selectedEntities.length === 0 ||
      ENTITIES.filter((e) => selectedEntities.includes(e.key)).some((e) =>
        fieldBelongsToEntity(f, e)
      );
    const matchesSearch =
      !fieldSearch ||
      humanizeReportField(f).toLowerCase().includes(fieldSearch.toLowerCase()) ||
      f.toLowerCase().includes(fieldSearch.toLowerCase());
    return matchesEntity && matchesSearch;
  });

  const visibleMetrics = allMetrics.filter((f) => {
    const matchesEntity =
      selectedEntities.length === 0 ||
      ENTITIES.filter((e) => selectedEntities.includes(e.key)).some((e) =>
        fieldBelongsToEntity(f, e)
      );
    const matchesSearch =
      !fieldSearch ||
      humanizeReportField(f).toLowerCase().includes(fieldSearch.toLowerCase()) ||
      f.toLowerCase().includes(fieldSearch.toLowerCase());
    return matchesEntity && matchesSearch;
  });

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit report" : "Create report"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="grid gap-4 py-4">
            {/* Name */}
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Enter report name" {...register("name")} />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>

            {/* Category */}
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Input id="category" placeholder="e.g. revenue, booking, booking_status" {...register("category")} />
              {errors.category && <p className="text-sm text-destructive">{errors.category.message}</p>}
            </div>

            {/* Description */}
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input id="description" placeholder="Enter description" {...register("description")} />
              {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
            </div>

            {/* Active */}
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
            </div>

            {/* ── Data Sources & Fields ── */}
            <div className="rounded-lg border bg-muted/20 p-4 space-y-4">
              <div>
                <p className="text-sm font-semibold text-slate-800">Data Sources & Fields</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Choose entities to filter available fields, then check the fields you want.
                </p>
              </div>

              {/* Entity chips */}
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-500">Data Sources</Label>
                <div className="flex flex-wrap gap-2">
                  {ENTITIES.map((entity) => {
                    const active = selectedEntities.includes(entity.key);
                    return (
                      <button
                        key={entity.key}
                        type="button"
                        onClick={() => toggleEntity(entity.key)}
                        className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                          active
                            ? entity.color + " shadow-sm"
                            : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                        }`}
                      >
                        {entity.label}
                      </button>
                    );
                  })}
                </div>
                {selectedEntities.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setSelectedEntities([])}
                    className="text-xs text-slate-400 hover:text-slate-600 underline"
                  >
                    Clear filters
                  </button>
                )}
              </div>

              {/* Field search */}
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <Input
                  placeholder="Search fields..."
                  value={fieldSearch}
                  onChange={(e) => setFieldSearch(e.target.value)}
                  className="h-8 pl-8 text-sm"
                />
              </div>

              {schemaError && <p className="text-sm text-destructive">{schemaError}</p>}

              {/* Dimensions checklist */}
              <Controller
                control={control}
                name="dimensions"
                render={({ field }) => {
                  const selected = field.value ?? [];
                  return (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs text-slate-500">
                          Dimensions
                          {visibleDimensions.length > 0 && (
                            <span className="ml-1 text-slate-400">({visibleDimensions.length})</span>
                          )}
                        </Label>
                        {selected.length > 0 && (
                          <span className="text-xs text-blue-600 font-medium">
                            {selected.length} selected
                          </span>
                        )}
                      </div>

                      {schemaLoading ? (
                        <div className="space-y-1.5">
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="h-8 animate-pulse rounded-md bg-slate-100" />
                          ))}
                        </div>
                      ) : visibleDimensions.length === 0 ? (
                        <p className="text-xs text-slate-400 py-1">
                          {allDimensions.length === 0
                            ? "No schema options available."
                            : "No dimensions match the selected filters."}
                        </p>
                      ) : (
                        <div className="max-h-44 overflow-y-auto rounded-md border border-slate-200 bg-white divide-y divide-slate-50">
                          {visibleDimensions.map((dimField) => {
                            const checked = selected.some((d) => d.field === dimField);
                            const entityLabel = ENTITIES.find((e) =>
                              fieldBelongsToEntity(dimField, e)
                            )?.label;
                            return (
                              <label
                                key={dimField}
                                className="flex cursor-pointer items-center gap-3 px-3 py-2 hover:bg-slate-50"
                              >
                                <Checkbox
                                  checked={checked}
                                  disabled={schemaLoading}
                                  onCheckedChange={(v) =>
                                    field.onChange(
                                      toggleDimensionValue(selected, dimField, v === true)
                                    )
                                  }
                                />
                                <span className="flex-1 text-sm text-slate-700">
                                  {humanizeReportField(dimField)}
                                </span>
                                {entityLabel && (
                                  <span className="text-[10px] text-slate-400">{entityLabel}</span>
                                )}
                              </label>
                            );
                          })}
                        </div>
                      )}

                      {/* Selected dimension chips */}
                      {selected.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {selected.map((d) => (
                            <Badge
                              key={d.field}
                              variant="secondary"
                              className="cursor-pointer gap-1 bg-purple-100 text-purple-700 hover:bg-purple-200"
                              onClick={() =>
                                field.onChange(toggleDimensionValue(selected, d.field, false))
                              }
                            >
                              {humanizeReportField(d.alias ?? d.field)}
                              <span className="text-purple-400">×</span>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }}
              />

              <Separator />

              {/* Metrics */}
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <Label>Metrics</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => appendMetric(createMetricRow(schema))}
                    disabled={schemaLoading}
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add metric
                  </Button>
                </div>

                {/* Visible metrics hint */}
                {visibleMetrics.length < allMetrics.length && (
                  <p className="text-xs text-slate-400">
                    Showing {visibleMetrics.length} of {allMetrics.length} metric fields based on selected entities.
                  </p>
                )}

                <div className="space-y-3">
                  {metricFields.map((metricField, index) => (
                    <MetricRow
                      key={metricField.id}
                      index={index}
                      control={control}
                      register={register}
                      errors={errors}
                      schema={schema}
                      schemaLoading={schemaLoading}
                      visibleMetrics={visibleMetrics}
                      allMetrics={allMetrics}
                      selectedEntities={selectedEntities}
                      canRemove={metricFields.length > 1}
                      onRemove={() => removeMetric(index)}
                    />
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
              {isSubmitting ? "Saving..." : initialData ? "Save" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CatalogForm;
