import DataTable from "@/components/ui/dataTable/DataTable";
import { reportApi } from "@/services/privateApi/adminApi";
import type { Catalog } from "@/types/catalog";
import type { GeneralMetrics } from "@/types/generalMetrics";
import { useEffect, useState } from "react";
import { DashboardColumns } from "./components/DashboardColumns";
import { getConfig } from "@/api/reports";
import { Button } from "@/components/ui/button";
import type { CatalogFormData } from "@/schemas/catalogSchema";
import { toast } from "sonner";
import CatalogForm from "./components/CatalogForm.tsx";
import { GENERAL } from "@/constants/reportBody";
import { useChartStore } from "@/store/chartStore";
import GeneralCard from "./components/GeneralCard";
import {
  BanknoteArrowUp,
  ChartNoAxesColumnIncreasing,
  UsersRound,
  Plus,
  Download,
  Play,
  RotateCcw,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { applyRangePreset, type RangePreset } from "@/utils/datePresets";
import ReportResults from "./components/ReportResults";
import ReportFilterBuilder, {
  type FilterField,
  type FilterRow,
  toBackendFilters,
} from "./components/ReportFilterBuilder";
import { humanizeReportField } from "@/utils/reportLabels";

type QuickPreset = { label: string; preset: RangePreset | "custom" };

const QUICK_PRESETS: QuickPreset[] = [
  { label: "Today", preset: "this_day" },
  { label: "Last 7 Days", preset: "last_week" },
  { label: "Last 30 Days", preset: "last_30_days" },
  { label: "This Month", preset: "this_month" },
  { label: "Last Month", preset: "last_month" },
  { label: "This Year", preset: "this_year" },
  { label: "Custom", preset: "custom" },
];

type ComparisonPeriod = "none" | "wow" | "mom" | "qoq" | "yoy";

const COMPARISON_OPTIONS: { value: ComparisonPeriod; label: string; dimField: string | null }[] = [
  { value: "none", label: "None", dimField: null },
  { value: "wow", label: "WoW", dimField: "week" },
  { value: "mom", label: "MoM", dimField: "month" },
  { value: "qoq", label: "QoQ", dimField: "quarter" },
  { value: "yoy", label: "YoY", dimField: "year" },
];

const DEFAULT_PRESET: RangePreset = "last_30_days";

function AdminDashboard() {
  const [catalogs, setCatalogs] = useState<Catalog[]>([]);
  const [generalData, setGeneralData] = useState<GeneralMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedReport, setSelectedReport] = useState<Catalog | null>(null);
  const [editingCatalog, setEditingCatalog] = useState<Catalog | null>(null);
  const [formInitialData, setFormInitialData] = useState<Partial<CatalogFormData> | null>(null);
  const [catalogFormOpen, setCatalogFormOpen] = useState(false);
  const [dateRange, setDateRange] = useState(() => applyRangePreset(DEFAULT_PRESET));
  const [activePreset, setActivePreset] = useState<RangePreset | "custom">(DEFAULT_PRESET);
  const [exportFormat, setExportFormat] = useState<"csv" | "xlsx">("csv");
  const [isRunning, setIsRunning] = useState(false);
  const [comparisonPeriod, setComparisonPeriod] = useState<ComparisonPeriod>("none");
  const [filterRows, setFilterRows] = useState<FilterRow[]>([]);
  const { chartData, setChartData } = useChartStore();

  /* Derive filterable fields from the selected report's dimension + metric definitions */
  const filterFields: FilterField[] = (() => {
    if (!selectedReport) return [];
    const r = selectedReport as unknown as Record<string, unknown>;
    const get = (key: string) => (r[key] ?? r[key.charAt(0).toLowerCase() + key.slice(1)]) as string | undefined;

    const NUMERIC_FIELDS = new Set([
      "nights", "booking_count", "total_revenue", "avg_booking_value", "min_booking_value",
      "max_booking_value", "paid_booking_count", "unique_tenant_count", "unique_apartment_count",
      "unique_paid_tenant_count", "occupancy_percent", "adr", "avg", "min", "max", "sum", "count",
      "p50", "p90", "p95", "avg_length_of_stay", "review_avg_rating", "review_count",
      "package_revenue", "package_count", "subscription_revenue", "subscription_churn_count",
      "subscription_churn_rate", "avg_sold_price", "avg_base_price", "avg_price_delta",
      "revenue", "bookings", "total_booking", "total_user",
    ]);
    const DATE_FIELDS = new Set(["date", "week", "month", "quarter", "year"]);

    function dataType(field: string): FilterField["dataType"] {
      if (DATE_FIELDS.has(field)) return "date";
      if (NUMERIC_FIELDS.has(field) || /revenue|price|count|rate|value|amount|nights|rating|pct/i.test(field)) return "number";
      return "string";
    }

    const fields: FilterField[] = [];
    try {
      const dims = get("DimensionsJson");
      if (dims) {
        JSON.parse(dims).forEach(({ field, alias }: { field: string; alias?: string }) => {
          const key = alias || field;
          fields.push({ key, label: humanizeReportField(key), target: "dimension", dataType: dataType(key) });
        });
      }
    } catch {}
    try {
      const metrics = get("MetricsJson");
      if (metrics) {
        JSON.parse(metrics).forEach(({ field, alias }: { field: string; alias?: string }) => {
          const key = alias || field;
          fields.push({ key, label: humanizeReportField(key), target: "metric", dataType: dataType(key) });
        });
      }
    } catch {}
    return fields;
  })();

  /* ─── catalog fetch ─── */

  const fetchCatalogs = async () => {
    setLoading(true);
    try {
      const res = await reportApi.getCatalog({ page, pageSize });
      setCatalogs(res.data.items);
      setTotalCount(res.data.totalCount);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchGeneralData = async (reportId: string) => {
    try {
      const res = await reportApi.runReport(reportId, GENERAL);
      const totals = res.data.data.totalMetrics;
      setGeneralData({
        total_revenue: totals.total_revenue ?? 0,
        total_booking: totals.total_booking ?? 0,
        total_user: totals.total_user ?? 0,
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => { fetchCatalogs(); }, [page, pageSize]);
  useEffect(() => { if (catalogs.length > 0) fetchGeneralData(catalogs[0].reportId); }, [catalogs]);

  /* ─── report CRUD ─── */

  const handleCreateReport = async (data: CatalogFormData) => {
    try {
      const { dimensions, metrics, ...def } = data;
      await reportApi.createReport({
        ...def,
        DimensionsJson: JSON.stringify(dimensions ?? []),
        MetricsJson: JSON.stringify(metrics ?? []),
        TimeRangeJson: JSON.stringify({}),
      });
      fetchCatalogs();
      toast.success("Report created successfully");
    } catch (err) {
      console.log(err);
      toast.error("Failed to create report");
    }
  };

  const handleUpdateReport = async (data: CatalogFormData) => {
    if (!editingCatalog) return;
    try {
      const { dimensions, metrics, ...def } = data;
      await reportApi.updateReport(editingCatalog.reportId, {
        ...def,
        DimensionsJson: JSON.stringify(dimensions ?? []),
        MetricsJson: JSON.stringify(metrics ?? []),
        TimeRangeJson: JSON.stringify({}),
      });
      setEditingCatalog(null);
      fetchCatalogs();
      toast.success("Report updated successfully");
    } catch (err) {
      console.log(err);
      toast.error("Failed to update report");
    }
  };

  const handleDeleteReport = async (catalog: Catalog) => {
    if (!window.confirm(`Delete report "${catalog.name}"? This cannot be undone.`)) return;
    try {
      await reportApi.deleteReport(catalog.reportId);
      fetchCatalogs();
      toast.success("Report deleted");
    } catch (err) {
      console.log(err);
      toast.error("Failed to delete report");
    }
  };

  /* ─── request builder ─── */

  const buildReportRequest = () => {
    if (!selectedReport) return null;
    try {
      const get = (key: string) => {
        const r = selectedReport as unknown as Record<string, unknown>;
        return (r[key] ?? r[key.charAt(0).toLowerCase() + key.slice(1)]) as string | null | undefined;
      };

      const request: Record<string, unknown> = { from: dateRange.from, to: dateRange.to };

      const compOption = COMPARISON_OPTIONS.find((o) => o.value === comparisonPeriod);
      const timeDimField = compOption?.dimField ?? null;

      const dims = get("DimensionsJson");
      if (dims) {
        const parsed: { field: string; alias: string }[] = JSON.parse(dims);
        // remove any existing time dimensions, then prepend the selected one
        const TIME_DIMS = ["date", "week", "month", "quarter", "year"];
        const stripped = parsed.filter((d) => !TIME_DIMS.includes(d.field));
        if (timeDimField) {
          request.dimensions = [{ field: timeDimField, alias: timeDimField }, ...stripped];
        } else {
          request.dimensions = parsed;
        }
      } else if (timeDimField) {
        request.dimensions = [{ field: timeDimField, alias: timeDimField }];
      }

      const metrics = get("MetricsJson");
      if (metrics) request.metrics = JSON.parse(metrics);

      // Merge saved FiltersJson with ad-hoc filters from the UI
      const savedFilters = (() => { try { const f = get("FiltersJson"); return f ? JSON.parse(f) : []; } catch { return []; } })();
      const adHocFilters = toBackendFilters(filterRows, filterFields);
      const allFilters = [...savedFilters, ...adHocFilters];
      if (allFilters.length > 0) request.filters = allFilters;

      const timeRange = get("TimeRangeJson");
      if (timeRange) {
        const p = JSON.parse(timeRange) as { from?: string; to?: string; searchTerm?: string; page?: number; pageSize?: number };
        if (p.from) request.from = p.from;
        if (p.to) request.to = p.to;
        if (p.searchTerm) request.searchTerm = p.searchTerm;
        if (p.page) request.page = p.page;
        if (p.pageSize) request.pageSize = p.pageSize;
      }

      return request;
    } catch (err) {
      console.log(err);
      return null;
    }
  };

  /* ─── run / export ─── */

  const handleRunReport = async () => {
    if (!selectedReport) return;
    const request = buildReportRequest();
    if (!request) { toast.error("Unsupported report type"); return; }
    setIsRunning(true);
    try {
      const res = await reportApi.runReport(selectedReport.reportId, request);
      setChartData(res.data.data);
      toast.success("Report generated");
    } catch (err) {
      toast.error("Failed to run report");
      console.log(err);
    } finally {
      setIsRunning(false);
    }
  };

  const doExport = async (format: "csv" | "xlsx") => {
    if (!selectedReport) return;
    const request = buildReportRequest();
    if (!request) { toast.error("Unsupported report type"); return; }
    try {
      const res = await reportApi.exportReport(selectedReport.reportId, {
        fileName: `${selectedReport.name.replace(/\s+/g, "_").toLowerCase()}_${dateRange.from}_${dateRange.to}.${format}`,
        format,
        stream: true,
        runRequest: request,
      });
      const url = window.URL.createObjectURL(res.data);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${selectedReport.name.replace(/\s+/g, "_").toLowerCase()}.${format}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Export downloaded");
    } catch (err) {
      toast.error("Failed to export report");
      console.log(err);
    }
  };

  /* ─── reset ─── */

  function handleReset() {
    setSelectedReport(null);
    setDateRange(applyRangePreset(DEFAULT_PRESET));
    setActivePreset(DEFAULT_PRESET);
    setComparisonPeriod("none");
    setFilterRows([]);
    setChartData(null);
  }

  /* ─── date controls ─── */

  function handlePreset(preset: RangePreset | "custom") {
    setActivePreset(preset);
    if (preset !== "custom") setDateRange(applyRangePreset(preset));
  }

  function handleFromChange(v: string) {
    setActivePreset("custom");
    setDateRange((r) => ({ ...r, from: v }));
  }

  function handleToChange(v: string) {
    setActivePreset("custom");
    setDateRange((r) => ({ ...r, to: v }));
  }

  /* ─── catalog table pagination ─── */

  const handlePageChange = (p: number) => setPage(p);
  const handlePageSizeChange = (v: string) => { setPage(1); setPageSize(Number(v)); };
  const triggerRunReport = (report: Catalog) => {
    setSelectedReport(report);
    toast.info(`"${report.name}" selected — configure the date range and click Run.`);
  };

  /* ─── render ─── */

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Sticky header ── */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-500 mt-0.5">Admin reporting &amp; analytics</p>
          </div>
          <Button
            onClick={() => setCatalogFormOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold gap-2 shadow-sm"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Create Report</span>
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* ── KPI cards ── */}
        {generalData && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <GeneralCard title="Total Revenue" data={generalData.total_revenue} Icon={BanknoteArrowUp} />
            <GeneralCard title="Total Bookings" data={generalData.total_booking} Icon={ChartNoAxesColumnIncreasing} />
            <GeneralCard title="Total Tenants" data={generalData.total_user} Icon={UsersRound} />
          </div>
        )}

        {/* ── Inline report runner ── */}
        {selectedReport && (
          <Card className="border border-gray-200 shadow-sm bg-white">
            <CardHeader className="pb-4 border-b border-gray-100">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <CardTitle className="text-base text-gray-800">{selectedReport.name}</CardTitle>
                  {selectedReport.description && (
                    <p className="text-sm text-gray-500 mt-0.5 truncate">{selectedReport.description}</p>
                  )}
                </div>
                {/* Reset — clearly visible, destructive-neutral */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                  className="shrink-0 gap-1.5 text-gray-500 border-gray-300 hover:border-red-300 hover:text-red-600"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Reset
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-5 pt-5">
              {/* Step 1 — date range */}
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Date Range
                </p>

                {/* Pickers */}
                <div className="grid grid-cols-2 gap-3 max-w-xs">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600">From Date</label>
                    <input
                      type="date"
                      value={dateRange.from}
                      onChange={(e) => handleFromChange(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600">To Date</label>
                    <input
                      type="date"
                      value={dateRange.to}
                      onChange={(e) => handleToChange(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Quick presets */}
                <div className="flex flex-wrap gap-2">
                  {QUICK_PRESETS.map(({ label, preset }) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => handlePreset(preset)}
                      className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                        activePreset === preset
                          ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                          : "border-gray-300 bg-white text-gray-600 hover:border-blue-400 hover:text-blue-600"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2 — comparison period */}
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Comparison Period
                </p>
                <div className="flex flex-wrap gap-2">
                  {COMPARISON_OPTIONS.map(({ value, label }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setComparisonPeriod(value)}
                      className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                        comparisonPeriod === value
                          ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                          : "border-gray-300 bg-white text-gray-600 hover:border-blue-400 hover:text-blue-600"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                {comparisonPeriod !== "none" && (
                  <p className="text-xs text-gray-400">
                    Groups data by{" "}
                    <span className="font-medium text-blue-600">
                      {COMPARISON_OPTIONS.find((o) => o.value === comparisonPeriod)?.dimField}
                    </span>{" "}
                    within the selected date range.
                  </p>
                )}
              </div>

              {/* Step 3 — filters */}
              <div className="border-t border-gray-100 pt-4">
                <ReportFilterBuilder
                  fields={filterFields}
                  filters={filterRows}
                  onChange={setFilterRows}
                />
              </div>

              {/* Step 4 — actions */}
              <div className="flex flex-wrap items-center gap-3 pt-1 border-t border-gray-100">
                <Button
                  onClick={handleRunReport}
                  disabled={isRunning}
                  className="bg-blue-600 hover:bg-blue-700 text-white gap-2 shadow-sm"
                >
                  <Play className="h-4 w-4" />
                  {isRunning ? "Running…" : "Run Report"}
                </Button>

                <div className="flex items-center gap-2 ml-auto">
                  <Select value={exportFormat} onValueChange={(v) => setExportFormat(v as "csv" | "xlsx")}>
                    <SelectTrigger className="w-36 h-9 text-sm border-gray-300">
                      <SelectValue placeholder="Format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="csv">CSV (.csv)</SelectItem>
                      <SelectItem value="xlsx">Excel (.xlsx)</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    onClick={() => doExport(exportFormat)}
                    disabled={!chartData}
                    className="h-9 gap-2 border-gray-300 text-gray-600"
                  >
                    <Download className="h-4 w-4" />
                    Export
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ── Results: spinner / success banner / table+chart ── */}
        {(isRunning || chartData) && selectedReport && (
          <ReportResults
            data={chartData}
            isRunning={isRunning}
            reportName={selectedReport.name}
            onDownloadCsv={() => doExport("csv")}
            onDownloadXlsx={() => doExport("xlsx")}
          />
        )}

        {/* ── Report Catalogs Table ── */}
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 pb-4">
            <div>
              <CardTitle className="text-base text-gray-800">Report Catalogs</CardTitle>
              <p className="text-sm text-gray-400 mt-0.5">
                {totalCount} report{totalCount !== 1 ? "s" : ""} total
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">Rows per page</span>
              <Select value={String(pageSize)} onValueChange={handlePageSizeChange}>
                <SelectTrigger className="w-20 h-8 text-sm border-gray-300">
                  <SelectValue placeholder="Rows" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <DataTable
              columns={DashboardColumns(triggerRunReport, (r) => {
                const openEdit = async () => {
                  try {
                    const cfg = await getConfig(r.reportId);
                    let dimensions = [] as any[];
                    let metrics = [] as any[];
                    try { dimensions = cfg.DimensionsJson ? JSON.parse(cfg.DimensionsJson) : []; } catch {}
                    try { metrics = cfg.MetricsJson ? JSON.parse(cfg.MetricsJson) : []; } catch {}
                    setFormInitialData({
                      name: r.name,
                      category: r.category,
                      type: r.type as any,
                      description: r.description,
                      isActive: r.isActive,
                      dimensions,
                      metrics,
                    });
                    setEditingCatalog(r);
                    setCatalogFormOpen(true);
                  } catch (err) {
                    console.log(err);
                    toast.error("Failed to load report config");
                  }
                };
                void openEdit();
              }, handleDeleteReport)}
              data={catalogs}
              limit={pageSize}
              loading={loading}
              onPageChange={handlePageChange}
              page={page}
              total={totalCount}
            />
          </CardContent>
        </Card>
      </div>

      <CatalogForm
        isOpen={catalogFormOpen}
        onClose={() => {
          setCatalogFormOpen(false);
          setEditingCatalog(null);
          setFormInitialData(null);
        }}
        onSubmit={editingCatalog ? handleUpdateReport : handleCreateReport}
        initialData={formInitialData}
      />
    </div>
  );
}

export default AdminDashboard;
