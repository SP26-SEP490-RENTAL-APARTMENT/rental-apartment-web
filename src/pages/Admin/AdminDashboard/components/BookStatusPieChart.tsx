import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Cell, Pie, PieChart } from 'recharts';

function BookStatusPieChart({data}: any) {
  if (!data?.rows?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Booking status</CardTitle>
        </CardHeader>
        <CardContent>No data available</CardContent>
      </Card>
    );
  }

  // 🔥 Transform data
  const chartData = data.rows.map((item: any) => ({
    status: item.dimensions.status,
    count: item.metrics.count,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Booking status</CardTitle>
      </CardHeader>

      <CardContent>
        <ChartContainer
          config={{
            cancelled: {
              label: "Cancelled",
              color: "hsl(var(--chart-1))",
            },
            confirmed: {
              label: "Confirmed",
              color: "hsl(var(--chart-2))",
            },
            paid: {
              label: "Paid",
              color: "hsl(var(--chart-3))",
            },
            pending: {
              label: "Pending",
              color: "hsl(var(--chart-4))",
            },
          }}
          className="h-80 w-full flex items-center justify-center"
        >
          <PieChart>
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) =>
                    `${value} booking`
                  }
                />
              }
            />

            <Pie
              data={chartData}
              dataKey="count"
              nameKey="status"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={3}
            >
              {chartData.map((entry: any) => (
                <Cell
                  key={entry.status}
                  fill={`var(--color-${entry.status})`}
                />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export default BookStatusPieChart