import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ChartLine } from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";

function RevenueLineChart({ data }: { data: any }) {
  if (!data?.rows?.length) {
    return (
      <Card className="rounded-2xl shadow-lg border-0">
        <CardHeader>
          <CardTitle>📈 Revenue Over Time</CardTitle>
        </CardHeader>
        <CardContent className="text-center text-muted-foreground py-8">
          No data available
        </CardContent>
      </Card>
    );
  }

  const chartData = data.rows
    .map((item: any) => ({
      rawDate: new Date(item.dimensions.date),
      date: new Date(item.dimensions.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      revenue: item.metrics.revenue,
      bookings: item.metrics.bookings,
    }))
    .sort((a: any, b: any) => a.rawDate - b.rawDate);

  const total = data?.totalMetrics?.revenue || 0;

  // Calculate statistics
  const maxRevenue = Math.max(...chartData.map((item: any) => item.revenue), 0);
  const avgRevenue = chartData.length > 0 ? total / chartData.length : 0;

  return (
    <Card className="rounded-2xl shadow-sm border-0">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl mb-2 flex items-center gap-2">
              <ChartLine /> Revenue Over Time
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Total:{" "}
              <span className="font-semibold text-foreground">
                {Number(total).toLocaleString("en-US")}
              </span>{" "}
              VND
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* Chart */}
          <ChartContainer
            config={{
              revenue: {
                label: "Revenue",
                color: "#10b981",
              },
            }}
            className="h-75 w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

                <XAxis
                  dataKey="date"
                  stroke="#6b7280"
                  style={{ fontSize: "12px" }}
                />

                <YAxis
                  stroke="#6b7280"
                  style={{ fontSize: "12px" }}
                  tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
                />

                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(props: any) => {
                        const item = props.payload;
                        return [
                          <div key="tooltip" className="space-y-1">
                            <p className="font-semibold">{item.date}</p>
                            <p className="text-sm text-green-600">
                              {Number(item.revenue).toLocaleString("en-US")} VND
                            </p>
                            <p className="text-sm text-blue-600">
                              {item.bookings} bookings
                            </p>
                          </div>,
                        ];
                      }}
                    />
                  }
                />

                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: "#10b981" }}
                  activeDot={{ r: 6, fill: "#059669" }}
                  isAnimationActive={true}
                  animationDuration={800}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="p-3 rounded-lg bg-slate-50">
              <p className="text-xs text-muted-foreground mb-1">
                Total Revenue
              </p>
              <p className="text-lg font-semibold text-green-600">
                {(total / 1000000).toFixed(1)}M
              </p>
            </div>
            <div className="p-3 rounded-lg bg-slate-50">
              <p className="text-xs text-muted-foreground mb-1">Avg/day</p>
              <p className="text-lg font-semibold text-amber-600">
                {(avgRevenue / 1000000).toFixed(1)}M
              </p>
            </div>
            <div className="p-3 rounded-lg bg-slate-50">
              <p className="text-xs text-muted-foreground mb-1">Peak</p>
              <p className="text-lg font-semibold text-blue-600">
                {(maxRevenue / 1000000).toFixed(1)}M
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default RevenueLineChart;
