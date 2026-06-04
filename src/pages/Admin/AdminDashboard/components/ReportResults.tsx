import React, { useState, useMemo } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Table as TableIcon,
  BarChart2,
  TrendingUp,
  TrendingDown,
  Minus,
  PieChart as PieChartIcon,
  BanknoteArrowUp,
  ChartNoAxesColumnIncreasing,
  Percent,
  Hash,
  Download,
  CheckCircle2,
  GripVertical,
  Info,
  Loader2,
  ArrowLeftRight,
} from "lucide-react";
import { humanizeReportField } from "@/utils/reportLabels";

/* ─────────────────── types ─────────────────── */

type ChartType = "bar" | "line" | "pie";
type ViewMode = "table" | "chart" | "comparison";

type ComparisonPeriod = "none" | "wow" | "mom" | "qoq" | "yoy";

interface ColDef {
  id: string;
  key: string;
  label: string;
  kind: "dim" | "metric";
  tooltip: string;
}

/* ─────────────────── constants ─────────────────── */

const CHART_COLORS = [
  "#3b82f6", "#10b981", "#f59e0b", "#ef4444",
  "#8b5cf6", "#06b6d4", "#f97316", "#84cc16",
];

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

const FIELD_TOOLTIPS: Record<string, string> = {
  date: "Calendar date of the record",
  week: "ISO week period",
  month: "Calendar month period",
  quarter: "Calendar quarter period",
  year: "Calendar year period",
  status: "Booking lifecycle status (Pending, Confirmed, Paid, etc.)",
  payment_mode: "Whether payment was full or partial deposit",
  apartment_id: "Internal ID of the apartment",
  apartment_name: "Display name of the apartment listing",
  tenant_id: "Internal ID of the tenant",
  tenant_name: "Full name of the tenant",
  nights: "Number of booked nights",
  booking_count: "Total number of bookings in this period",
  total_revenue: "Sum of all revenue collected (VND)",
  avg_booking_value: "Average revenue per booking (VND)",
  occupancy_percent: "Percentage of nights booked vs. available",
  adr: "Average Daily Rate — revenue ÷ booked nights (VND)",
  review_avg_rating: "Mean star rating from guest reviews",
  review_count: "Number of guest reviews submitted",
  unique_tenant_count: "Number of distinct tenants who booked",
  unique_apartment_count: "Number of distinct apartments booked",
};

const PERIOD_LABEL: Record<ComparisonPeriod, string> = {
  none: "None",
  wow: "Week-over-Week",
  mom: "Month-over-Month",
  qoq: "Quarter-over-Quarter",
  yoy: "Year-over-Year",
};

function fieldTooltip(key: string): string {
  return FIELD_TOOLTIPS[key] ?? `Data field: ${key.replace(/_/g, " ")}`;
}

/* ─────────────────── helpers ─────────────────── */

function isFinancialKey(key: string) {
  return /revenue|price|adr|value|deposit|balance|refund|amount/i.test(key);
}

function formatCellValue(key: string, value: unknown): string {
  if (value === null || value === undefined) return "-";
  const str = String(value);
  if (TIME_DIM_KEYS.has(key)) return formatTimeDimLabel(key, str);
  if (/^\d{4}-\d{2}-\d{2}T/.test(str)) return str.split("T")[0];
  if (typeof value === "number") {
    return isFinancialKey(key)
      ? value.toLocaleString("vi-VN")
      : value.toLocaleString();
  }
  return str;
}

function fmtMetric(key: string, v: number | null): string {
  if (v === null) return "—";
  return isFinancialKey(key) ? `${v.toLocaleString("vi-VN")} ₫` : v.toLocaleString();
}

