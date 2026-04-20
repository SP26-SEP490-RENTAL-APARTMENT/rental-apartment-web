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
import { GENERAL, REVENUE } from "@/constants/reportBody";
import RevenueLineChart from "./components/RevenueLineChart";
import { useChartStore } from "@/store/chartStore";
import GeneralCard from "./components/GeneralCard";
import {
  BanknoteArrowUp,
  ChartNoAxesColumnIncreasing,
  UsersRound,
} from "lucide-react";
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

  const handleRunReport = async () => {
    if (!selectedReport) return;
    try {
      const response = await reportApi.runReport(selectedReport!.reportId, {
        ...REVENUE,
        from: dateRange.from,
        to: dateRange.to,
      });
      setOpen({ ...open, runReport: false });
      setChartData(response.data.data);
      // setReportResult(response.data.data);
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
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Button onClick={() => setOpen({ ...open, catalog: true })}>
          Create report
        </Button>
      </div>

      <DataTable
        columns={DashboardColumns(triggerRunReport)}
        data={catalogs}
        limit={5}
        loading={loading}
        onPageChange={handlePageChange}
        page={page}
        total={totalCount}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
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

      {chartData && <RevenueLineChart data={chartData} />}
      {/* {chartData && (<BookStatusPieChart data={chartData} />)} */}

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
