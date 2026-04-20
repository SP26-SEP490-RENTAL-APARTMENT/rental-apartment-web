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
      <Card>
        <CardHeader>
          <CardTitle>Doanh thu theo ngày</CardTitle>
        </CardHeader>
        <CardContent>Không có dữ liệu</CardContent>
      </Card>
    );
  }

  // 🔥 Transform + sort
  const chartData = data.rows
    .map((item: any) => ({
      rawDate: item.dimensions.date,
      date: new Date(item.dimensions.date).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
      }),
      revenue: item.metrics.revenue,
    }))
    .sort(
      (a: any, b: any) =>
        new Date(a.rawDate).getTime() - new Date(b.rawDate).getTime(),
    );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue - day</CardTitle>
      </CardHeader>

      <CardContent>
        <ChartContainer
          config={{
            revenue: {
              label: "Doanh thu",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="h-80 w-full"
        >
          <LineChart data={chartData}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />

            <XAxis dataKey="date" tickLine={false} axisLine={false} />

            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => value.toLocaleString("vi-VN")}
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
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export default RevenueLineChart;
