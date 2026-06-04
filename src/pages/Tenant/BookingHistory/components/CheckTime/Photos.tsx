import { Card, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import MediaPreview from "./MediaPreview";

function Photos({ data }: { data: any }) {
  const { t } = useTranslation("paymentHistory");

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <Card className="p-2">
        <CardTitle className="text-center">
          {t("checkTime.checkInPhoto")}
        </CardTitle>
        <MediaPreview url={data.checkInPhotoUrl} />
      </Card>

      <Card className="p-2">
        <CardTitle className="text-center">
          {t("checkTime.checkOutPhoto")}
        </CardTitle>
        <MediaPreview url={data.checkOutPhotoUrl} />
      </Card>
    </div>
  );
}

export default Photos;
