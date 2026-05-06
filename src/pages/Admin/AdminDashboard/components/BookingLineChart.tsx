import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ChartLine } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

type Props = {
  data: any; // response.data.data
};

export default function BookingLineChart({ data }: Props) {
  // 🔥 transform data
  const chartData =
    data?.rows
      ?.map((item: any) => ({
        date: new Date(item.dimensions.date).toLocaleDateString("vi-VN"),
        bookings: item.metrics.bookings,
        revenue: item.metrics.revenue,
        rawDate: new Date(item.dimensions.date),
      }))
      // sort theo ngày
      .sort((a: any, b: any) => a.rawDate - b.rawDate) || [];

  const total = data?.totalMetrics?.bookings || 0;

  // Tính toán thống kê
  const maxBookings = Math.max(
    ...chartData.map((item: any) => item.bookings),
    0,
  );
  const avgBookings =
    chartData.length > 0 ? (total / chartData.length).toFixed(0) : 0;

  if (!chartData.length) {
    return (
      <Card className="rounded-2xl shadow-lg border-0">
        <CardHeader>
          <CardTitle>📈 Booking Over Time</CardTitle>
        </CardHeader>
        <CardContent className="text-center text-muted-foreground py-8">
          No data
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl shadow-sm border-0">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl mb-2 flex items-center gap-2">
              <ChartLine /> Booking Over Time
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Total:{" "}
              <span className="font-semibold text-foreground">
                {total.toLocaleString()}
              </span>{" "}
              bookings
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* Chart */}
          <ChartContainer
            config={{
              bookings: {
                label: "Bookings",
                color: "#3b82f6",
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
                  allowDecimals={false}
                  stroke="#6b7280"
                  style={{ fontSize: "12px" }}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value, props: any) => {
                        const item = props.payload;
                        return [
                          <div key="tooltip" className="space-y-1">
                            <p className="font-semibold">{item.date}</p>
                            <p className="text-sm">{value} bookings</p>
                            <p className="text-sm text-green-600">
                              {Number(item.revenue).toLocaleString("vi-VN")} đ
                            </p>
                          </div>,
                        ];
                      }}
                    />
                  }
                />
                <Line
                  type="monotone"
                  dataKey="bookings"
                  stroke="#3b82f6"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: "#3b82f6" }}
                  activeDot={{ r: 6, fill: "#1e40af" }}
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
                Total Bookings
              </p>
              <p className="text-lg font-semibold text-blue-600">
                {total.toLocaleString()}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-slate-50">
              <p className="text-xs text-muted-foreground mb-1">Average/Day</p>
              <p className="text-lg font-semibold text-amber-600">
                {avgBookings}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-slate-50">
              <p className="text-xs text-muted-foreground mb-1">Peak</p>
              <p className="text-lg font-semibold text-green-600">
                {maxBookings.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
