import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { humanizeReportField } from "@/utils/reportLabels";
import { applyRangePreset, type RangePreset } from "@/utils/datePresets";
import {
  CalendarDays,
  Filter,
  Plus,
  RotateCcw,
  Trash2,
  ChevronDown,
  Layers,
  Play,
} from "lucide-react";

export interface FilterRow {
  id: string;
  field: string;
  operator: string;
  value: string;
}

export interface ReportBuilderState {
  from: string;
  to: string;
  selectedDimensions: string[];
  selectedMetrics: string[];
  filters: FilterRow[];
  filterLogic: "AND" | "OR";
  groupBy: string;
  aggregations: string[];
}

interface Props {
  state: ReportBuilderState;
  onChange: (next: ReportBuilderState) => void;
  onRun: () => void;
  onReset: () => void;
  loading: boolean;
  reportDimensions: string[];
  reportMetrics: string[];
  reportSelected: boolean;
}

const DATE_PRESETS: { label: string; value: RangePreset }[] = [
  { label: "Today", value: "this_day" },
  { label: "Last 7 Days", value: "last_week" },
  { label: "Last 30 Days", value: "last_30_days" },
  { label: "This Month", value: "this_month" },
  { label: "Last Month", value: "last_month" },
  { label: "This Year", value: "this_year" },
];

const OPERATORS = [
  { value: "eq", label: "Equals" },
  { value: "neq", label: "Not equals" },
  { value: "contains", label: "Contains" },
  { value: "gt", label: ">" },
  { value: "gte", label: ">=" },
  { value: "lt", label: "<" },
  { value: "lte", label: "<=" },
  { value: "between", label: "Between" },
  { value: "in", label: "In (CSV)" },
];

const AGGREGATION_OPTIONS = [
  { value: "count", label: "Count" },
  { value: "sum", label: "Sum" },
  { value: "avg", label: "Average" },
  { value: "pct", label: "Percentage" },
];

const NO_GROUP = "__none__";

let filterIdCounter = 0;
const newFilterId = () => `f_${++filterIdCounter}`;

