import { Card, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

function Photos({ data }: { data: any }) {
  const { t } = useTranslation("paymentHistory");
  
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <Card className="p-2">
        <CardTitle className="text-center">{t("checkTime.checkInPhoto")}</CardTitle>
        <img
          src={data.checkInPhotoUrl!}
          className="rounded-xl h-72 w-full object-cover"
        />
      </Card>

      <Card className="p-2">
        <CardTitle className="text-center">{t("checkTime.checkOutPhoto")}</CardTitle>
        <img
          src={data.checkOutPhotoUrl!}
          className="rounded-xl h-72 w-full object-cover"
        />
      </Card>
    </div>
  );
}

export default Photos;
