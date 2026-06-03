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
import RunReportDialog from "./components/RunReportDialog";
import {
  GENERAL,
} from "@/constants/reportBody";
import RevenueLineChart from "./components/RevenueLineChart";
import { useChartStore } from "@/store/chartStore";
import GeneralCard from "./components/GeneralCard";
import {
  BanknoteArrowUp,
  ChartNoAxesColumnIncreasing,
  UsersRound,
  Plus,
  Download,
} from "lucide-react";
import BookingLineChart from "./components/BookingLineChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BookingStatusPieChart from "./components/BookingStatusPieChart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { humanizeReportField } from "@/utils/reportLabels";
// import BookStatusPieChart from "./components/BookStatusPieChart";

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
  const [open, setOpen] = useState({ catalog: false, runReport: false });
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [exportFormat, setExportFormat] = useState<"csv" | "xlsx">("csv");
  // const [reportResult, setReportResult] = useState(null);
  const { chartData, setChartData } = useChartStore();

  const normalizeReportName = (name?: string | null) =>
    name?.trim().toLowerCase() ?? "";

  const reportRows = chartData?.rows ?? [];
  const firstReportRow = reportRows[0];
  const reportDimensionKeys = firstReportRow?.dimensions
    ? Object.keys(firstReportRow.dimensions)
    : [];
  const reportMetricKeys = firstReportRow?.metrics
    ? Object.keys(firstReportRow.metrics)
    : [];

  const formatTableValue = (value: unknown) => {
    if (value === null || value === undefined) return "-";
    if (typeof value === "string" && value.includes("T")) {
      return value.split("T")[0];
    }
    if (typeof value === "number") return value.toLocaleString();
    return String(value);
  };

  const fetchCatalogs = async () => {
    setLoading(true);
    try {
      const response = await reportApi.getCatalog({
        page,
        pageSize,
      });
      setCatalogs(response.data.items);
      setTotalCount(response.data.totalCount);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGeneralData = async (reportId: string) => {
    try {
      const response = await reportApi.runReport(reportId, GENERAL);
      const totals = response.data.data.totalMetrics;
      setGeneralData({
        total_revenue: totals.total_revenue ?? 0,
        total_booking: totals.total_booking ?? 0,
        total_user: totals.total_user ?? 0,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreateReport = async (data: CatalogFormData) => {
    try {
      const { dimensions, metrics, ...reportDefinition } = data;

      await reportApi.createReport({
        ...reportDefinition,
        DimensionsJson: JSON.stringify(dimensions ?? []),
        MetricsJson: JSON.stringify(metrics ?? []),
        TimeRangeJson: JSON.stringify({}),
      });
      fetchCatalogs();
      toast.success("Report created successfully");
    } catch (error) {
      console.log(error);

      toast.error("Failed to create report");
    }
  };

  const handleUpdateReport = async (data: CatalogFormData) => {
    if (!editingCatalog) return;

    try {
      const { dimensions, metrics, ...reportDefinition } = data;

      await reportApi.updateReport(editingCatalog.reportId, {
        ...reportDefinition,
        DimensionsJson: JSON.stringify(dimensions ?? []),
        MetricsJson: JSON.stringify(metrics ?? []),
        TimeRangeJson: JSON.stringify({}),
      });

      setEditingCatalog(null);
      fetchCatalogs();
      toast.success("Report updated successfully");
    } catch (error) {
      console.log(error);
      toast.error("Failed to update report");
    }
  };

  const handleDeleteReport = async (catalog: Catalog) => {
    const confirm = window.confirm(`Delete report "${catalog.name}"? This cannot be undone.`);
    if (!confirm) return;

    try {
      await reportApi.deleteReport(catalog.reportId);
      fetchCatalogs();
      toast.success("Report deleted");
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete report");
    }
  };

  const buildReportRequest = () => {
    if (!selectedReport) return null;

    try {
      const getConfigJson = (key: string) => {
        const report = selectedReport as unknown as Record<string, unknown>;
        return (report[key] ?? report[key.charAt(0).toLowerCase() + key.slice(1)]) as string | null | undefined;
      };

      const request: Record<string, unknown> = {
        from: dateRange.from,
        to: dateRange.to,
      };

      const dimensionsJson = getConfigJson("DimensionsJson");
      if (dimensionsJson) {
        request.dimensions = JSON.parse(dimensionsJson);
      }

      const metricsJson = getConfigJson("MetricsJson");
      if (metricsJson) {
        request.metrics = JSON.parse(metricsJson);
      }

      const filtersJson = getConfigJson("FiltersJson");
      if (filtersJson) {
        request.filters = JSON.parse(filtersJson);
      }

      const timeRangeJson = getConfigJson("TimeRangeJson");
      if (timeRangeJson) {
        const parsedTimeRange = JSON.parse(timeRangeJson) as {
          from?: string;
          to?: string;
          searchTerm?: string;
          page?: number;
          pageSize?: number;
        };

        if (parsedTimeRange.from) request.from = parsedTimeRange.from;
        if (parsedTimeRange.to) request.to = parsedTimeRange.to;
        if (parsedTimeRange.searchTerm) request.searchTerm = parsedTimeRange.searchTerm;
        if (parsedTimeRange.page) request.page = parsedTimeRange.page;
        if (parsedTimeRange.pageSize) request.pageSize = parsedTimeRange.pageSize;
      }

      return request;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const isSelectedReportName = (...names: string[]) => {
    const selectedName = normalizeReportName(selectedReport?.name);
    return names.some((name) => normalizeReportName(name) === selectedName);
  };

  const handleRunReport = async () => {
    if (!selectedReport) return;
    const request = buildReportRequest();
    if (!request) {
      toast.error("Unsupported report type");
      return;
    }
    try {
      const response = await reportApi.runReport(
        selectedReport.reportId,
        request,
      );
      setOpen({ ...open, runReport: false });
      setChartData(response.data.data);
      toast.success("Report run successfully");
    } catch (error) {
      toast.error("Failed to run report");
      console.log(error);
    }
  };

  const handleExportReport = async () => {
    if (!selectedReport) return;

    const request = buildReportRequest();
    if (!request) {
      toast.error("Unsupported report type");
      return;
    }

    try {
      const response = await reportApi.exportReport(selectedReport.reportId, {
        fileName: `${selectedReport.name.replace(/\s+/g, "_").toLowerCase()}_${dateRange.from || "from"}_${dateRange.to || "to"}.${exportFormat}`,
        format: exportFormat,
        stream: true,
        runRequest: request,
      });

      const blob = response.data;
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `${selectedReport.name.replace(/\s+/g, "_").toLowerCase()}.${exportFormat}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
      toast.success("Report exported successfully");
    } catch (error) {
      toast.error("Failed to export report");
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCatalogs();
  }, [page, pageSize]);

  useEffect(() => {
    if (catalogs.length > 0) {
      fetchGeneralData(catalogs[0].reportId);
    }
  }, [catalogs]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (value: string) => {
    setPage(1);
    setPageSize(Number(value));
  };

  const triggerRunReport = (report: Catalog) => {
    setSelectedReport(report);
    setOpen({ ...open, runReport: true });
  };

  return (
    <div className="min-h-screen bg-gray-50 space-y-8">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome to admin dashboard</p>
          </div>
          <Button
            onClick={() => setOpen({ ...open, catalog: true })}
            className="bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold gap-2"
          >
            <Plus className="h-4 w-4" />
            Create Report
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {generalData && (
            <>
              <GeneralCard
                title="Total Revenue"
                data={generalData.total_revenue}
                Icon={BanknoteArrowUp}
              />
              <GeneralCard
                title="Total Bookings"
                data={generalData.total_booking}
                Icon={ChartNoAxesColumnIncreasing}
              />
              <GeneralCard
                title="Total Tenants"
                data={generalData.total_user}
                Icon={UsersRound}
              />
            </>
          )}
        </div>

        {/* Charts Section */}
        <div className="space-y-6">
          {chartData && isSelectedReportName("Revenue", "Revenue Performance") && (
            <RevenueLineChart data={chartData} />
          )}
          {chartData && isSelectedReportName("Booking", "Booking Summary") && (
            <BookingLineChart data={chartData} />
          )}
          {chartData && isSelectedReportName("Booking Status") && (
            <BookingStatusPieChart data={chartData} />
          )}

          {chartData && selectedReport && (
            <div className="flex flex-col items-end gap-3 sm:flex-row sm:items-center sm:justify-end">
              <Select
                value={exportFormat}
                onValueChange={(value) => setExportFormat(value as any)}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">CSV (.csv)</SelectItem>
                  <SelectItem value="xlsx">Excel (.xlsx)</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={handleExportReport}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          )}

          {reportRows.length > 0 && selectedReport && (
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>{selectedReport.name} Table</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50">
                        <th className="px-3 py-2 text-left font-medium text-gray-700">
                          #
                        </th>
                        {reportDimensionKeys.map((key) => (
                          <th
                            key={key}
                            className="px-3 py-2 text-left font-medium text-gray-700"
                          >
                            {humanizeReportField(key)}
                          </th>
                        ))}
                        {reportMetricKeys.map((key) => (
                          <th
                            key={key}
                            className="px-3 py-2 text-left font-medium text-gray-700"
                          >
                            {humanizeReportField(key)}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {reportRows.map((row: any, index: number) => (
                        <tr
                          key={index}
                          className="border-b border-gray-100 hover:bg-gray-50"
                        >
                          <td className="px-3 py-2 text-gray-500">
                            {index + 1}
                          </td>
                          {reportDimensionKeys.map((key) => (
                            <td key={key} className="px-3 py-2 text-gray-900">
                              {formatTableValue(row.dimensions?.[key])}
                            </td>
                          ))}
                          {reportMetricKeys.map((key) => (
                            <td key={key} className="px-3 py-2 text-gray-900">
                              {formatTableValue(row.metrics?.[key])}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Reports Table */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Report Catalogs</CardTitle>
              <p className="text-sm text-gray-500 mt-1">
                Showing {catalogs.length} of {totalCount} reports
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Rows per page</span>
              <Select
                value={String(pageSize)}
                onValueChange={handlePageSizeChange}
              >
                <SelectTrigger className="w-24">
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
          <CardContent>
            <DataTable
              columns={DashboardColumns(triggerRunReport, (r) => {
                // Edit handler: fetch config and open form
                const openEdit = async () => {
                  try {
                    const cfg = await getConfig(r.reportId);
                    let dimensions = [] as any[];
                    let metrics = [] as any[];

                    try {
                      dimensions = cfg.DimensionsJson ? JSON.parse(cfg.DimensionsJson) : [];
                    } catch {}
                    try {
                      metrics = cfg.MetricsJson ? JSON.parse(cfg.MetricsJson) : [];
                    } catch {}

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
                    setOpen({ ...open, catalog: true });
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

      {/* Dialogs */}
      <CatalogForm
        isOpen={open.catalog}
        onClose={() => {
          setOpen({ ...open, catalog: false });
          setEditingCatalog(null);
          setFormInitialData(null);
        }}
        onSubmit={editingCatalog ? handleUpdateReport : handleCreateReport}
        initialData={formInitialData}
      />

      {selectedReport && (
        <RunReportDialog
          open={open.runReport}
          onClose={() => setOpen({ ...open, runReport: false })}
          report={selectedReport}
          dateRange={dateRange}
          setDateRange={setDateRange}
          onRun={handleRunReport}
        />
      )}
    </div>
  );
}

export default AdminDashboard;
