import DataTable from "@/components/ui/dataTable/DataTable";
import { reportApi } from "@/services/privateApi/adminApi";
import type { Catalog } from "@/types/catalog";
import type { GeneralMetrics } from "@/types/generalMetrics";
import { useEffect, useState } from "react";
import { DashboardColumns } from "./components/DashboardColumns";
import { Button } from "@/components/ui/button";
import type { CatalogFormData } from "@/schemas/catalogSchema";
import { toast } from "sonner";
import CatalogForm from "./components/CatalogForm";
import RunReportDialog from "./components/RunReportDialog";
import { BOOKING, GENERAL, REVENUE } from "@/constants/reportBody";
import RevenueLineChart from "./components/RevenueLineChart";
import { useChartStore } from "@/store/chartStore";
import GeneralCard from "./components/GeneralCard";
import {
  BanknoteArrowUp,
  ChartNoAxesColumnIncreasing,
  UsersRound,
  Plus,
} from "lucide-react";
import BookingLineChart from "./components/BookingLineChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import BookStatusPieChart from "./components/BookStatusPieChart";

function AdminDashboard() {
  const [catalogs, setCatalogs] = useState<Catalog[]>([]);
  const [generalData, setGeneralData] = useState<GeneralMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedReport, setSelectedReport] = useState<Catalog | null>(null);
  const [open, setOpen] = useState({ catalog: false, runReport: false });
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  // const [reportResult, setReportResult] = useState(null);
  const { chartData, setChartData } = useChartStore();

  const fetchCatalogs = async () => {
    setLoading(true);
    try {
      const response = await reportApi.getCatalog({
        page,
        pageSize: 5,
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
      setGeneralData(response.data.data.totalMetrics);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreateReport = async (data: CatalogFormData) => {
    try {
      await reportApi.createReport(data);
      fetchCatalogs();
      toast.success("Report created successfully");
    } catch (error) {
      console.log(error);

      toast.error("Failed to create report");
    }
  };

  const REPORT_BODY_MAP: Record<string, any> = {
    Revenue: REVENUE,
    Booking: BOOKING,
  };

  const handleRunReport = async () => {
    if (!selectedReport) return;
    const reportBody = REPORT_BODY_MAP[selectedReport.name];
    if (!reportBody) {
      toast.error("Unsupported report type");
      return;
    }
    try {
      const response = await reportApi.runReport(selectedReport!.reportId, {
        ...reportBody,
        from: dateRange.from,
        to: dateRange.to,
      });
      setOpen({ ...open, runReport: false });
      setChartData(response.data.data);
      toast.success("Report run successfully");
    } catch (error) {
      toast.error("Failed to run report");
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCatalogs();
  }, [page]);

  useEffect(() => {
    if (catalogs.length > 0) {
      fetchGeneralData(catalogs[0].reportId);
    }
  }, [catalogs]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
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
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold gap-2"
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
          {chartData && selectedReport?.name === "Revenue" && (
            <Card className="border-0 shadow-sm">
              <RevenueLineChart data={chartData} />
            </Card>
          )}
          {chartData && selectedReport?.name === "Booking" && (
            <Card className="border-0 shadow-sm">
              <BookingLineChart data={chartData} />
            </Card>
          )}
        </div>

        {/* Reports Table */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Report Catalogs</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={DashboardColumns(triggerRunReport)}
              data={catalogs}
              limit={5}
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
        onClose={() => setOpen({ ...open, catalog: false })}
        onSubmit={handleCreateReport}
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
