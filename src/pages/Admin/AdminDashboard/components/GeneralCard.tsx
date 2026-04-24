import { Card, CardContent } from "@/components/ui/card";

interface Props {
  title: string;
  data: number;
  Icon: React.ElementType;
}

function GeneralCard({ title, data, Icon }: Props) {
  return (
    <Card className="border-0 shadow-sm hover:shadow-lg transition-shadow duration-300 bg-white overflow-hidden group">
      {/* Gradient background accent */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-linear-to-br from-blue-100 to-transparent opacity-0 group-hover:opacity-50 transition-opacity duration-300" />

      <CardContent className="p-6 relative">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-gray-600 text-sm font-medium mb-2">{title}</p>
            <p className="text-3xl font-bold text-gray-900">
              {data.toLocaleString("vi-VN")}
            </p>
          </div>
          <div className="ml-4 p-3 bg-linear-to-br from-blue-50 to-blue-100 rounded-lg group-hover:scale-110 transition-transform duration-300">
            <Icon className="h-6 w-6 text-blue-600" />
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-4">Updated just now</p>
      </CardContent>
    </Card>
  );
}

export default GeneralCard;
