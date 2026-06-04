import { useId } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, Filter } from "lucide-react";

/* ─── types ─── */

export interface FilterField {
  key: string;
  label: string;
  target: "dimension" | "metric";
  dataType: "string" | "number" | "date";
}

export type FilterOperator = "eq" | "ne" | "gt" | "gte" | "lt" | "lte" | "in" | "between" | "contains";

export interface FilterRow {
  id: string;
  field: string;
  operator: FilterOperator;
  value: string;
  valueTo: string;   // second bound for "between"
  values: string[];  // tag list for "in"
  valueTag: string;  // current input for tag list
}

/* ─── operator metadata ─── */

interface OperatorMeta { label: string; inputMode: "single" | "between" | "tags" }

const OPERATOR_META: Record<FilterOperator, OperatorMeta> = {
  eq:       { label: "equals",             inputMode: "single" },
  ne:       { label: "not equals",         inputMode: "single" },
  contains: { label: "contains",           inputMode: "single" },
  gt:       { label: "greater than",       inputMode: "single" },
  gte:      { label: "greater than or eq", inputMode: "single" },
  lt:       { label: "less than",          inputMode: "single" },
  lte:      { label: "less than or eq",    inputMode: "single" },
  between:  { label: "between",            inputMode: "between" },
  in:       { label: "is one of",          inputMode: "tags" },
};

function operatorsFor(dt: FilterField["dataType"]): FilterOperator[] {
  if (dt === "string") return ["eq", "ne", "contains", "in"];
  if (dt === "number") return ["eq", "ne", "gt", "gte", "lt", "lte", "between", "in"];
  // date
  return ["eq", "ne", "gt", "gte", "lt", "lte", "between"];
}

// function defaultOperator(dt: FilterField["dataType"]): FilterOperator {
//   return dt === "string" ? "eq" : "eq";
// }

/* ─── serialise to backend shape ─── */

export interface BackendFilter {
  target: "dimension" | "metric";
  field: string;
  operator: FilterOperator;
  value?: string;
  values?: string[];
}

export function toBackendFilters(rows: FilterRow[], fields: FilterField[]): BackendFilter[] {
  return rows
    .filter((r) => r.field) // skip empty rows
    .map((r) => {
      const field = fields.find((f) => f.key === r.field);
      const target = field?.target ?? "dimension";
      const meta = OPERATOR_META[r.operator];
      if (meta.inputMode === "between") {
        return { target, field: r.field, operator: r.operator, values: [r.value, r.valueTo].filter(Boolean) };
      }
      if (meta.inputMode === "tags") {
        const all = [...r.values, ...(r.valueTag.trim() ? [r.valueTag.trim()] : [])];
        return { target, field: r.field, operator: r.operator, values: all };
      }
      return { target, field: r.field, operator: r.operator, value: r.value };
    })
    .filter((f) => {
      // drop filters that have no value set
      const meta = OPERATOR_META[f.operator];
      if (meta.inputMode === "between") return (f.values?.length ?? 0) >= 1;
      if (meta.inputMode === "tags") return (f.values?.length ?? 0) > 0;
      return Boolean(f.value);
    }) as BackendFilter[];
}

/* ─── helpers ─── */

function newRow(): FilterRow {
  return { id: crypto.randomUUID(), field: "", operator: "eq", value: "", valueTo: "", values: [], valueTag: "" };
}

/* ─── sub-components ─── */

function TagInput({
  tags,
  draft,
  onDraftChange,
  onAdd,
  onRemove,
  inputType,
}: {
  tags: string[];
  draft: string;
  onDraftChange: (v: string) => void;
  onAdd: () => void;
  onRemove: (i: number) => void;
  inputType: string;
}) {
  return (
    <div className="flex flex-wrap gap-1.5 rounded-lg border border-gray-300 p-1.5 min-h-[36px] bg-white focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
      {tags.map((t, i) => (
        <span key={i} className="inline-flex items-center gap-1 rounded-md bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
          {t}
          <button type="button" onClick={() => onRemove(i)} className="text-blue-500 hover:text-blue-800">×</button>
        </span>
      ))}
      <input
        type={inputType}
        value={draft}
        onChange={(e) => onDraftChange(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); onAdd(); } }}
        placeholder="Type and press Enter"
        className="flex-1 min-w-20 border-0 outline-none text-sm text-gray-800 bg-transparent px-1"
      />
    </div>
  );
}

/* ─── main component ─── */

export interface ReportFilterBuilderProps {
  fields: FilterField[];
  filters: FilterRow[];
  onChange: (filters: FilterRow[]) => void;
}

