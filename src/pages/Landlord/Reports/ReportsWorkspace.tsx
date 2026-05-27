import React, { useEffect, useState } from "react";
import {
  BookingSummaryBlueprint,
  RevenuePerformanceBlueprint,
  GuestReviewsBlueprint,
  SubscriptionPerformanceBlueprint,
  ComplianceTemporaryResidenceBlueprint,
  SupportTicketsBlueprint,
} from "../../../reports";
import { getConfig } from "../../../api/landlordReports";
import type { ReportRunRequestDto } from "../../../types/reports";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ReportPreviewPanels from "./ReportPreviewPanels";

const reportMap = {
  booking: {
    reportId: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1",
    label: "Booking Summary",
    Blueprint: BookingSummaryBlueprint,
  },
  revenue: {
    reportId: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2",
    label: "Revenue Performance",
    Blueprint: RevenuePerformanceBlueprint,
  },
  review: {
    reportId: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3",
    label: "Guest Reviews Analysis",
    Blueprint: GuestReviewsBlueprint,
  },
  subscription: {
    reportId: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4",
    label: "Subscription Performance",
    Blueprint: SubscriptionPerformanceBlueprint,
  },
  compliance: {
    reportId: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa5",
    label: "Compliance Temporary Residence",
    Blueprint: ComplianceTemporaryResidenceBlueprint,
  },
  support: {
    reportId: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa6",
    label: "Support Tickets Report",
    Blueprint: SupportTicketsBlueprint,
  },
} as const;

type ReportKey = keyof typeof reportMap;

const ReportsWorkspace: React.FC = () => {
  const [selected, setSelected] = useState<ReportKey>("booking");
  const [defaultRequest, setDefaultRequest] =
    useState<Partial<ReportRunRequestDto> | null>(null);
  const [isConfigLoading, setIsConfigLoading] = useState(false);
  const [previewResult, setPreviewResult] = useState<any | null>(null);
  const [previewRequest, setPreviewRequest] =
    useState<Partial<ReportRunRequestDto> | null>(null);

  const selectedReport = reportMap[selected];

  useEffect(() => {
    let mounted = true;

    async function load() {
      setIsConfigLoading(true);
      setDefaultRequest(null);

      try {
        const cfg = await getConfig(selectedReport.reportId);
        if (!mounted) {
          return;
        }

        const request: Partial<ReportRunRequestDto> = {};

        const dimensionsJson =
          (cfg as any).DimensionsJson ?? (cfg as any).dimensionsJson;
        const metricsJson =
          (cfg as any).MetricsJson ?? (cfg as any).metricsJson;
        const filtersJson =
          (cfg as any).FiltersJson ?? (cfg as any).filtersJson;
        const timeRangeJson =
          (cfg as any).TimeRangeJson ?? (cfg as any).timeRangeJson;

        if (dimensionsJson) {
          request.dimensions = JSON.parse(dimensionsJson);
        }

        if (metricsJson) {
          request.metrics = JSON.parse(metricsJson);
        }

        if (filtersJson) {
          request.filters = JSON.parse(filtersJson);
        }

        if (timeRangeJson) {
          const parsedTimeRange = JSON.parse(
            timeRangeJson,
          ) as Partial<ReportRunRequestDto>;
          if (parsedTimeRange.from) request.from = parsedTimeRange.from;
          if (parsedTimeRange.to) request.to = parsedTimeRange.to;
          if (parsedTimeRange.searchTerm)
            request.searchTerm = parsedTimeRange.searchTerm;
          if (parsedTimeRange.page) request.page = parsedTimeRange.page;
          if (parsedTimeRange.pageSize)
            request.pageSize = parsedTimeRange.pageSize;
        }

        setDefaultRequest(request);
        setPreviewRequest(request);
      } catch {
        setDefaultRequest(null);
        setPreviewRequest(null);
      } finally {
        if (mounted) {
          setIsConfigLoading(false);
        }
      }
    }

    void load();

    return () => {
      mounted = false;
    };
  }, [selectedReport.reportId]);

  const Blueprint = selectedReport.Blueprint;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
      <Card className="overflow-visible shadow-lg border-0 bg-white">
        <CardHeader className="border-b bg-muted/30 pb-4">
          <CardTitle className="text-2xl md:text-3xl font-bold tracking-tight">
            Landlord Reports
          </CardTitle>
          <CardDescription>
            Pick a seeded report, load its saved configuration, and adjust the
            query before running it.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-8">
          <div className="flex flex-col gap-8">
            <Card className="border-dashed bg-background/60 transition-shadow hover:shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Report catalog</CardTitle>
                <CardDescription>
                  Select a predefined report to open its blueprint.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Choose report
                  </label>
                  <Select
                    value={selected}
                    onValueChange={(value) => setSelected(value as ReportKey)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a report" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(reportMap).map(([key, entry]) => (
                        <SelectItem key={key} value={key}>
                          {entry.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {isConfigLoading ? (
              <div className="animate-pulse space-y-4 min-h-[640px] rounded-xl border border-slate-200 bg-white p-6">
                <div className="h-8 bg-muted rounded w-3/4"></div>
                <div className="h-32 bg-muted rounded"></div>
                <div className="h-8 bg-muted rounded w-1/2"></div>
              </div>
            ) : (
              <div className="space-y-8">
                {selected === "booking" && (
                  <Card className="overflow-visible rounded-xl border border-slate-200 bg-white shadow-sm">
                    <CardHeader className="border-b border-slate-200 px-6 py-4 bg-slate-50">
                      <CardTitle className="text-base font-semibold text-slate-900">
                        Report charts
                      </CardTitle>
                      <CardDescription className="text-sm text-slate-500">
                        Visual summary of the current preview result.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <ReportPreviewPanels
                        result={previewResult}
                        request={previewRequest ?? undefined}
                      />
                    </CardContent>
                  </Card>
                )}

                <div className="w-full overflow-x-auto">
                  <Card className="min-w-[1200px] overflow-visible rounded-xl border border-slate-200 bg-white shadow-sm">
                    <CardHeader className="border-b border-slate-200 px-6 py-4 bg-slate-50">
                      <CardTitle className="text-base font-semibold text-slate-900">
                        Report table
                      </CardTitle>
                      <CardDescription className="text-sm text-slate-500">
                        Run the report and scroll through the matching rows.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <Blueprint
                        reportId={selectedReport.reportId}
                        defaultRequest={defaultRequest ?? undefined}
                        tablePortalId="report-table-outlet"
                        onRunResult={(payload) => {
                          setPreviewRequest(payload.request);
                          setPreviewResult(payload.result);
                        }}
                      />
                    </CardContent>
                  </Card>
                </div>
                <div id="report-table-outlet" className="mt-6"></div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
};

export default ReportsWorkspace;
