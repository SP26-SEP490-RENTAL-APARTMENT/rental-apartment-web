import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
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
        rawDate: new Date(item.dimensions.date),
      }))
      // sort theo ngày
      .sort((a: any, b: any) => a.rawDate - b.rawDate) || [];

  const total = data?.totalMetrics?.bookings || 0;

  return (
    <Card className="shadow-md rounded-2xl">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Booking Over Time</span>
          <span className="text-sm font-normal text-muted-foreground">
            Total: {total}
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="w-full h-75">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="date" />

              <YAxis allowDecimals={false} />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="bookings"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}