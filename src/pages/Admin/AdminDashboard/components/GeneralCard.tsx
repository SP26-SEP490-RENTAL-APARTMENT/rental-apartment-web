import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  title: string;
  data: number;
  Icon: React.ElementType;
}
function GeneralCard({ title, data, Icon }: Props) {
  return (
    <Card className="hover:shadow-xl transition duration-300">
      <CardHeader>
        <CardTitle className="flex justify-between">
          <p>{title}</p>
          <p>
            <Icon />
          </p>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">{data.toLocaleString('vi-VN')}</p>
      </CardContent>
    </Card>
  );
}

export default GeneralCard;