export default function ReportFilterBuilder({ fields, filters, onChange }: ReportFilterBuilderProps) {
  const uid = useId();
  const activeCount = filters.filter((r) => r.field).length;

  function add() {
    onChange([...filters, newRow()]);
  }

  function remove(id: string) {
    onChange(filters.filter((r) => r.id !== id));
  }

  function update(id: string, patch: Partial<FilterRow>) {
    onChange(filters.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  function changeField(id: string, fieldKey: string) {
    const field = fields.find((f) => f.key === fieldKey);
    const dt = field?.dataType ?? "string";
    const ops = operatorsFor(dt);
    const op = ops[0];
    update(id, { field: fieldKey, operator: op, value: "", valueTo: "", values: [], valueTag: "" });
  }

  function changeOperator(id: string, op: FilterOperator) {
    update(id, { operator: op, value: "", valueTo: "", values: [], valueTag: "" });
  }

  return (
    <div className="space-y-3">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-3.5 w-3.5 text-gray-400" />
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            Filters
          </p>
          {activeCount > 0 && (
            <span className="rounded-full bg-blue-100 px-1.5 py-0.5 text-[11px] font-semibold text-blue-700">
              {activeCount}
            </span>
          )}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={add}
          className="h-7 gap-1.5 text-xs border-dashed border-gray-300 text-gray-500 hover:border-blue-400 hover:text-blue-600"
        >
          <Plus className="h-3 w-3" />
          Add Filter
        </Button>
      </div>

      {/* AND badge */}
      {filters.length > 1 && (
        <p className="text-[11px] text-gray-400 flex items-center gap-1.5">
          <span className="inline-block rounded border border-gray-300 bg-gray-100 px-1.5 py-0.5 font-mono text-[10px] font-bold text-gray-600">AND</span>
          All active filters must match
        </p>
      )}

      {filters.length === 0 && (
        <p className="text-xs text-gray-400 py-1">No filters applied — all data will be included.</p>
      )}

      {/* Filter rows */}
      <div className="space-y-2">
        {filters.map((row, idx) => {
          const field = fields.find((f) => f.key === row.field);
          const dt = field?.dataType ?? "string";
          const ops = operatorsFor(dt);
          const meta = row.operator ? OPERATOR_META[row.operator] : null;
          const inputType = dt === "date" ? "date" : dt === "number" ? "number" : "text";

          return (
            <div key={row.id} className="flex flex-wrap items-start gap-2 rounded-lg border border-gray-200 bg-gray-50 p-2.5">
              {/* Row counter */}
              <span className="mt-2 text-[11px] font-mono text-gray-300 w-4 shrink-0 text-right">{idx + 1}</span>

              {/* Field */}
              <Select value={row.field} onValueChange={(v) => changeField(row.id, v)}>
                <SelectTrigger id={`${uid}-field-${row.id}`} className="h-8 w-44 text-xs border-gray-300 bg-white">
                  <SelectValue placeholder="Select field…" />
                </SelectTrigger>
                <SelectContent>
                  {fields.length === 0 && (
                    <SelectItem value="__none" disabled>No fields available</SelectItem>
                  )}
                  {fields.filter((f) => f.target === "dimension").length > 0 && (
                    <>
                      <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400">Dimensions</div>
                      {fields.filter((f) => f.target === "dimension").map((f) => (
                        <SelectItem key={f.key} value={f.key}>{f.label}</SelectItem>
                      ))}
                    </>
                  )}
                  {fields.filter((f) => f.target === "metric").length > 0 && (
                    <>
                      <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400">Metrics</div>
                      {fields.filter((f) => f.target === "metric").map((f) => (
                        <SelectItem key={f.key} value={f.key}>{f.label}</SelectItem>
                      ))}
                    </>
                  )}
                </SelectContent>
              </Select>

              {/* Operator */}
              {row.field && (
                <Select value={row.operator} onValueChange={(v) => changeOperator(row.id, v as FilterOperator)}>
                  <SelectTrigger className="h-8 w-40 text-xs border-gray-300 bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ops.map((op) => (
                      <SelectItem key={op} value={op}>{OPERATOR_META[op].label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {/* Value input(s) */}
              {row.field && meta && (
                <div className="flex flex-1 min-w-40 items-center gap-1.5">
                  {meta.inputMode === "between" ? (
                    <>
                      <input
                        type={inputType}
                        value={row.value}
                        onChange={(e) => update(row.id, { value: e.target.value })}
                        placeholder="From"
                        className="w-28 h-8 rounded-lg border border-gray-300 bg-white px-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <span className="text-xs text-gray-400">–</span>
                      <input
                        type={inputType}
                        value={row.valueTo}
                        onChange={(e) => update(row.id, { valueTo: e.target.value })}
                        placeholder="To"
                        className="w-28 h-8 rounded-lg border border-gray-300 bg-white px-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </>
                  ) : meta.inputMode === "tags" ? (
                    <div className="flex-1">
                      <TagInput
                        tags={row.values}
                        draft={row.valueTag}
                        inputType={inputType}
                        onDraftChange={(v) => update(row.id, { valueTag: v })}
                        onAdd={() => {
                          const v = row.valueTag.trim();
                          if (v && !row.values.includes(v)) {
                            update(row.id, { values: [...row.values, v], valueTag: "" });
                          }
                        }}
                        onRemove={(i) => update(row.id, { values: row.values.filter((_, j) => j !== i) })}
                      />
                    </div>
                  ) : (
                    <input
                      type={inputType}
                      value={row.value}
                      onChange={(e) => update(row.id, { value: e.target.value })}
                      placeholder="Value"
                      className="flex-1 min-w-32 h-8 rounded-lg border border-gray-300 bg-white px-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  )}
                </div>
              )}

              {/* Remove */}
              <button
                type="button"
                onClick={() => remove(row.id)}
                className="mt-1 shrink-0 rounded-md p-1 text-gray-300 hover:bg-red-50 hover:text-red-500 transition-colors"
                title="Remove filter"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
