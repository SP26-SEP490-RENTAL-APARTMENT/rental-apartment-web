import { useTranslation } from "react-i18next";
import { Users, Baby, Heart } from "lucide-react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface QuoteData {
  noOfAdults: number;
  noOfChildren: number;
  noOfInfants: number;
  noOfPets: number;
}

interface GuestInfoSectionProps {
  quoteData: QuoteData;
}

interface GuestCardProps {
  icon: React.ReactNode;
  label: string;
  count: number;
  bgColor: string;
  iconColor: string;
}

function GuestCard({
  icon,
  label,
  count,
  bgColor,
  iconColor,
}: GuestCardProps) {
  return (
    <div className={`${bgColor} rounded-lg p-4 flex items-center gap-3`}>
      <div className={`${iconColor} p-2 rounded-lg`}>{icon}</div>
      <div>
        <p className="text-xs font-semibold text-gray-600 uppercase">
          {label}
        </p>
        <p className="text-2xl font-bold text-gray-900">{count}</p>
      </div>
    </div>
  );
}

export default function GuestInfoSection({
  quoteData,
}: GuestInfoSectionProps) {
  const { t } = useTranslation("book");

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="bg-linear-to-r from-blue-50 to-cyan-50 border-b border-blue-200">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Users className="h-5 w-5 text-blue-600" />
          {t("confirm.guestInfo")}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <GuestCard
            icon={<Users className="h-5 w-5 text-blue-600" />}
            label={t("booking.adults")}
            count={quoteData.noOfAdults}
            bgColor="bg-blue-50"
            iconColor="bg-blue-100"
          />
          <GuestCard
            icon={<Users className="h-5 w-5 text-purple-600" />}
            label={t("booking.children")}
            count={quoteData.noOfChildren}
            bgColor="bg-purple-50"
            iconColor="bg-purple-100"
          />
          <GuestCard
            icon={<Baby className="h-5 w-5 text-pink-600" />}
            label={t("booking.infants")}
            count={quoteData.noOfInfants}
            bgColor="bg-pink-50"
            iconColor="bg-pink-100"
          />
          <GuestCard
            icon={<Heart className="h-5 w-5 text-orange-600" />}
            label={t("booking.pets")}
            count={quoteData.noOfPets}
            bgColor="bg-orange-50"
            iconColor="bg-orange-100"
          />
        </div>
      </CardContent>
    </Card>
  );
}
