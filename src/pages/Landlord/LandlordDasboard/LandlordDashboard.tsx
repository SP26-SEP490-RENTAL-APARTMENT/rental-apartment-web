import { CalendarIcon, DollarSignIcon, HomeIcon } from "lucide-react";
import DashboardCard from "../../../components/ui/dashboardCard/DashboardCard";

const data = [
  { title: "Total Properties", value: 10, Icon: HomeIcon },
  { title: "Total Bookings", value: 25, Icon: CalendarIcon },
  { title: "Total Revenue", value: "$5,000", Icon: DollarSignIcon },
];
function LandlordDashboard() {
  return (
    <div>
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
    </div>
  );
}

export default LandlordDashboard;
