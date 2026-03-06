import {
  CalendarIcon,
  DollarSignIcon,
  HandCoins,
  UserIcon,
} from "lucide-react";
import DashboardCard from "../../../components/ui/dashboardCard/DashboardCard";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, Pie, PieChart, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const data = [
  { title: "Total Users", value: 789, Icon: UserIcon },
  { title: "Total Bookings", value: 250, Icon: CalendarIcon },
  { title: "Total Revenue", value: "$5,000", Icon: DollarSignIcon },
];

const barChartData = [
  { month: "January", revenue: 186 },
  { month: "February", revenue: 305 },
  { month: "March", revenue: 237 },
  { month: "April", revenue: 73 },
  { month: "May", revenue: 209 },
  { month: "June", revenue: 214 },
];

const pieChartData = [
  { role: "landlord", users: 275, fill: "var(--chart-1)" },
  { role: "tenant", users: 500, fill: "var(--chart-2)" },
];

const barChartConfig = {
  revenue: {
    label: "Revenue",
    color: "#2563eb",
    icon: HandCoins,
  },
} satisfies ChartConfig;

const pieChartConfig = {
  users: {
    label: "Users",
  },
  landlord: {
    label: "Landlord",
    color: "var(--chart-1)",
  },
  tenant: {
    label: "Tenant",
    color: "var(--chart-2)",
  },
  other: {
    label: "Other",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig;
function AdminDashboard() {
  return (
    <div className="space-y-5">
      <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-5">
        {data.map((item, index) => (
          <DashboardCard
            key={index}
            title={item.title}
            value={item.value}
            Icon={item.Icon}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Chart</CardTitle>
            <CardDescription>January - June 2024</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={barChartConfig} className="min-h-50 w-full">
              <BarChart accessibilityLayer data={barChartData}>
                <CartesianGrid vertical={true} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Landlord - Tenant Distribution</CardTitle>
            <CardDescription>Total Users</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={pieChartConfig}
              className="mx-auto aspect-square max-h-62.5 pb-0 [&_.recharts-pie-label-text]:fill-foreground"
            >
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Pie data={pieChartData} dataKey="users" label nameKey="role" />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default AdminDashboard;