function tickFormatter(v: number): string {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(0)}K`;
  return String(v);
}

const TIME_DIM_KEYS = new Set(["date", "week", "month", "quarter", "year"]);

function formatTimeDimLabel(dimKey: string, raw: string): string {
  if (!raw || !TIME_DIM_KEYS.has(dimKey)) return raw;

  // Strip time part — backend sends DateTime which may include T00:00:00
  const dateStr = raw.split("T")[0];
  const d = new Date(dateStr + "T00:00:00");
  if (isNaN(d.getTime())) return dateStr;

  const pad = (n: number) => String(n).padStart(2, "0");
  const SHORT_MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  if (dimKey === "date") {
    return dateStr; // already YYYY-MM-DD
  }

  if (dimKey === "week") {
    // end = start + 6 days
    const end = new Date(d);
    end.setDate(end.getDate() + 6);
    const startLabel = `${SHORT_MONTHS[d.getMonth()]} ${d.getDate()}`;
    const endLabel = d.getMonth() === end.getMonth()
      ? String(end.getDate())
      : `${SHORT_MONTHS[end.getMonth()]} ${end.getDate()}`;
    return `${d.getFullYear()} W${pad(isoWeekNumber(d))} (${startLabel}–${endLabel})`;
  }

  if (dimKey === "month") {
    const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    return `${SHORT_MONTHS[d.getMonth()]} ${d.getFullYear()} (${dateStr}–${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(lastDay)})`;
  }

  if (dimKey === "quarter") {
    const q = Math.floor(d.getMonth() / 3) + 1;
    const endMonth = q * 3; // 3, 6, 9, 12
    const endDay = new Date(d.getFullYear(), endMonth, 0).getDate();
    const endStr = `${d.getFullYear()}-${pad(endMonth)}-${pad(endDay)}`;
    return `Q${q} ${d.getFullYear()} (${dateStr}–${endStr})`;
  }

  if (dimKey === "year") {
    return `${d.getFullYear()} (${d.getFullYear()}-01-01–${d.getFullYear()}-12-31)`;
  }

  return dateStr;
}

function isoWeekNumber(date: Date): number {
  const tmp = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  tmp.setUTCDate(tmp.getUTCDate() + 4 - (tmp.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(tmp.getUTCFullYear(), 0, 1));
  return Math.ceil((((tmp.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

/* ─────────────────── SummaryCard ─────────────────── */

function SummaryCard({
  title, value, Icon, accent,
}: {
  title: string;
  value: string;
  Icon: React.ElementType;
  accent: string;
}) {
  return (
    <Card className="border border-gray-100 shadow-sm bg-white">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider truncate">{title}</p>
            <p className="mt-1.5 text-xl font-bold text-gray-800 truncate">{value}</p>
          </div>
          <div className={`shrink-0 p-2.5 rounded-xl ${accent}`}>
            <Icon className="h-5 w-5 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* ─────────────────── Sortable header cell ─────────────────── */

function SortableTh({ col }: { col: ColDef }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: col.id });
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: "grab",
  };
  return (
    <th
      ref={setNodeRef}
      style={style}
      className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider whitespace-nowrap select-none
        ${col.kind === "metric" ? "text-right text-blue-600" : "text-left text-gray-500"}`}
    >
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="inline-flex items-center gap-1.5 group">
              <GripVertical
                className="h-3.5 w-3.5 text-gray-300 group-hover:text-gray-400 shrink-0"
                {...attributes}
                {...listeners}
              />
              {col.label}
              <Info className="h-3 w-3 text-gray-300 group-hover:text-blue-400 shrink-0" />
            </span>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-xs text-xs">
            {col.tooltip}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </th>
  );
}

/* ─────────────────── Loading overlay ─────────────────── */

function LoadingOverlay() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20">
      <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
      <p className="text-sm font-medium text-gray-500">Generating report…</p>
    </div>
  );
}

/* ─────────────────── Success banner ─────────────────── */

function SuccessBanner({
  reportName, onDownloadCsv, onDownloadXlsx,
}: {
  reportName: string;
  onDownloadCsv: () => void;
  onDownloadXlsx: () => void;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4">
      <div className="flex items-center gap-3">
        <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
        <div>
          <p className="text-sm font-semibold text-emerald-800">Report Generated</p>
          <p className="text-xs text-emerald-600 mt-0.5">{reportName}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Button size="sm" variant="outline" onClick={onDownloadCsv} className="border-emerald-300 text-emerald-700 hover:bg-emerald-100 gap-1.5">
          <Download className="h-3.5 w-3.5" />CSV
        </Button>
        <Button size="sm" variant="outline" onClick={onDownloadXlsx} className="border-emerald-300 text-emerald-700 hover:bg-emerald-100 gap-1.5">
          <Download className="h-3.5 w-3.5" />Excel
        </Button>
      </div>
    </div>
  );
}

/* ─────────────────── SegmentedControl ─────────────────── */