export default function ReportBuilderPanel({
  state,
  onChange,
  onRun,
  onReset,
  loading,
  reportDimensions,
  reportMetrics,
  reportSelected,
}: Props) {
  const [activePreset, setActivePreset] = useState<RangePreset | "custom">("last_30_days");

  const set = (patch: Partial<ReportBuilderState>) => onChange({ ...state, ...patch });

  const applyPreset = (preset: RangePreset) => {
    const range = applyRangePreset(preset);
    setActivePreset(preset);
    set({ from: range.from, to: range.to });
  };

  const toggleAggregation = (agg: string) => {
    const next = state.aggregations.includes(agg)
      ? state.aggregations.filter((a) => a !== agg)
      : [...state.aggregations, agg];
    set({ aggregations: next });
  };

  const addFilter = () => {
    const defaultField = reportDimensions[0] ?? reportMetrics[0] ?? "";
    set({
      filters: [...state.filters, { id: newFilterId(), field: defaultField, operator: "eq", value: "" }],
    });
  };

  const updateFilter = (id: string, patch: Partial<FilterRow>) =>
    set({ filters: state.filters.map((f) => (f.id === id ? { ...f, ...patch } : f)) });

  const removeFilter = (id: string) =>
    set({ filters: state.filters.filter((f) => f.id !== id) });

  const hasReport = reportSelected;

  const filterableFields = [
    ...reportDimensions.map((f) => ({ field: f, type: "dim" as const })),
    ...reportMetrics.map((f) => ({ field: f, type: "metric" as const })),
  ];

  // Label for the date trigger button
  const dateTriggerLabel =
    state.from && state.to
      ? `${state.from} → ${state.to}`
      : activePreset !== "custom"
      ? DATE_PRESETS.find((p) => p.value === activePreset)?.label ?? "Date Range"
      : "Date Range";

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Horizontal toolbar */}
      <div className="flex flex-wrap items-center gap-2 px-4 py-3">

        {/* ── Date Range popover ── */}
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              <CalendarDays className="h-3.5 w-3.5 text-blue-500" />
              {dateTriggerLabel}
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4" align="start">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Date Range</p>
            <div className="mb-3 flex flex-wrap gap-1.5">
              {DATE_PRESETS.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => applyPreset(p.value)}
                  className={`rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${
                    activePreset === p.value
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-blue-50"
                  }`}
                >
                  {p.label}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setActivePreset("custom")}
                className={`rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${
                  activePreset === "custom"
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-blue-50"
                }`}
              >
                Custom
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-xs text-slate-500">From</Label>
                <Input
                  type="date"
                  value={state.from}
                  onChange={(e) => { setActivePreset("custom"); set({ from: e.target.value }); }}
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-slate-500">To</Label>
                <Input
                  type="date"
                  value={state.to}
                  onChange={(e) => { setActivePreset("custom"); set({ to: e.target.value }); }}
                  className="h-8 text-xs"
                />
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* ── Filters popover ── */}
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              className={`flex h-8 items-center gap-1.5 rounded-lg border px-3 text-xs font-medium transition-colors ${
                state.filters.length > 0
                  ? "border-blue-400 bg-blue-50 text-blue-700"
                  : "border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50"
              }`}
            >
              <Filter className="h-3.5 w-3.5" />
              Filters
              {state.filters.length > 0 && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                  {state.filters.length}
                </span>
              )}
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-[520px] p-4" align="start">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Filters</p>
              {state.filters.length > 1 && (
                <div className="flex gap-1">
                  {(["AND", "OR"] as const).map((logic) => (
                    <button
                      key={logic}
                      type="button"
                      onClick={() => set({ filterLogic: logic })}
                      className={`rounded border px-2.5 py-0.5 text-xs font-semibold ${
                        state.filterLogic === logic
                          ? "border-blue-600 bg-blue-600 text-white"
                          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {logic}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {!hasReport && (
              <p className="mb-3 rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-600">
                Select a report from the catalog to enable filters.
              </p>
            )}

            <div className="space-y-2">
              {state.filters.map((filter) => (
                <div
                  key={filter.id}
                  className="grid grid-cols-[1fr_auto_1fr_auto] gap-1.5 items-center"
                >
                  <Select
                    value={filter.field}
                    onValueChange={(v) => updateFilter(filter.id, { field: v })}
                    disabled={!hasReport}
                  >
                    <SelectTrigger className="h-7 text-xs">
                      <SelectValue placeholder="Field" />
                    </SelectTrigger>
                    <SelectContent>
                      {filterableFields.length > 0 ? (
                        filterableFields.map(({ field, type }) => (
                          <SelectItem key={field} value={field} className="text-xs">
                            <span className="flex items-center gap-1.5">
                              <span
                                className={`rounded px-1 text-[9px] font-semibold ${
                                  type === "dim"
                                    ? "bg-purple-100 text-purple-600"
                                    : "bg-emerald-100 text-emerald-600"
                                }`}
                              >
                                {type}
                              </span>
                              {humanizeReportField(field)}
                            </span>
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="__empty__" disabled className="text-xs text-slate-400">
                          No fields available
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>

                  <Select
                    value={filter.operator}
                    onValueChange={(v) => updateFilter(filter.id, { operator: v })}
                  >
                    <SelectTrigger className="h-7 w-24 text-xs">
                      <SelectValue placeholder="Op" />
                    </SelectTrigger>
                    <SelectContent>
                      {OPERATORS.map((op) => (
                        <SelectItem key={op.value} value={op.value} className="text-xs">
                          {op.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Input
                    value={filter.value}
                    onChange={(e) => updateFilter(filter.id, { value: e.target.value })}
                    placeholder="Value"
                    className="h-7 text-xs"
                  />

                  <button
                    type="button"
                    onClick={() => removeFilter(filter.id)}
                    className="flex h-7 w-7 items-center justify-center rounded text-slate-400 hover:bg-red-50 hover:text-red-500"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addFilter}
              disabled={!hasReport}
              className="mt-3 w-full gap-1.5 text-xs"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Filter
            </Button>
          </PopoverContent>
        </Popover>

        {/* ── Grouping & Calculations popover ── */}
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              className={`flex h-8 items-center gap-1.5 rounded-lg border px-3 text-xs font-medium transition-colors ${
                state.groupBy || state.aggregations.length > 0
                  ? "border-violet-400 bg-violet-50 text-violet-700"
                  : "border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50"
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              Grouping
              {(state.groupBy || state.aggregations.length > 0) && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-violet-600 text-[10px] font-bold text-white">
                  {(state.groupBy ? 1 : 0) + state.aggregations.length}
                </span>
              )}
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-4" align="start">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Grouping & Calculations
            </p>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-500">Group By</Label>
                <Select
                  value={state.groupBy || NO_GROUP}
                  onValueChange={(v) => set({ groupBy: v === NO_GROUP ? "" : v })}
                >
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue placeholder="No grouping" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={NO_GROUP}>None</SelectItem>
                    {reportDimensions.map((d) => (
                      <SelectItem key={d} value={d}>
                        {humanizeReportField(d)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {!hasReport && (
                  <p className="text-xs text-slate-400">Select a report to see options.</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-slate-500">Calculations</Label>
                <div className="grid grid-cols-2 gap-1.5">
                  {AGGREGATION_OPTIONS.map((agg) => (
                    <label
                      key={agg.value}
                      className="flex cursor-pointer items-center gap-2 rounded-md border border-slate-200 px-2.5 py-1.5 hover:bg-slate-50"
                    >
                      <Checkbox
                        checked={state.aggregations.includes(agg.value)}
                        onCheckedChange={() => toggleAggregation(agg.value)}
                      />
                      <span className="text-xs text-slate-700">{agg.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Spacer */}
        <div className="flex-1" />

        {/* ── Reset ── */}
        <button
          type="button"
          onClick={onReset}
          className="flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-500 hover:bg-slate-50 transition-colors"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </button>

        {/* ── Generate ── */}
        <Button
          onClick={onRun}
          disabled={loading || !hasReport}
          className="h-8 gap-1.5 bg-blue-600 px-4 text-xs font-semibold text-white hover:bg-blue-700"
        >
          {loading ? (
            <>
              <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Generating…
            </>
          ) : (
            <>
              <Play className="h-3.5 w-3.5" />
              Generate Report
            </>
          )}
        </Button>
      </div>

      {/* Active filter chips summary */}
      {(state.filters.length > 0 || state.groupBy || state.aggregations.length > 0) && (
        <div className="flex flex-wrap gap-1.5 border-t border-slate-100 px-4 py-2">
          {state.filters.map((f, i) => (
            <span
              key={f.id}
              className="flex items-center gap-1 rounded-full bg-blue-50 border border-blue-200 px-2.5 py-0.5 text-xs text-blue-700"
            >
              {i > 0 && (
                <span className="text-[10px] font-bold text-blue-400 mr-0.5">
                  {state.filterLogic}
                </span>
              )}
              {humanizeReportField(f.field)} {f.operator} {f.value || "…"}
              <button
                type="button"
                onClick={() => removeFilter(f.id)}
                className="text-blue-400 hover:text-blue-600"
              >
                ×
              </button>
            </span>
          ))}
          {state.groupBy && (
            <span className="flex items-center gap-1 rounded-full bg-violet-50 border border-violet-200 px-2.5 py-0.5 text-xs text-violet-700">
              Group: {humanizeReportField(state.groupBy)}
              <button
                type="button"
                onClick={() => set({ groupBy: "" })}
                className="text-violet-400 hover:text-violet-600"
              >
                ×
              </button>
            </span>
          )}
          {state.aggregations.map((agg) => (
            <span
              key={agg}
              className="flex items-center gap-1 rounded-full bg-violet-50 border border-violet-200 px-2.5 py-0.5 text-xs text-violet-700"
            >
              {AGGREGATION_OPTIONS.find((a) => a.value === agg)?.label ?? agg}
              <button
                type="button"
                onClick={() => toggleAggregation(agg)}
                className="text-violet-400 hover:text-violet-600"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
