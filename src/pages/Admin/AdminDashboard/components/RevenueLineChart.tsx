import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

function RevenueLineChart({ data }: { data: any }) {
  if (!data?.rows?.length) {
    return (
      <Card className="rounded-2xl shadow-md">
        <CardHeader>
          <CardTitle>📈 Revenue Over Time</CardTitle>
        </CardHeader>
        <CardContent>Không có dữ liệu</CardContent>
      </Card>
    );
  }

  // 🔥 transform + sort (giống booking)
  const chartData = data.rows
    .map((item: any) => ({
      rawDate: new Date(item.dimensions.date),
      date: new Date(item.dimensions.date).toLocaleDateString("vi-VN"),
      revenue: item.metrics.revenue,
    }))
    .sort((a: any, b: any) => a.rawDate - b.rawDate);

  const total = data?.totalMetrics?.revenue || 0;

  return (
    <Card className="rounded-2xl shadow-md">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Revenue Over Time</span>
          <span className="text-sm font-normal text-muted-foreground">
            Total: {Number(total).toLocaleString("vi-VN")} đ
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <ChartContainer
          config={{
            revenue: {
              label: "Doanh thu",
              color: "#3b82f6",
            },
          }}
          className="h-75 w-full"
        >
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="date" />

            <YAxis
              tickFormatter={(value) =>
                Number(value).toLocaleString("vi-VN")
              }
            />

            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) =>
                    `${Number(value).toLocaleString("vi-VN")} đ`
                  }
                />
              }
            />

            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export default RevenueLineChart;
