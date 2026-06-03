// React import not required with the automatic JSX runtime
import { useTranslation } from "react-i18next";
import {
  ChartContainer,
  ChartTooltip,
  ChartLegend,
} from "@/components/ui/chart";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import type { ReportRunRequestDto } from "../../../types/reports";

const COLORS = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
];

type Props = {
  result?: any | null;
  request?: Partial<ReportRunRequestDto> | undefined;
};

export default function ReportPreviewPanels({ result, request }: Props) {
  const { t } = useTranslation('reports');
  // derive KPIs and chart series from `result` when available, otherwise fall back to sample data
  const rawRows =
    (Array.isArray(result?.rows)
      ? result.rows
      : Array.isArray((result as any)?.Rows)
        ? (result as any).Rows
        : undefined) ?? [];
  const hasResultRows = rawRows.length > 0;

  const rows: any[] =
    (hasResultRows
      ? rawRows.map((r: any) => ({
          dimensions: r?.dimensions ?? r?.Dimensions ?? {},
          metrics: r?.metrics ?? r?.Metrics ?? {},
        }))
      : undefined) ??
    [];

  const totalMetrics: Record<string, number> =
    result?.totalMetrics ??
    (result as any)?.TotalMetrics ??
    (rows.length
      ? rows.reduce(
          (acc, r) => {
            Object.entries(r.metrics || {}).forEach(([k, v]) => {
              acc[k] = (acc[k] || 0) + (v || 0);
            });
            return acc;
          },
          {} as Record<string, number>,
        )
      : {});

  // prefer request-defined dimensions/metrics (use alias when present), fall back to rows heuristics
  // helper: pick dimension key from a dimension request item (alias or field) that actually exists on a row
  const pickDimensionKey = (dimReq?: { field?: string; alias?: string }) => {
    if (!dimReq) return undefined;
    const candidates = [dimReq.alias, dimReq.field].filter(Boolean) as string[];
    for (const c of candidates) {
      if (rows[0]?.dimensions && c in rows[0].dimensions) return c;
    }
    return candidates[0];
  };

  // helper: pick metric key (alias preferred, otherwise field) that exists in totalMetrics
  const pickMetricKey = (metricReq?: { field?: string; alias?: string }) => {
    if (!metricReq) return undefined;
    const candidates = [metricReq.alias, metricReq.field].filter(
      Boolean,
    ) as string[];
    for (const c of candidates) {
      if (c in totalMetrics) return c;
    }
    const metricKeysAll = Object.keys(totalMetrics);
    return metricKeysAll[0];
  };

  // determine primary xKey (use first request dimension if present)
  const requestedDim =
    request?.dimensions && request.dimensions.length
      ? request.dimensions[0]
      : undefined;
  const xKey =
    pickDimensionKey(requestedDim) ??
    (rows[0] && rows[0].dimensions
      ? Object.keys(rows[0].dimensions)[0]
      : "date");

  // determine primary and secondary series from request.metrics order
  const requestedMetrics = request?.metrics ?? [];
  const seriesMetricA =
    pickMetricKey(requestedMetrics[0]) ??
    Object.keys(totalMetrics)[0] ??
    "metricA";
  const seriesMetricB =
    pickMetricKey(requestedMetrics[1]) ??
    Object.keys(totalMetrics).find((k) => k !== seriesMetricA) ??
    "metricB";

  // Translated labels used as dataKey so Recharts legend renders them directly
  const labelA = t(`shell.metricLabels.${seriesMetricA}`, { defaultValue: seriesMetricA });
  const labelB = t(`shell.metricLabels.${seriesMetricB}`, { defaultValue: seriesMetricB });

  const timeseries = rows.map((r) => {
    const x = r.dimensions?.[xKey] ?? r.dimensions ?? "";
    return {
      x: typeof x === "string" ? x.split("T")[0] : String(x),
      [labelA]: r.metrics?.[seriesMetricA] ?? 0,
      [labelB]: r.metrics?.[seriesMetricB] ?? 0,
    };
  });

  // status breakdown and stacked series: prefer request/blueprint-specified dimension + metric keys
  let donut: Array<{ name: string; value: number }> = [];
  let stackData: any[] = [];

  const toStatusLabel = (value: unknown) => {
    const raw = String(value ?? "Unknown").trim();
    if (!raw) return t("shell.statuses.Unknown", { defaultValue: "Unknown" });
    // Normalise to PascalCase key for the translation lookup
    const key = raw
      .toLowerCase()
      .split(/[_\s-]+/)
      .filter(Boolean)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join("");
    return t(`shell.statuses.${key}`, { defaultValue: raw });
  };

  // find requested status/apartment dimension from request (prefer alias then field)
  const statusDimReq = request?.dimensions?.find(
    (d) =>
      /status|state|booking_status/i.test(String(d.alias ?? d.field ?? "")) ||
      /status|state|booking_status/i.test(String(d.field ?? "")),
  );
  const aptDimReq = request?.dimensions?.find(
    (d) =>
      /apartment|apt|unit|property/i.test(String(d.alias ?? d.field ?? "")) ||
      /apartment|apt|unit|property/i.test(String(d.field ?? "")),
  );

  const statusKey =
    pickDimensionKey(statusDimReq) ??
    (rows[0] && rows[0].dimensions
      ? Object.keys(rows[0].dimensions).find((k) =>
          /status|state|booking_status/i.test(k),
        )
      : undefined);
  const aptKey =
    pickDimensionKey(aptDimReq) ??
    (rows[0] && rows[0].dimensions
      ? Object.keys(rows[0].dimensions).find((k) =>
          /apartment|apt|unit|property/i.test(k),
        )
      : undefined);

  // choose count metric (for bookings by status) and revenue metric for revenue by apartment
  const pickCountMetricKey = (
    metrics?: Array<{ field?: string; alias?: string; aggregation?: string }>,
  ) => {
    if (!metrics || !metrics.length) return undefined;
    const byPref = metrics.find(
      (m) =>
        m.aggregation === "count" ||
        /booking|count/i.test(String(m.field ?? "")) ||
        /booking|count/i.test(String(m.alias ?? "")),
    );
    if (byPref) return pickMetricKey(byPref as any);
    return pickMetricKey(metrics[0] as any);
  };

  const pickRevenueMetricKey = (
    metrics?: Array<{ field?: string; alias?: string; aggregation?: string }>,
  ) => {
    if (!metrics || !metrics.length) return undefined;
    const byPref = metrics.find(
      (m) =>
        (m.aggregation === "sum" &&
          /revenue|amount|total/i.test(String(m.field ?? ""))) ||
        /revenue|amount|total/i.test(String(m.field ?? "")) ||
        /revenue|amount|total/i.test(String(m.alias ?? "")),
    );
    if (byPref) return pickMetricKey(byPref as any);
    return pickMetricKey(metrics[0] as any);
  };

  const countMetricKey = pickCountMetricKey(request?.metrics as any[]);
  const revenueMetricKey = pickRevenueMetricKey(request?.metrics as any[]);

  if (statusKey) {
    const byDate = new Map<string, Record<string, number>>();
    rows.forEach((r) => {
      const date = (r.dimensions?.[xKey] ?? "") + "";
      const status = toStatusLabel(r.dimensions?.[statusKey]);
      const cnt = countMetricKey
        ? (r.metrics?.[countMetricKey] ?? 0)
        : r.metrics
          ? Object.values(r.metrics).reduce(
              (s: number, v: any) => s + (v || 0),
              0,
            )
          : 1;
      const entry = byDate.get(date) || ({ date } as Record<string, any>);
      entry[status] = (entry[status] || 0) + cnt;
      byDate.set(date, entry);
    });
    stackData = Array.from(byDate.values());

    const map = new Map<string, number>();
    rows.forEach((r) => {
      const val = toStatusLabel(r.dimensions?.[statusKey]);
      const cnt = countMetricKey
        ? (r.metrics?.[countMetricKey] ?? 0)
        : r.metrics
          ? Object.values(r.metrics).reduce(
              (s: number, v: any) => s + (v || 0),
              0,
            )
          : 1;
      map.set(val, (map.get(val) || 0) + cnt);
    });
    donut = Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  } else if (hasResultRows) {
    const metricKeysFromRows = rows[0]?.metrics
      ? Object.keys(rows[0].metrics)
      : [];
    const allMetricKeys = Array.from(
      new Set([...metricKeysFromRows, ...Object.keys(totalMetrics)]),
    );

    const findStatusMetricKey = (pattern: RegExp) =>
      allMetricKeys.find((k) => pattern.test(k));

    const statusMetricDefs = [
      {
        label: t('shell.statuses.Pending'),
        key: findStatusMetricKey(/pending(_booking)?(_count)?|pending/i),
      },
      {
        label: t('shell.statuses.Confirmed'),
        key: findStatusMetricKey(
          /confirmed(_booking)?(_count)?|confirmed/i,
        ),
      },
      {
        label: t('shell.statuses.Completed'),
        key: findStatusMetricKey(
          /completed(_booking)?(_count)?|completed/i,
        ),
      },
      {
        label: t('shell.statuses.Cancelled'),
        key: findStatusMetricKey(
          /cancelled(_booking)?(_count)?|canceled(_booking)?(_count)?|cancelled|canceled/i,
        ),
      },
    ].filter((s) => Boolean(s.key)) as Array<{ label: string; key: string }>;

    if (statusMetricDefs.length) {
      stackData = rows.map((r) => {
        const dateRaw = r.dimensions?.[xKey] ?? "";
        const entry: Record<string, any> = {
          date:
            typeof dateRaw === "string"
              ? dateRaw.split("T")[0]
              : String(dateRaw),
        };
        statusMetricDefs.forEach((s) => {
          entry[s.label] = Number(r.metrics?.[s.key] ?? 0);
        });
        return entry;
      });

      donut = statusMetricDefs
        .map((s) => ({
          name: s.label,
          value: rows.reduce(
            (sum: number, r: any) => sum + Number(r.metrics?.[s.key] ?? 0),
            0,
          ),
        }))
        .filter((d) => d.value > 0);
    }
  }

  const donutConfig = donut.reduce(
    (acc, item) => {
      acc[item.name] = { label: item.name };
      return acc;
    },
    {} as Record<string, { label: string }>,
  );

  // revenue by apartment using requested revenue metric
  const revenueLabel = t("shell.metricLabels.total_revenue", { defaultValue: "Revenue" });
  let revenueApts: Array<{ name: string; [key: string]: number | string }> = [];
  if (aptKey) {
    const map = new Map<string, number>();
    rows.forEach((r) => {
      const name = String(r.dimensions?.[aptKey] ?? "Unknown");
      const rev = revenueMetricKey
        ? (r.metrics?.[revenueMetricKey] ?? 0)
        : r.metrics
          ? (Object.values(r.metrics || {})[0] ?? 0)
          : 0;
      map.set(name, (map.get(name) || 0) + (rev as number));
    });
    revenueApts = Array.from(map.entries()).map(([name, rev]) => ({
      name,
      [revenueLabel]: rev,
    }));
  }

  const hasMainChartData = timeseries.length > 0;
  const hasDonutData = donut.length > 0;
  const hasStackData =
    stackData.length > 0 &&
    stackData.some((row) => Object.keys(row).some((k) => k !== "date"));
  const hasRevenueApartmentData = revenueApts.length > 0;
  const hasAnyGraphData =
    hasMainChartData ||
    hasDonutData ||
    hasStackData ||
    hasRevenueApartmentData;

  return (
    <div className="space-y-6">
      {!hasAnyGraphData ? null : (
        <>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {hasMainChartData ? (
          <div className="lg:col-span-2">
            <Card className="min-h-[320px] bg-white border border-slate-200 rounded-xl shadow-sm">
              <CardHeader>
                <CardTitle>{t('charts.mainTitle')}</CardTitle>
                <CardDescription>{t('charts.mainDesc')}</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  id="main"
                  className="!aspect-auto h-[320px] w-full"
                  config={{
                    [labelA]: { label: labelA },
                    [labelB]: { label: labelB },
                  }}
                >
                  <LineChart data={timeseries}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="x" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <ChartTooltip />
                    <ChartLegend />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey={labelA}
                      stroke="var(--color-chart-1)"
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey={labelB}
                      stroke="var(--color-chart-2)"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                    />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        ) : null}

        {hasDonutData ? (
          <div>
            <Card className="min-h-[320px] bg-white border border-slate-200 rounded-xl shadow-sm">
              <CardHeader>
                <CardTitle>{t('charts.statusBreakdown')}</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  id="donut"
                  className="!aspect-auto h-[320px] w-full"
                  config={donutConfig}
                >
                  <PieChart>
                    <Pie
                      data={donut}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={40}
                      outerRadius={70}
                      fill="#8884d8"
                      label
                    >
                      {donut.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <ChartTooltip />
                    <ChartLegend />
                  </PieChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        ) : null}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {hasStackData ? (
          <Card className="bg-white border border-slate-200 rounded-xl shadow-sm">
            <CardHeader>
              <CardTitle>{t('charts.byStatus')}</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                id="stacked"
                className="!aspect-auto h-[320px] w-full"
                config={{}}
              >
                <BarChart data={stackData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <ChartTooltip />
                  <ChartLegend />
                  {/* dynamically render bars for keys found in the first stackData entry */}
                  {stackData &&
                    stackData[0] &&
                    Object.keys(stackData[0])
                      .filter((k) => k !== "date")
                      .map((key, idx) => (
                        <Bar
                          key={key}
                          dataKey={key}
                          stackId="a"
                          fill={COLORS[idx % COLORS.length]}
                        />
                      ))}
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        ) : null}

        {hasRevenueApartmentData ? (
          <Card className="bg-white border border-slate-200 rounded-xl shadow-sm">
            <CardHeader>
              <CardTitle>{t('charts.byApartment')}</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                id="revenue-apartments"
                className="!aspect-auto h-[320px] w-full"
                config={{
                  [revenueLabel]: { label: revenueLabel },
                }}
              >
                <BarChart data={revenueApts}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip />
                  <ChartLegend />
                  <Bar dataKey={revenueLabel} fill="var(--color-chart-4)" />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        ) : null}
      </div>
        </>
      )}
    </div>
  );
}