function SegmentedControl<T extends string>({
  options, value, onChange,
}: {
  options: { value: T; label: string; Icon: React.ElementType }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex items-center gap-0.5 rounded-lg border border-gray-200 bg-gray-50 p-0.5">
      {options.map(({ value: v, label, Icon }) => (
        <button
          key={v}
          type="button"
          onClick={() => onChange(v)}
          className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
            value === v
              ? "bg-white text-blue-600 shadow-sm border border-gray-200"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <Icon className="h-4 w-4" />
          {label}
        </button>
      ))}
    </div>
  );
}

/* ─────────────────── ChangeBadge ─────────────────── */

function ChangeBadge({ pctVar, absVar }: { pctVar: number | null; absVar: number | null }) {
  if (absVar === null) return <span className="text-xs text-gray-300">—</span>;
  if (pctVar === null) return <span className="text-xs text-gray-400">N/A</span>;
  if (absVar === 0)
    return (
      <span className="inline-flex items-center gap-0.5 text-xs text-gray-400">
        <Minus className="h-3 w-3" />0.0%
      </span>
    );
  if (absVar > 0)
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
        <TrendingUp className="h-3 w-3" />+{pctVar.toFixed(1)}%
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-600">
      <TrendingDown className="h-3 w-3" />{pctVar.toFixed(1)}%
    </span>
  );
}

/* ─────────────────── Main component ─────────────────── */

export interface ReportResultsProps {
  data: any;
  isRunning: boolean;
  reportName: string;
  comparisonPeriod?: ComparisonPeriod;
  onDownloadCsv: () => void;
  onDownloadXlsx: () => void;
}

