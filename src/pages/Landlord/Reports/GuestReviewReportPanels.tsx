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

// ── chart color tokens ───────────────────────────────────────────────────────

const C = {
  c1: "var(--color-chart-1)",
  c2: "var(--color-chart-2)",
  c3: "var(--color-chart-3)",
  c4: "var(--color-chart-4)",
  c5: "var(--color-chart-5)",
};

// ── KPI definitions ──────────────────────────────────────────────────────────

type KpiFormat = "rating" | "integer" | "percent";

interface KpiDef {
  key: string;
  labelKey: string;
  format: KpiFormat;
}

const KPI_DEFS: KpiDef[] = [
  { key: "average_rating",          labelKey: "average_rating",          format: "rating"   },
  { key: "review_avg_rating",       labelKey: "review_avg_rating",       format: "rating"   },
  { key: "total_reviews",           labelKey: "total_reviews",           format: "integer"  },
  { key: "review_count",            labelKey: "review_count",            format: "integer"  },
  { key: "response_rate",           labelKey: "response_rate",           format: "percent"  },
  { key: "five_star_reviews_percent", labelKey: "five_star_reviews_percent", format: "percent" },
  { key: "five_star_review_percent",  labelKey: "five_star_review_percent",  format: "percent" },
  { key: "one_star_reviews_percent",  labelKey: "one_star_reviews_percent",  format: "percent" },
  { key: "one_star_review_percent",   labelKey: "one_star_review_percent",   format: "percent" },
];

// Only one variant of each logical KPI should appear (first match wins)
const LOGICAL_KPI_ORDER = [
  ["average_rating", "review_avg_rating"],
  ["total_reviews",  "review_count"],
  ["response_rate"],
  ["five_star_reviews_percent", "five_star_review_percent"],
  ["one_star_reviews_percent",  "one_star_review_percent"],
];

const fmt = (value: number | undefined, format: KpiFormat): string => {
  if (value === undefined || value === null) return "—";
  switch (format) {
    case "rating":
      return value.toFixed(2);
    case "integer":
      return new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(value);
    case "percent":
      return `${value.toFixed(1)}%`;
  }
};

// ── helpers ──────────────────────────────────────────────────────────────────

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

const isTimeDim = (key: string) =>
  /^(date|week|month|quarter|year)/.test(key);

// ── Star display ─────────────────────────────────────────────────────────────

function StarRating({ rating }: { rating: number }) {
  const filled = Math.round(rating);
  return (
    <span className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          className={`h-4 w-4 ${i < filled ? "text-amber-400 fill-amber-400" : "text-slate-300 fill-slate-200"}`}
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </span>
  );
}

// ── Semi-circular gauge ───────────────────────────────────────────────────────

function RatingGauge({ rating }: { rating: number }) {
  const pct = Math.min(Math.max(rating / 5, 0), 1);
  const r = 54;
  const cx = 64;
  const cy = 64;
  const startAngle = Math.PI;
  const endAngle = 0;
  const arcLength = Math.PI;
  const filledAngle = startAngle - pct * arcLength;

  const polarToCartesian = (angle: number) => ({
    x: cx + r * Math.cos(angle),
    y: cy - r * Math.sin(angle),
  });

  const start = polarToCartesian(startAngle);
  const end   = polarToCartesian(endAngle);
  const fill  = polarToCartesian(filledAngle);

  const trackPath = `M ${start.x} ${start.y} A ${r} ${r} 0 0 1 ${end.x} ${end.y}`;
  const fillPath  = `M ${start.x} ${start.y} A ${r} ${r} 0 ${pct > 0.5 ? 0 : 0} 1 ${fill.x} ${fill.y}`;

  const color = rating >= 4 ? "#22c55e" : rating >= 3 ? "#f59e0b" : "#ef4444";

  return (
    <div className="flex flex-col items-center gap-1">
      <svg viewBox="0 0 128 72" className="w-32 h-16">
        <path d={trackPath} fill="none" stroke="#e2e8f0" strokeWidth="10" strokeLinecap="round" />
        {pct > 0 && (
          <path d={fillPath} fill="none" stroke={color} strokeWidth="10" strokeLinecap="round" />
        )}
        <text x={cx} y={cy - 4} textAnchor="middle" className="text-lg font-bold" fill={color} fontSize="20" fontWeight="700">
          {rating.toFixed(1)}
        </text>
        <text x={cx} y={cy + 12} textAnchor="middle" fill="#94a3b8" fontSize="10">
          / 5
        </text>
      </svg>
      <StarRating rating={rating} />
    </div>
  );
}

