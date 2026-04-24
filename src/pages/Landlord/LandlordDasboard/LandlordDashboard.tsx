import {
  CalendarIcon,
  DollarSignIcon,
  HomeIcon,
  TrendingUp,
} from "lucide-react";
import DashboardCard from "../../../components/ui/dashboardCard/DashboardCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const data = [
  { title: "Total Properties", value: 10, Icon: HomeIcon },
  { title: "Total Bookings", value: 25, Icon: CalendarIcon },
  { title: "Total Revenue", value: "$5,000", Icon: DollarSignIcon },
];

function LandlordDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 space-y-8">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">
                Manage your properties and bookings
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="border-gray-300">
                View Reports
              </Button>
              <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold">
                <TrendingUp className="h-4 w-4 mr-2" />
                Analytics
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {data.map((item, index) => (
            <DashboardCard
              key={index}
              title={item.title}
              value={item.value}
              Icon={item.Icon}
            />
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="border-0 shadow-sm mb-8">
          <CardHeader className="border-b border-gray-100">
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 flex flex-wrap gap-3">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Add New Property
            </Button>
            <Button variant="outline" className="border-gray-300">
              View All Bookings
            </Button>
            <Button variant="outline" className="border-gray-300">
              Manage Properties
            </Button>
            <Button variant="outline" className="border-gray-300">
              View Financial Report
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity Section */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="border-b border-gray-100">
            <CardTitle>Recent Bookings</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-gray-500 text-center py-8">
              No recent bookings yet. Manage your properties to start accepting
              bookings.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default LandlordDashboard;
