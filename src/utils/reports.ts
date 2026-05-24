import { parseISO, format } from "date-fns";
import { humanizeReportField } from "./reportLabels";
import type { ReportResult } from "@/types/reports";

export function reportResultToChartSeries(result: ReportResult | null, maxSeries = 4) {
  if (!result || !result.rows || result.rows.length === 0) {
    return { data: [] as any[], seriesKeys: [] as string[], isTimeSeries: false, xLabel: "" };
  }

  const rows = result.rows;
  const first = rows[0];
  const dimKeys = Object.keys(first.dimensions);
  const primaryDim = dimKeys.length > 0 ? dimKeys[0] : "x";

  const isIsoLike = (v: any) => {
    if (typeof v !== "string") return false;
    const maybe = parseISO(v);
    return !isNaN(maybe.getTime());
  };

  const isTimeSeries = rows.every((r) => isIsoLike(r.dimensions[primaryDim]));

  // pick metric keys that are numeric (at least one row has a numeric value)
  const allMetricKeys = Object.keys(first.metrics || {});
  const numericMetricKeys = allMetricKeys.filter((mk) =>
    rows.some((r) => {
      const val = r.metrics[mk];
      if (val === null || val === undefined) return false;
      return !Number.isNaN(Number(val));
    })
  );

  const metricKeys = numericMetricKeys.slice(0, maxSeries);

  const data = rows.map((r) => {
    const dimVal = r.dimensions[primaryDim];
    const label = isTimeSeries ? (() => {
      try {
        return format(parseISO(String(dimVal)), "yyyy-MM-dd");
      } catch {
        return String(dimVal);
      }
    })() : dimKeys.map((k) => String(r.dimensions[k])).join(" / ");

    const point: Record<string, any> = { x: label };
    for (const mk of metricKeys) {
      point[mk] = typeof r.metrics[mk] === "number" ? r.metrics[mk] : Number(r.metrics[mk]);
    }
    return point;
  });

  // sort by x when time-series
  if (isTimeSeries) {
    data.sort((a, b) => (a.x > b.x ? 1 : a.x < b.x ? -1 : 0));
  }

  return {
    data,
    seriesKeys: metricKeys,
    isTimeSeries,
    xLabel: humanizeReportField(primaryDim),
  };
}

export default {};