// ── Progress bar (horizontal) ─────────────────────────────────────────────────

function PercentBar({ pct, color }: { pct: number; color: string }) {
  return (
    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
      <div
        className="h-2 rounded-full transition-all"
        style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: color }}
      />
    </div>
  );
}

// ── Circular progress ─────────────────────────────────────────────────────────

function CircularProgress({ pct, color }: { pct: number; color: string }) {
  const r = 18;
  const circ = 2 * Math.PI * r;
  const filled = (Math.min(pct, 100) / 100) * circ;
  return (
    <svg viewBox="0 0 44 44" className="w-12 h-12 -rotate-90">
      <circle cx="22" cy="22" r={r} fill="none" stroke="#e2e8f0" strokeWidth="5" />
      <circle
        cx="22" cy="22" r={r} fill="none"
        stroke={color} strokeWidth="5"
        strokeDasharray={`${filled} ${circ}`}
        strokeLinecap="round"
      />
    </svg>
  );
}

// ── component ─────────────────────────────────────────────────────────────────

type Props = {
  result?: any | null;
  request?: Partial<ReportRunRequestDto> | undefined;
  onDrillDown?: (field: string, value: string) => void;
};

export default function GuestReviewReportPanels({ result, request, onDrillDown }: Props) {
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
    result?.totalMetrics ?? (result as any)?.TotalMetrics ?? {};

  const hasRows = rows.length > 0;

  // ── KPI cards (deduplicated by logical group) ───────────────────────────

  const resolvedKpis = LOGICAL_KPI_ORDER.flatMap((variants) => {
    for (const key of variants) {
      const def = KPI_DEFS.find((d) => d.key === key);
      if (def && totalMetrics[key] !== undefined) {
        return [{ ...def, raw: totalMetrics[key], value: fmt(totalMetrics[key], def.format) }];
      }
    }
    return [];
  });

  // ── rating value ────────────────────────────────────────────────────────

  const avgRating =
    totalMetrics["average_rating"] ?? totalMetrics["review_avg_rating"] ?? null;

  // ── determine primary dimension ─────────────────────────────────────────

  const sampleDims = rows[0]?.dimensions ?? {};
  const xKey = pickDimKey(request, sampleDims);
  const isTime = isTimeDim(xKey);

  // ── trend chart data ────────────────────────────────────────────────────

  const ratingLabel      = t("shell.metricLabels.average_rating",            { defaultValue: "Avg Rating" });
  const reviewCountLabel = t("shell.metricLabels.total_reviews",             { defaultValue: "Reviews" });
  const responseLabel    = t("shell.metricLabels.response_rate",             { defaultValue: "Response Rate" });
  const fiveStarLabel    = t("shell.metricLabels.five_star_reviews_percent", { defaultValue: "5-Star %" });
  const oneStarLabel     = t("shell.metricLabels.one_star_reviews_percent",  { defaultValue: "1-Star %" });

  const trendData = rows.map((r) => {
    const xRaw = r.dimensions[xKey] ?? "";
    const x = typeof xRaw === "string" ? xRaw.split("T")[0] : String(xRaw);
    return {
      x,
      [ratingLabel]:
        +(r.metrics["average_rating"] ?? r.metrics["review_avg_rating"] ?? 0).toFixed(2),
      [reviewCountLabel]:
        Math.round(r.metrics["total_reviews"] ?? r.metrics["review_count"] ?? 0),
    };
  });

  // ── apartment bar chart ─────────────────────────────────────────────────

  const aptKey = Object.keys(sampleDims).find((k) =>
    /apartment|apt|unit|property/i.test(k),
  );

  const aptBarData: { name: string; [k: string]: number | string }[] = (() => {
    if (!aptKey) return [];
    const map = new Map<string, { rating: number; count: number; cnt: number }>();
    rows.forEach((r) => {
      const name = String(r.dimensions[aptKey] ?? "Unknown");
      const prev = map.get(name) ?? { rating: 0, count: 0, cnt: 0 };
      map.set(name, {
        rating: prev.rating + (r.metrics["average_rating"] ?? r.metrics["review_avg_rating"] ?? 0),
        count:  prev.count  + (r.metrics["total_reviews"] ?? r.metrics["review_count"] ?? 0),
        cnt:    prev.cnt + 1,
      });
    });
    return Array.from(map.entries()).map(([name, v]) => ({
      name,
      [ratingLabel]:      +(v.rating / v.cnt).toFixed(2),
      [reviewCountLabel]: Math.round(v.count),
    }));
  })();

  // ── response rate + star breakdown (time-based) ─────────────────────────

  const sentimentData = rows.map((r) => {
    const xRaw = r.dimensions[xKey] ?? "";
    const x = typeof xRaw === "string" ? xRaw.split("T")[0] : String(xRaw);
    return {
      x,
      [responseLabel]:
        +(r.metrics["response_rate"] ?? 0).toFixed(1),
      [fiveStarLabel]:
        +(r.metrics["five_star_reviews_percent"] ?? r.metrics["five_star_review_percent"] ?? 0).toFixed(1),
      [oneStarLabel]:
        +(r.metrics["one_star_reviews_percent"] ?? r.metrics["one_star_review_percent"] ?? 0).toFixed(1),
    };
  });

  // ── visibility flags ────────────────────────────────────────────────────

  const showGauge      = avgRating !== null;
  const showKpis       = resolvedKpis.length > 0;
  const showTrend      = hasRows && trendData.length > 1 && isTime;
  const showAptBar     = hasRows && aptBarData.length > 1;
  const showSentiment  = hasRows && sentimentData.length > 1 && isTime &&
    sentimentData.some((d) => d[fiveStarLabel] || d[oneStarLabel] || d[responseLabel]);

  const showAny = showGauge || showKpis || showTrend || showAptBar || showSentiment;

  if (!showAny) return null;

  // ── chart configs ───────────────────────────────────────────────────────

  const trendConfig = {
    [ratingLabel]:      { label: ratingLabel,      color: C.c1 },
    [reviewCountLabel]: { label: reviewCountLabel, color: C.c2 },
  };

  const aptConfig = {
    [ratingLabel]:      { label: ratingLabel,      color: C.c1 },
    [reviewCountLabel]: { label: reviewCountLabel, color: C.c2 },
  };

  const sentimentConfig = {
    [fiveStarLabel]: { label: fiveStarLabel, color: C.c3 },
    [oneStarLabel]:  { label: oneStarLabel,  color: C.c5 },
    [responseLabel]: { label: responseLabel, color: C.c4 },
  };

  // ── render ──────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">

      {/* Top row: gauge + KPI cards */}
      {(showGauge || showKpis) && (
        <div className="flex flex-wrap gap-4 items-stretch">

          {/* Gauge card */}
          {showGauge && (
            <Card className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col items-center justify-center p-4 min-w-[160px]">
              <p className="text-xs font-medium text-muted-foreground mb-2 text-center">
                {t("review.kpi.avgRating", { defaultValue: "Avg Rating" })}
              </p>
              <RatingGauge rating={avgRating!} />
            </Card>
          )}

          {/* KPI cards */}
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {resolvedKpis.map((card) => {
              const label = t(`shell.metricLabels.${card.labelKey}`, { defaultValue: card.key });
              const isResponseRate = /response_rate/.test(card.key);
              const isFiveStar = /five_star/.test(card.key);
              const isOneStar = /one_star/.test(card.key);

              return (
                <Card key={card.key} className="bg-white border border-slate-200 rounded-xl shadow-sm">
                  <CardContent className="pt-4 pb-3 px-4">
                    <p className="text-xs font-medium text-muted-foreground truncate">{label}</p>

                    {/* rating KPI: show stars inline */}
                    {card.format === "rating" ? (
                      <div className="mt-1 flex flex-col gap-1">
                        <span className="text-xl font-bold text-slate-900">{card.value}</span>
                        <StarRating rating={card.raw} />
                      </div>
                    ) : isResponseRate ? (
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-xl font-bold text-slate-900">{card.value}</span>
                        <CircularProgress pct={card.raw} color={C.c4} />
                      </div>
                    ) : isFiveStar ? (
                      <div className="mt-2 space-y-1">
                        <span className="text-xl font-bold text-slate-900">{card.value}</span>
                        <PercentBar pct={card.raw} color="#22c55e" />
                      </div>
                    ) : isOneStar ? (
                      <div className="mt-2 space-y-1">
                        <span className="text-xl font-bold text-slate-900">{card.value}</span>
                        <PercentBar pct={card.raw} color="#ef4444" />
                      </div>
                    ) : (
                      <p className="mt-1 text-xl font-bold text-slate-900">{card.value}</p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Rating trend + review count (time dimension) */}
      {showTrend && (
        <Card className="bg-white border border-slate-200 rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle>
              {t("review.charts.ratingTrend", { defaultValue: "Rating Trend" })}
            </CardTitle>
            <CardDescription>
              {t("review.charts.ratingTrendDesc", {
                defaultValue: "Average rating and review volume over time",
              })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              id="review-trend"
              className="!aspect-auto h-[320px] w-full"
              config={trendConfig}
            >
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="x" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="left"  domain={[0, 5]}   tick={{ fontSize: 11 }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey={ratingLabel}
                  stroke={C.c1}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey={reviewCountLabel}
                  stroke={C.c2}
                  strokeWidth={2}
                  dot={false}
                  strokeDasharray="4 4"
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      {/* Sentiment / response rate over time */}
      {showSentiment && (
        <Card className="bg-white border border-slate-200 rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle>
              {t("review.charts.sentiment", { defaultValue: "Sentiment & Response Rate" })}
            </CardTitle>
            <CardDescription>
              {t("review.charts.sentimentDesc", {
                defaultValue: "5-star %, 1-star % and response rate over time",
              })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              id="review-sentiment"
              className="!aspect-auto h-[280px] w-full"
              config={sentimentConfig}
            >
              <LineChart data={sentimentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="x" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} unit="%" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Line type="monotone" dataKey={fiveStarLabel} stroke={C.c3} strokeWidth={2} dot={{ r: 2 }} />
                <Line type="monotone" dataKey={oneStarLabel}  stroke={C.c5} strokeWidth={2} dot={{ r: 2 }} />
                <Line type="monotone" dataKey={responseLabel} stroke={C.c4} strokeWidth={2} dot={false} strokeDasharray="4 4" />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      {/* Rating + review count by apartment */}
      {showAptBar && (
        <Card className="bg-white border border-slate-200 rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle>
              {t("review.charts.byApartment", { defaultValue: "Reviews by Apartment" })}
            </CardTitle>
            <CardDescription>
              {t("review.charts.byApartmentDesc", {
                defaultValue: "Average rating and review count per apartment. Click a bar to filter.",
              })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              id="review-apt-bar"
              className="!aspect-auto h-[300px] w-full"
              config={aptConfig}
            >
              <BarChart
                data={aptBarData}
                layout="vertical"
                onClick={(data) => {
                  if (onDrillDown && data?.activePayload?.[0]?.payload?.name) {
                    onDrillDown("apartment_name", String(data.activePayload[0].payload.name));
                  }
                }}
                style={{ cursor: onDrillDown ? "pointer" : undefined }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={140}
                  tick={{ fontSize: 11 }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey={reviewCountLabel} fill={C.c2} radius={[0, 4, 4, 0]} />
                <Bar dataKey={ratingLabel}      fill={C.c1} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