export default function ReportResults({
  data,
  isRunning,
  reportName,
  comparisonPeriod = "none",
  onDownloadCsv,
  onDownloadXlsx,
}: ReportResultsProps) {
  const hasComparison = comparisonPeriod !== "none";
  const [view, setView] = useState<ViewMode>(hasComparison ? "comparison" : "table");
  const [chartType, setChartType] = useState<ChartType>("bar");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [colOrder, setColOrder] = useState<string[] | null>(null);
  const [activeMetrics, setActiveMetrics] = useState<Set<string> | null>(null);
  const [activeDimKey, setActiveDimKey] = useState<string | null>(null);

  const rows: any[] = data?.rows ?? [];
  const totalMetrics: Record<string, unknown> = data?.totalMetrics ?? {};
  const firstRow = rows[0];

  /* Column definitions — keyed on the actual field names so they're stable */
  const baseCols = useMemo<ColDef[]>(() => {
    if (!firstRow) return [];
    const dims: ColDef[] = Object.keys(firstRow.dimensions).map((k) => ({
      id: `dim__${k}`, key: k, kind: "dim",
      label: humanizeReportField(k), tooltip: fieldTooltip(k),
    }));
    const metrics: ColDef[] = Object.keys(firstRow.metrics).map((k) => ({
      id: `metric__${k}`, key: k, kind: "metric",
      label: humanizeReportField(k), tooltip: fieldTooltip(k),
    }));
    return [...dims, ...metrics];
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]); // reset cols whenever the dataset itself changes

  const orderedIds = colOrder ?? baseCols.map((c) => c.id);
  const cols: ColDef[] = orderedIds
    .map((id) => baseCols.find((c) => c.id === id))
    .filter((c): c is ColDef => c != null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setColOrder((prev) => {
      const ids = prev ?? baseCols.map((c) => c.id);
      return arrayMove(ids, ids.indexOf(String(active.id)), ids.indexOf(String(over.id)));
    });
  }

  /* Summary cards */
  const summaryCards = useMemo(() => {
    const cards: { title: string; value: string; Icon: React.ElementType; accent: string }[] = [];
    const revenueKey = Object.keys(totalMetrics).find((k) => /revenue/i.test(k));
    if (revenueKey) cards.push({ title: humanizeReportField(revenueKey), value: `${Number(totalMetrics[revenueKey]).toLocaleString("vi-VN")} ₫`, Icon: BanknoteArrowUp, accent: "bg-emerald-500" });
    const bookingKey = Object.keys(totalMetrics).find((k) => /booking/i.test(k));
    if (bookingKey) cards.push({ title: humanizeReportField(bookingKey), value: Number(totalMetrics[bookingKey]).toLocaleString(), Icon: ChartNoAxesColumnIncreasing, accent: "bg-blue-500" });
    if (cards.length < 3) {
      const occupancyKey = Object.keys(totalMetrics).find((k) => /occupancy/i.test(k));
      if (occupancyKey) cards.push({ title: humanizeReportField(occupancyKey), value: `${Number(totalMetrics[occupancyKey]).toFixed(1)}%`, Icon: Percent, accent: "bg-violet-500" });
    }
    if (cards.length < 3) {
      const shown = new Set([
        Object.keys(totalMetrics).find((k) => /revenue/i.test(k)),
        Object.keys(totalMetrics).find((k) => /booking/i.test(k)),
        Object.keys(totalMetrics).find((k) => /occupancy/i.test(k)),
      ]);
      for (const [k, v] of Object.entries(totalMetrics)) {
        if (shown.has(k) || typeof v !== "number") continue;
        cards.push({ title: humanizeReportField(k), value: isFinancialKey(k) ? `${Number(v).toLocaleString("vi-VN")} ₫` : Number(v).toLocaleString(), Icon: Hash, accent: "bg-amber-500" });
        break;
      }
    }
    return cards;
  }, [totalMetrics]);

  /* Pagination */
  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const pagedRows = rows.slice((page - 1) * pageSize, page * pageSize);

  /* Stable key lists derived from baseCols */
  const allDimKeys = useMemo(() => baseCols.filter((c) => c.kind === "dim").map((c) => c.key), [baseCols]);
  const allMetricKeys = useMemo(() => baseCols.filter((c) => c.kind === "metric").map((c) => c.key), [baseCols]);

  /* Reset chart field selections whenever the report data changes (new report run) */
  const prevDataRef = React.useRef<any>(null);
  if (prevDataRef.current !== data) {
    prevDataRef.current = data;
    // Can't call setState during render but we need the stale-selection reset.
    // We handle it by falling back to defaults below when the key no longer exists.
  }

  // If activeDimKey is stale (from a previous report), fall back to first dim of new data
  const chartDimKey = (activeDimKey && allDimKeys.includes(activeDimKey))
    ? activeDimKey
    : allDimKeys[0] ?? "";

  // If activeMetrics contains only keys not in this report, treat as "all"
  const validActiveMetrics = activeMetrics && [...activeMetrics].some((k) => allMetricKeys.includes(k))
    ? activeMetrics
    : null;
  const chartMetricKeys = validActiveMetrics
    ? allMetricKeys.filter((k) => validActiveMetrics.has(k))
    : allMetricKeys;

  function toggleMetric(key: string) {
    setActiveMetrics((prev) => {
      const base = prev ?? new Set(allMetricKeys);
      const next = new Set(base);
      if (next.has(key)) { if (next.size === 1) return next; next.delete(key); }
      else next.add(key);
      return next;
    });
  }

  const chartData = useMemo(() => rows.map((row) => {
    const rawLabel = String(row.dimensions[chartDimKey] ?? "");
    const label = formatTimeDimLabel(chartDimKey, rawLabel);
    const entry: Record<string, unknown> = { name: label };
    // Always coerce metric values to numbers — recharts renders nothing for strings
    for (const k of allMetricKeys) entry[k] = Number(row.metrics[k]) || 0;
    return entry;
  }), [rows, chartDimKey, allMetricKeys]);

  function handlePageSize(val: string) { setPageSize(Number(val)); setPage(1); }

  /* ── Comparison variance table ──
     The API returns rows grouped by the injected time dim (week/month/quarter/year).
     For each category (non-time dims), we compare each period against its predecessor.
  */
  const comparisonResult = useMemo(() => {
    if (!hasComparison || rows.length === 0) return null;

    const timeDimKey = allDimKeys[0] ?? "";
    const categoryDimKeys = allDimKeys.slice(1);

    function periodLabel(row: any): string {
      const raw = String(row.dimensions[timeDimKey] ?? "");
      return formatTimeDimLabel(timeDimKey, raw);
    }

    function categoryLabel(row: any): string {
      if (categoryDimKeys.length === 0) return "";
      return categoryDimKeys.map((k) => String(row.dimensions[k] ?? "")).join(" / ");
    }

    // Group by category, sort each group by time dim ascending
    const groups = new Map<string, any[]>();
    for (const row of rows) {
      const cat = categoryLabel(row);
      if (!groups.has(cat)) groups.set(cat, []);
      groups.get(cat)!.push(row);
    }
    for (const grp of groups.values()) {
      grp.sort((a, b) =>
        String(a.dimensions[timeDimKey] ?? "").localeCompare(String(b.dimensions[timeDimKey] ?? "")));
    }

    // Build variance rows: each row compared to its predecessor within the same category
    const varRows: {
      category: string;
      currentPeriod: string;
      previousPeriod: string;
      metrics: { key: string; cur: number; prev: number | null; absVar: number | null; pctVar: number | null }[];
    }[] = [];

    for (const [cat, grp] of groups.entries()) {
      for (let i = 0; i < grp.length; i++) {
        const curr = grp[i];
        const prev = i > 0 ? grp[i - 1] : null;
        varRows.push({
          category: cat || periodLabel(curr),
          currentPeriod: periodLabel(curr),
          previousPeriod: prev ? periodLabel(prev) : "—",
          metrics: allMetricKeys.map((k) => {
            const cur = Number(curr.metrics[k]) || 0;
            const pre = prev !== null ? Number(prev.metrics[k]) || 0 : null;
            const absVar = pre !== null ? cur - pre : null;
            const pctVar = pre !== null && pre !== 0
              ? ((cur - pre) / Math.abs(pre)) * 100
              : pre === 0 && cur !== 0 ? null
              : pre !== null ? 0 : null;
            return { key: k, cur, prev: pre, absVar, pctVar };
          }),
        });
      }
    }

    return { timeDimKey, categoryDimKeys, rows: varRows };
  }, [hasComparison, rows, allDimKeys, allMetricKeys]);

  /* Sliding page window */
  const pageButtons = useMemo(() => {
    const half = 2;
    let start = Math.max(1, page - half);
    const end = Math.min(totalPages, start + 4);
    start = Math.max(1, end - 4);
    return Array.from({ length: Math.min(5, totalPages) }, (_, i) => start + i).filter((p) => p >= 1 && p <= totalPages);
  }, [page, totalPages]);

  /* ── View options — include Comparison only when a period is selected ── */
  const viewOptions: { value: ViewMode; label: string; Icon: React.ElementType }[] = [
    { value: "table", label: "Table", Icon: TableIcon },
    { value: "chart", label: "Chart", Icon: BarChart2 },
    ...(hasComparison ? [{ value: "comparison" as ViewMode, label: "Comparison", Icon: ArrowLeftRight }] : []),
  ];

  /* ── render ── */
  return (
    <div className="space-y-5">
      {isRunning && (
        <Card className="border border-gray-100 shadow-sm">
          <CardContent><LoadingOverlay /></CardContent>
        </Card>
      )}

      {!isRunning && rows.length > 0 && (
        <>
          <SuccessBanner reportName={reportName} onDownloadCsv={onDownloadCsv} onDownloadXlsx={onDownloadXlsx} />

          {summaryCards.length > 0 && (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {summaryCards.map((card) => <SummaryCard key={card.title} {...card} />)}
            </div>
          )}

          {/* ── Toolbar ── */}
          <div className="flex flex-wrap items-start justify-between gap-3">
            <SegmentedControl value={view} onChange={setView} options={viewOptions} />

            {view === "chart" && (
              <div className="flex flex-wrap items-start gap-4">
                <SegmentedControl
                  value={chartType}
                  onChange={setChartType}
                  options={[
                    { value: "bar", label: "Bar", Icon: BarChart2 },
                    { value: "line", label: "Line", Icon: TrendingUp },
                    { value: "pie", label: "Pie", Icon: PieChartIcon },
                  ]}
                />

                {chartType !== "pie" && allDimKeys.length > 1 && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">X-axis</span>
                    <div className="flex flex-wrap gap-1.5">
                      {allDimKeys.map((k) => (
                        <button key={k} type="button" onClick={() => setActiveDimKey(k)}
                          className={`rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${chartDimKey === k ? "border-blue-600 bg-blue-600 text-white" : "border-gray-300 bg-white text-gray-600 hover:border-blue-400 hover:text-blue-600"}`}>
                          {humanizeReportField(k)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {allMetricKeys.length > 1 && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">
                      {chartType === "pie" ? "Metric" : "Fields"}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {allMetricKeys.map((k, i) => {
                        const isSelected = chartType === "pie" ? chartMetricKeys[0] === k : (activeMetrics === null || activeMetrics.has(k));
                        const handleClick = chartType === "pie" ? () => setActiveMetrics(new Set([k])) : () => toggleMetric(k);
                        return (
                          <button key={k} type="button" onClick={handleClick}
                            className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${isSelected ? "border-transparent text-white" : "border-gray-300 bg-white text-gray-500 hover:border-gray-400"}`}
                            style={isSelected ? { backgroundColor: CHART_COLORS[i % CHART_COLORS.length], borderColor: CHART_COLORS[i % CHART_COLORS.length] } : {}}>
                            {humanizeReportField(k)}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── Table view ── */}
          {view === "table" && (
            <Card className="border border-gray-100 shadow-sm overflow-hidden">
              <CardContent className="p-0">
                <div className="flex items-center gap-1.5 border-b border-gray-100 bg-blue-50 px-4 py-2">
                  <GripVertical className="h-3.5 w-3.5 text-blue-400" />
                  <p className="text-xs text-blue-600">Drag column headers to reorder</p>
                </div>
                <div className="overflow-x-auto">
                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={cols.map((c) => c.id)} strategy={horizontalListSortingStrategy}>
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                          <tr className="border-b border-gray-200">
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider w-10">#</th>
                            {cols.map((col) => <SortableTh key={col.id} col={col} />)}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                          {pagedRows.map((row, idx) => (
                            <tr key={idx} className="hover:bg-blue-50/40 transition-colors">
                              <td className="px-4 py-3 text-gray-400 tabular-nums text-xs">{(page - 1) * pageSize + idx + 1}</td>
                              {cols.map((col) => {
                                const raw = col.kind === "dim" ? row.dimensions?.[col.key] : row.metrics?.[col.key];
                                return (
                                  <td key={col.id} className={`px-4 py-3 whitespace-nowrap tabular-nums text-gray-800 ${col.kind === "metric" ? "text-right" : "text-left"}`}>
                                    {formatCellValue(col.key, raw)}
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </SortableContext>
                  </DndContext>
                </div>
                {/* Pagination footer */}
                <div className="flex flex-col gap-3 border-t border-gray-100 bg-gray-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span className="hidden sm:inline">Rows per page</span>
                    <Select value={String(pageSize)} onValueChange={handlePageSize}>
                      <SelectTrigger className="h-8 w-20"><SelectValue /></SelectTrigger>
                      <SelectContent>{PAGE_SIZE_OPTIONS.map((n) => <SelectItem key={n} value={String(n)}>{n}</SelectItem>)}</SelectContent>
                    </Select>
                    <span className="text-xs text-gray-400">
                      {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, rows.length)} of {rows.length}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    {([{ label: "«", action: () => setPage(1), disabled: page === 1 }, { label: "‹", action: () => setPage((p) => p - 1), disabled: page === 1 }] as const).map(({ label, action, disabled }) => (
                      <Button key={label} variant="outline" size="sm" onClick={action} disabled={disabled} className="h-8 w-8 p-0 text-gray-500 border-gray-200">{label}</Button>
                    ))}
                    {pageButtons.map((p) => (
                      <Button key={p} variant={p === page ? "default" : "outline"} size="sm" onClick={() => setPage(p)}
                        className={`h-8 w-8 p-0 ${p === page ? "bg-blue-600 border-blue-600" : "border-gray-200 text-gray-500"}`}>{p}</Button>
                    ))}
                    {([{ label: "›", action: () => setPage((p) => p + 1), disabled: page === totalPages }, { label: "»", action: () => setPage(totalPages), disabled: page === totalPages }] as const).map(({ label, action, disabled }) => (
                      <Button key={label} variant="outline" size="sm" onClick={action} disabled={disabled} className="h-8 w-8 p-0 text-gray-500 border-gray-200">{label}</Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* ── Chart view ── */}
          {view === "chart" && (
            <Card className="border border-gray-100 shadow-sm">
              <CardHeader className="pb-2 border-b border-gray-100">
                <CardTitle className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  {chartMetricKeys.map((k) => humanizeReportField(k)).join(" · ")}
                  {chartType !== "pie" && (
                    <span className="ml-2 font-normal normal-case text-gray-400">by {humanizeReportField(chartDimKey)}</span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                {(chartData.length === 0 || (chartType !== "pie" && chartData.length < 2)) ? (
                  <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
                    <BarChart2 className="h-10 w-10 text-gray-200" />
                    <p className="text-sm font-medium text-gray-400">Not enough data to build this chart</p>
                    <p className="text-xs text-gray-300">
                      {chartData.length === 0
                        ? "The report returned no rows."
                        : "Bar and line charts need at least 2 data points. Try a wider date range or switch to Pie."}
                    </p>
                  </div>
                ) : chartType === "pie" ? (
                  (() => {
                    const pieKey = chartMetricKeys[0];
                    const total = chartData.reduce((sum, d) => sum + (Number(d[pieKey]) || 0), 0);
                    const renderCustomLabel = ({ cx, cy, midAngle, outerRadius, index }: any) => {
                      const RADIAN = Math.PI / 180;
                      const r = outerRadius + 24;
                      const x = cx + r * Math.cos(-midAngle * RADIAN);
                      const y = cy + r * Math.sin(-midAngle * RADIAN);
                      const val = Number(chartData[index]?.[pieKey]) || 0;
                      const pct = total > 0 ? ((val / total) * 100).toFixed(1) : "0.0";
                      const name = String(chartData[index]?.name ?? "");
                      const shortName = name.length > 12 ? name.slice(0, 11) + "…" : name;
                      return (
                        <text x={x} y={y} textAnchor={x > cx ? "start" : "end"} dominantBaseline="central" fontSize={11} fill="#374151">
                          <tspan fontWeight="600">{pct}%</tspan>
                          <tspan fill="#9ca3af"> {shortName}</tspan>
                        </text>
                      );
                    };
                    return (
                      <ChartContainer config={Object.fromEntries(chartData.map((_, i) => [String(i), { label: String(chartData[i]?.name), color: CHART_COLORS[i % CHART_COLORS.length] }]))} className="h-96 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart margin={{ top: 20, right: 40, bottom: 20, left: 40 }}>
                            <ChartTooltip content={<ChartTooltipContent formatter={(value, _name, item: any) => {
                              const val = Number(value);
                              const pct = total > 0 ? ((val / total) * 100).toFixed(1) : "0.0";
                              return [<div key="tt" className="space-y-0.5"><p className="font-semibold text-gray-800">{item?.payload?.name}</p><p className="text-gray-700">{val.toLocaleString("vi-VN")}</p><p className="text-blue-600 font-medium">{pct}%</p></div>];
                            }} />} />
                            <Pie data={chartData} dataKey={pieKey} nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={100} paddingAngle={2} animationDuration={600} label={renderCustomLabel} labelLine={{ stroke: "#d1d5db", strokeWidth: 1 }}>
                              {chartData.map((_entry, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                            </Pie>
                            <Legend formatter={(_value, entry: any) => {
                              const val = Number(entry.payload?.[pieKey]) || 0;
                              const pct = total > 0 ? ((val / total) * 100).toFixed(1) : "0.0";
                              return <span className="text-xs text-gray-600">{entry.payload?.name} <span className="font-semibold text-gray-800">{pct}%</span></span>;
                            }} />
                          </PieChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    );
                  })()
                ) : (
                  <ChartContainer config={Object.fromEntries(chartMetricKeys.map((k, i) => [k, { label: humanizeReportField(k), color: CHART_COLORS[i % CHART_COLORS.length] }]))} className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      {chartType === "bar" ? (
                        <BarChart data={chartData} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                          <XAxis dataKey="name" stroke="#94a3b8" tick={{ fill: "#64748b", fontSize: 11 }} />
                          <YAxis stroke="#94a3b8" tick={{ fill: "#64748b", fontSize: 11 }} tickFormatter={tickFormatter} />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Legend formatter={(v) => <span className="text-xs text-gray-600">{humanizeReportField(v)}</span>} />
                          {chartMetricKeys.map((k, i) => <Bar key={k} dataKey={k} name={humanizeReportField(k)} fill={CHART_COLORS[i % CHART_COLORS.length]} radius={[3, 3, 0, 0]} animationDuration={600} />)}
                        </BarChart>
                      ) : (
                        <LineChart data={chartData} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                          <XAxis dataKey="name" stroke="#94a3b8" tick={{ fill: "#64748b", fontSize: 11 }} />
                          <YAxis stroke="#94a3b8" tick={{ fill: "#64748b", fontSize: 11 }} tickFormatter={tickFormatter} />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Legend formatter={(v) => <span className="text-xs text-gray-600">{humanizeReportField(v)}</span>} />
                          {chartMetricKeys.map((k, i) => <Line key={k} type="monotone" dataKey={k} name={humanizeReportField(k)} stroke={CHART_COLORS[i % CHART_COLORS.length]} strokeWidth={2.5} dot={{ r: 3, fill: CHART_COLORS[i % CHART_COLORS.length] }} activeDot={{ r: 5 }} animationDuration={600} />)}
                        </LineChart>
                      )}
                    </ResponsiveContainer>
                  </ChartContainer>
                )}
              </CardContent>
            </Card>
          )}

          {/* ── Comparison view ── */}
          {view === "comparison" && comparisonResult && (
            <div className="space-y-4">
              {/* Period info banner */}
              <div className="flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
                <ArrowLeftRight className="h-4 w-4 text-blue-500 shrink-0" />
                <div className="text-sm">
                  <span className="font-semibold text-blue-800">{PERIOD_LABEL[comparisonPeriod]}</span>
                  <span className="text-blue-600 ml-2">
                    — each row shows the current {comparisonResult.timeDimKey} vs its preceding {comparisonResult.timeDimKey}
                    {comparisonResult.categoryDimKeys.length > 0 && (
                      <>, grouped by <span className="font-medium">{comparisonResult.categoryDimKeys.map(humanizeReportField).join(" / ")}</span></>
                    )}
                  </span>
                </div>
              </div>

              {/* One table per metric */}
              {allMetricKeys.map((metricKey) => (
                <Card key={metricKey} className="border border-gray-100 shadow-sm overflow-hidden">
                  <CardHeader className="py-3 px-4 border-b border-gray-100 bg-gray-50/60">
                    <CardTitle className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                      {humanizeReportField(metricKey)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-100 bg-white">
                            {comparisonResult.categoryDimKeys.length > 0 && (
                              <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-400 w-36">
                                {comparisonResult.categoryDimKeys.map(humanizeReportField).join(" / ")}
                              </th>
                            )}
                            <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                              Current Period
                            </th>
                            <th className="px-4 py-2.5 text-right text-xs font-semibold uppercase tracking-wider text-gray-400">
                              Current
                            </th>
                            <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                              Previous Period
                            </th>
                            <th className="px-4 py-2.5 text-right text-xs font-semibold uppercase tracking-wider text-gray-400">
                              Previous
                            </th>
                            <th className="px-4 py-2.5 text-right text-xs font-semibold uppercase tracking-wider text-gray-400">
                              Variance
                            </th>
                            <th className="px-4 py-2.5 text-right text-xs font-semibold uppercase tracking-wider text-gray-400">
                              Change
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 bg-white">
                          {comparisonResult.rows.map((row, ri) => {
                            const m = row.metrics.find((x) => x.key === metricKey)!;
                            const up = m.absVar !== null && m.absVar > 0;
                            const down = m.absVar !== null && m.absVar < 0;
                            const noPrev = m.prev === null;
                            return (
                              <tr key={ri} className="hover:bg-blue-50/30 transition-colors">
                                {comparisonResult.categoryDimKeys.length > 0 && (
                                  <td className="px-4 py-3 font-medium text-gray-800 max-w-[9rem] truncate" title={row.category}>
                                    {row.category}
                                  </td>
                                )}
                                <td className="px-4 py-3 text-xs text-gray-600 tabular-nums whitespace-nowrap">
                                  {row.currentPeriod}
                                </td>
                                <td className="px-4 py-3 text-right font-semibold text-gray-900 tabular-nums whitespace-nowrap">
                                  {fmtMetric(metricKey, m.cur)}
                                </td>
                                <td className="px-4 py-3 text-xs text-gray-400 tabular-nums whitespace-nowrap">
                                  {row.previousPeriod}
                                </td>
                                <td className="px-4 py-3 text-right text-gray-500 tabular-nums whitespace-nowrap">
                                  {fmtMetric(metricKey, m.prev)}
                                </td>
                                <td className={`px-4 py-3 text-right tabular-nums font-medium whitespace-nowrap ${noPrev ? "text-gray-300" : up ? "text-emerald-600" : down ? "text-red-500" : "text-gray-400"}`}>
                                  {noPrev ? "—" : `${up ? "+" : ""}${fmtMetric(metricKey, m.absVar)}`}
                                </td>
                                <td className="px-4 py-3 text-right whitespace-nowrap">
                                  {noPrev ? (
                                    <span className="text-xs text-gray-300">First period</span>
                                  ) : (
                                    <ChangeBadge pctVar={m.pctVar} absVar={m.absVar} />
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Fallback: comparison tab selected but no period chosen */}
          {view === "comparison" && !comparisonResult && (
            <Card className="border border-gray-100 shadow-sm">
              <CardContent className="flex flex-col items-center justify-center gap-2 py-16">
                <ArrowLeftRight className="h-8 w-8 text-gray-300" />
                <p className="text-sm text-gray-400">Select a comparison period (WoW / MoM / QoQ / YoY) and re-run the report.</p>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
