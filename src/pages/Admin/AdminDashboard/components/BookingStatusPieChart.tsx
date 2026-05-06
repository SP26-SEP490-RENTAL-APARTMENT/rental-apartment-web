import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ChartPie } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const COLORS: Record<string, string> = {
  paid: "#10b981",
  cancelled: "#ef4444",
  pending: "#f59e0b",
  confirmed: "#3b82f6",
};

const STATUS_LABELS: Record<string, string> = {
  paid: "Paid",
  cancelled: "Cancelled",
  pending: "Pending",
  confirmed: "Confirmed",
};

function BookingStatusPieChart({ data }: { data: any }) {
  if (!data?.rows?.length) {
    return (
      <Card className="rounded-2xl shadow-md">
        <CardHeader>
          <CardTitle>Booking Status</CardTitle>
        </CardHeader>
        <CardContent className="text-center text-muted-foreground py-8">
          No data
        </CardContent>
      </Card>
    );
  }

  // 🔥 transform data
  const chartData = data.rows.map((item: any) => ({
    name: item.dimensions.status,
    value: item.metrics.bookings,
    revenue: item.metrics.revenue,
  }));

  const total = data?.totalMetrics?.bookings || 0;
  const totalRevenue = data?.totalMetrics?.revenue || 0;

  // Tính toán phần trăm
  const dataWithPercent = chartData.map((item: any) => ({
    ...item,
    percent: total > 0 ? ((item.value / total) * 100).toFixed(1) : 0,
  }));

  return (
    <Card className="rounded-2xl shadow-sm border-0">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl mb-2 flex items-center gap-2">
              <ChartPie /> Booking Status Distribution
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Total:{" "}
              <span className="font-semibold text-foreground">
                {total.toLocaleString()}
              </span>{" "}
              bookings
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground mb-1">Revenue</p>
            <p className="text-sm font-semibold text-green-600">
              {Number(totalRevenue).toLocaleString("vi-VN")} đ
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart */}
          <div className="lg:col-span-1 flex justify-center">
            <ChartContainer
              config={{
                bookings: {
                  label: "Bookings",
                },
              }}
              className="h-70 w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(value, props: any) => {
                          const item = props.payload;
                          const percent = item.percent || 0;
                          return [
                            <div key="tooltip" className="space-y-1">
                              <p className="font-semibold">
                                {STATUS_LABELS[item.name] || item.name}
                              </p>
                              <p className="text-sm">
                                {value} bookings ({percent}%)
                              </p>
                              <p className="text-sm text-green-600">
                                {Number(item.revenue).toLocaleString("vi-VN")} đ
                              </p>
                            </div>,
                          ];
                        }}
                      />
                    }
                  />

                  <Pie
                    data={dataWithPercent}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={95}
                    paddingAngle={2}
                    isAnimationActive={true}
                    animationBegin={0}
                    animationDuration={800}
                  >
                    {dataWithPercent.map((entry: any, index: number) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[entry.name] || "#8884d8"}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>

          {/* Legend & Stats */}
          <div className="lg:col-span-2 space-y-2">
            {dataWithPercent.map((item: any) => (
              <div
                key={item.name}
                className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div
                    className="w-4 h-4 rounded-full shrink-0 shadow-sm"
                    style={{
                      backgroundColor: COLORS[item.name] || "#8884d8",
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm capitalize">
                      {STATUS_LABELS[item.name] || item.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.value} bookings • {item.percent}%
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-semibold text-sm text-green-600">
                    {Number(item.revenue).toLocaleString("vi-VN")} đ
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default BookingStatusPieChart;
