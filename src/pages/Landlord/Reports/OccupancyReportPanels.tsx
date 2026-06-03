import { useTranslation } from "react-i18next";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import type { ReportRunRequestDto } from "../../../types/reports";

// ── KPI config ──────────────────────────────────────────────────────────────

type KpiFormat = "percent" | "integer" | "decimal" | "currency";

interface KpiDef {
  key: string;
  labelKey: string; // shell.metricLabels.*
  format: KpiFormat;
}

const KPI_DEFS: KpiDef[] = [
  { key: "occupancy_percent",        labelKey: "occupancy_percent",        format: "percent"   },
  { key: "total_booked_nights",      labelKey: "total_booked_nights",      format: "integer"   },
  { key: "total_available_nights",   labelKey: "total_available_nights",   format: "integer"   },
  { key: "avg_length_of_stay",       labelKey: "avg_length_of_stay",       format: "decimal"   },
  { key: "revenue_per_occupied_night", labelKey: "revenue_per_occupied_night", format: "currency" },
  { key: "peak_occupancy_days",      labelKey: "peak_occupancy_days",      format: "integer"   },
  { key: "low_occupancy_days",       labelKey: "low_occupancy_days",       format: "integer"   },
];

// ── helpers ──────────────────────────────────────────────────────────────────

const fmt = (value: number | undefined, format: KpiFormat): string => {
  if (value === undefined || value === null) return "—";
  switch (format) {
    case "percent":
      return new Intl.NumberFormat(undefined, {
        style: "percent",
        maximumFractionDigits: 1,
      }).format(value / 100);
    case "integer":
      return new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(value);
    case "decimal":
      return new Intl.NumberFormat(undefined, {
        minimumFractionDigits: 1,
        maximumFractionDigits: 2,
      }).format(value);
    case "currency":
      return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: "VND",
        maximumFractionDigits: 0,
      }).format(value);
  }
};

// Choose primary dimension key from the request, with fallback to first dimension in rows
const pickDimKey = (
  request: Partial<ReportRunRequestDto> | undefined,
  sampleDims: Record<string, unknown>,
): string => {
  if (request?.dimensions?.length) {
    const req = request.dimensions[0];
    for (const k of [req.alias, req.field].filter(Boolean) as string[]) {
      if (k in sampleDims) return k;
    }
  }
  return Object.keys(sampleDims)[0] ?? "date";
};

// Detect whether the primary dimension is time-based
const isTimeDim = (key: string) =>
  /^(date|week|month|quarter|year)/.test(key);

// Detect whether the primary dimension is apartment/city (categorical)
const isCategoricalDim = (key: string) =>
  /^(apartment|city|day_of_week|holiday)/.test(key);

// ── chart color tokens ───────────────────────────────────────────────────────

const C = {
  c1: "var(--color-chart-1)",
  c2: "var(--color-chart-2)",
  c3: "var(--color-chart-3)",
  c4: "var(--color-chart-4)",
  c5: "var(--color-chart-5)",
};

// ── component ────────────────────────────────────────────────────────────────

type Props = {
  result?: any | null;
  request?: Partial<ReportRunRequestDto> | undefined;
};

