import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface DashboardCardProps {
  title: string;
  value: number | string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}
function DashboardCard({ title, value, Icon }: DashboardCardProps) {
  return (
    <Card className="hover:shadow-lg transition duration-300">
      <CardHeader>
        <div className="flex justify-between">
            <span className="font-bold text-gray-500">{title}</span>
            <Icon />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold ">{value}</p>
      </CardContent>
    </Card>
  );
}

export default DashboardCard;