export default function OccupancyReportPanels({ result, request }: Props) {
  const { t } = useTranslation("reports");

  // ── normalise rows ──────────────────────────────────────────────────────

  const rawRows: any[] =
    (Array.isArray(result?.rows)
      ? result.rows
      : Array.isArray((result as any)?.Rows)
        ? (result as any).Rows
        : []) ?? [];

  const rows = rawRows.map((r: any) => ({
    dimensions: (r?.dimensions ?? r?.Dimensions ?? {}) as Record<string, unknown>,
    metrics: (r?.metrics ?? r?.Metrics ?? {}) as Record<string, number>,
  }));

  const totalMetrics: Record<string, number> =
    result?.totalMetrics ??
    (result as any)?.TotalMetrics ??
    {};

  const hasRows = rows.length > 0;

  // ── KPI cards ───────────────────────────────────────────────────────────

  const kpiCards = KPI_DEFS.map((def) => ({
    label: t(`shell.metricLabels.${def.labelKey}`, { defaultValue: def.key }),
    value: fmt(totalMetrics[def.key], def.format),
    raw: totalMetrics[def.key],
  })).filter((c) => c.raw !== undefined);

  // ── determine primary dimension ─────────────────────────────────────────

  const sampleDims = rows[0]?.dimensions ?? {};
  const xKey = pickDimKey(request, sampleDims);
  const isTime = isTimeDim(xKey);
  const isCat  = isCategoricalDim(xKey);

  // ── main chart data ─────────────────────────────────────────────────────
  // Always include occupancy_percent; also booked vs available for context

  const mainData = rows.map((r) => {
    const xRaw = r.dimensions[xKey] ?? "";
    const x = typeof xRaw === "string" ? xRaw.split("T")[0] : String(xRaw);
    return {
      x,
      [t("shell.metricLabels.occupancy_percent", { defaultValue: "Occupancy %" })]:
        +(r.metrics["occupancy_percent"] ?? 0).toFixed(1),
      [t("shell.metricLabels.total_booked_nights", { defaultValue: "Booked Nights" })]:
        r.metrics["total_booked_nights"] ?? 0,
      [t("shell.metricLabels.total_available_nights", { defaultValue: "Available Nights" })]:
        r.metrics["total_available_nights"] ?? 0,
    };
  });

  const occLabel   = t("shell.metricLabels.occupancy_percent",      { defaultValue: "Occupancy %" });
  const bookedLabel= t("shell.metricLabels.total_booked_nights",    { defaultValue: "Booked Nights" });
  const availLabel = t("shell.metricLabels.total_available_nights", { defaultValue: "Available Nights" });

  // ── ADR / ALOS line data (time dimension only) ──────────────────────────

  const alosLabel = t("shell.metricLabels.avg_length_of_stay", { defaultValue: "Avg Stay" });
  const adrLabel  = t("shell.metricLabels.revenue_per_occupied_night", { defaultValue: "Revenue/Night" });

  const alosAdrData = rows.map((r) => {
    const xRaw = r.dimensions[xKey] ?? "";
    const x = typeof xRaw === "string" ? xRaw.split("T")[0] : String(xRaw);
    return {
      x,
      [alosLabel]: +(r.metrics["avg_length_of_stay"] ?? 0).toFixed(2),
      [adrLabel]:  Math.round(r.metrics["revenue_per_occupied_night"] ?? 0),
    };
  });

  // ── apartment bar chart (when apartment_name is a dimension) ───────────

  const aptKey =
    Object.keys(sampleDims).find((k) => /apartment|apt|unit|property/i.test(k));

  const aptBarData: { name: string; [k: string]: number | string }[] = (() => {
    if (!aptKey) return [];
    const map = new Map<string, { booked: number; avail: number; occ: number }>();
    rows.forEach((r) => {
      const name = String(r.dimensions[aptKey] ?? "Unknown");
      const prev = map.get(name) ?? { booked: 0, avail: 0, occ: 0 };
      map.set(name, {
        booked: prev.booked + (r.metrics["total_booked_nights"] ?? 0),
        avail:  prev.avail  + (r.metrics["total_available_nights"] ?? 0),
        occ:    prev.occ    + (r.metrics["occupancy_percent"] ?? 0),
      });
    });
    return Array.from(map.entries()).map(([name, v]) => ({
      name,
      [bookedLabel]: v.booked,
      [availLabel]:  v.avail,
    }));
  })();

  // ── day-of-week heatmap (simple horizontal bar when dim is day_of_week) ─

  const dowData: { name: string; [k: string]: number | string }[] = (() => {
    const dowKey = Object.keys(sampleDims).find((k) => /day_of_week/.test(k));
    if (!dowKey) return [];
    const map = new Map<string, number>();
    rows.forEach((r) => {
      const day = String(r.dimensions[dowKey] ?? "");
      const occ = r.metrics["occupancy_percent"] ?? 0;
      const prev = map.get(day) ?? 0;
      // average approximation: keep running sum, divide at render
      map.set(day, prev + occ);
    });
    // Count how many rows per day to compute average
    const cnt = new Map<string, number>();
    rows.forEach((r) => {
      const day = String(r.dimensions[Object.keys(sampleDims).find((k) => /day_of_week/.test(k))!] ?? "");
      cnt.set(day, (cnt.get(day) ?? 0) + 1);
    });
    return Array.from(map.entries()).map(([name, sum]) => ({
      name,
      [occLabel]: +((sum / (cnt.get(name) ?? 1)).toFixed(1)),
    }));
  })();

  // ── visibility flags ────────────────────────────────────────────────────

  const showMain    = hasRows && mainData.length > 0 && (isTime || isCat || mainData.length > 1);
  const showAlosAdr = hasRows && isTime && alosAdrData.some((d) => d[alosLabel] || d[adrLabel]);
  const showAptBar  = hasRows && aptBarData.length > 1;
  const showDow     = hasRows && dowData.length > 0;
  const showAny     = kpiCards.length > 0 || showMain || showAlosAdr || showAptBar || showDow;

  if (!showAny) return null;

  // ── chart config objects ────────────────────────────────────────────────

  const mainConfig = {
    [occLabel]:    { label: occLabel,    color: C.c1 },
    [bookedLabel]: { label: bookedLabel, color: C.c2 },
    [availLabel]:  { label: availLabel,  color: C.c3 },
  };

  const alosAdrConfig = {
    [alosLabel]: { label: alosLabel, color: C.c4 },
    [adrLabel]:  { label: adrLabel,  color: C.c5 },
  };

  const aptConfig = {
    [bookedLabel]: { label: bookedLabel, color: C.c1 },
    [availLabel]:  { label: availLabel,  color: C.c3 },
  };

  const dowConfig = {
    [occLabel]: { label: occLabel, color: C.c1 },
  };

  // ── render ──────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* KPI cards */}
      {kpiCards.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
          {kpiCards.map((card) => (
            <Card
              key={card.label}
              className="bg-white border border-slate-200 rounded-xl shadow-sm"
            >
              <CardContent className="pt-4 pb-4 px-4">
                <p className="text-xs font-medium text-muted-foreground truncate">
                  {card.label}
                </p>
                <p className="mt-1 text-xl font-bold text-slate-900 truncate">
                  {card.value}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Main occupancy + booked/available chart */}
      {showMain && (
        <Card className="bg-white border border-slate-200 rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle>
              {t("occupancy.charts.occupancyTrend", { defaultValue: "Occupancy Trend" })}
            </CardTitle>
            <CardDescription>
              {t("occupancy.charts.occupancyTrendDesc", {
                defaultValue: "Occupancy rate and booked vs. available nights",
              })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              id="occ-main"
              className="!aspect-auto h-[320px] w-full"
              config={mainConfig}
            >
              <LineChart data={mainData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="x" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="left"  tick={{ fontSize: 11 }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey={occLabel}
                  stroke={C.c1}
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey={bookedLabel}
                  stroke={C.c2}
                  strokeWidth={2}
                  dot={{ r: 2 }}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey={availLabel}
                  stroke={C.c3}
                  strokeWidth={1}
                  strokeDasharray="4 4"
                  dot={false}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      {/* ALOS + ADR over time */}
      {showAlosAdr && (
        <Card className="bg-white border border-slate-200 rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle>
              {t("occupancy.charts.alosAdr", { defaultValue: "Avg Stay & Revenue per Night" })}
            </CardTitle>
            <CardDescription>
              {t("occupancy.charts.alosAdrDesc", {
                defaultValue: "Average length of stay (nights) and revenue per occupied night",
              })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              id="occ-alos-adr"
              className="!aspect-auto h-[280px] w-full"
              config={alosAdrConfig}
            >
              <LineChart data={alosAdrData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="x" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="left"  tick={{ fontSize: 11 }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey={alosLabel}
                  stroke={C.c4}
                  strokeWidth={2}
                  dot={{ r: 2 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey={adrLabel}
                  stroke={C.c5}
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Booked vs Available by apartment */}
        {showAptBar && (
          <Card className="bg-white border border-slate-200 rounded-xl shadow-sm">
            <CardHeader>
              <CardTitle>
                {t("occupancy.charts.nightsByApartment", { defaultValue: "Nights by Apartment" })}
              </CardTitle>
              <CardDescription>
                {t("occupancy.charts.nightsByApartmentDesc", {
                  defaultValue: "Total booked vs. available nights per apartment",
                })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                id="occ-apt-bar"
                className="!aspect-auto h-[280px] w-full"
                config={aptConfig}
              >
                <BarChart data={aptBarData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={120}
                    tick={{ fontSize: 11 }}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar dataKey={availLabel}  fill={C.c3} radius={[0, 4, 4, 0]} />
                  <Bar dataKey={bookedLabel} fill={C.c1} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        )}

        {/* Occupancy % by day of week */}
        {showDow && (
          <Card className="bg-white border border-slate-200 rounded-xl shadow-sm">
            <CardHeader>
              <CardTitle>
                {t("occupancy.charts.dowOccupancy", { defaultValue: "Occupancy by Day of Week" })}
              </CardTitle>
              <CardDescription>
                {t("occupancy.charts.dowOccupancyDesc", {
                  defaultValue: "Average occupancy rate (%) per day",
                })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                id="occ-dow"
                className="!aspect-auto h-[280px] w-full"
                config={dowConfig}
              >
                <BarChart data={dowData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey={occLabel} fill={C.c2} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
