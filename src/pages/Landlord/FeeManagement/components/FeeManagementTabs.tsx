import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { OutstandingFee, WalletPenalty } from "@/types/outstandingFee";
import { BadgeDollarSign, Wallet } from "lucide-react";
import OutstandingFeeCard from "./OutStandingFee/OutstandingFeeCard";
import WalletPenaltyCard from "./WalletPenalties/WalletPenaltyCard";
import { Badge as BadgeUI } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";

interface Props {
  outstandingFees: OutstandingFee[];
  walletPenalties: WalletPenalty[];
  refetch: () => void;
}

export default function FeeManagementTabs({
  outstandingFees,
  walletPenalties,
  refetch
}: Props) {
  const {t} = useTranslation("landlord");
  return (
    <Tabs defaultValue="outstanding" className="w-full">
      <div className="flex justify-end mb-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="outstanding" className="flex items-center gap-2">
            <BadgeDollarSign className="w-4 h-4" />
            {t("fee.outstandingFees")}
            <BadgeUI
              variant="secondary"
              className="ml-auto h-5 w-5 flex items-center justify-center rounded-full p-0 text-xs"
            >
              {outstandingFees.length}
            </BadgeUI>
          </TabsTrigger>

          <TabsTrigger value="wallet" className="flex items-center gap-2">
            <Wallet className="w-4 h-4" />
            {t("fee.walletPenalties")}
            <BadgeUI
              variant="secondary"
              className="ml-auto h-5 w-5 flex items-center justify-center rounded-full p-0 text-xs"
            >
              {walletPenalties.length}
            </BadgeUI>
          </TabsTrigger>
        </TabsList>
      </div>

      {/* Outstanding Fee */}
      <TabsContent value="outstanding">
        {outstandingFees.length > 0 ? (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {outstandingFees.map((item) => (
              <OutstandingFeeCard key={item.bookingId} fee={item} refetch={refetch} />
            ))}
          </div>
        ) : (
          <EmptyState text="No outstanding fees" />
        )}
      </TabsContent>

      {/* Wallet Penalty */}
      <TabsContent value="wallet">
        {walletPenalties.length > 0 ? (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {walletPenalties.map((item) => (
              <WalletPenaltyCard key={item.paymentId} payment={item} />
            ))}
          </div>
        ) : (
          <EmptyState text="No wallet penalties" />
        )}
      </TabsContent>
    </Tabs>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="h-60 rounded-2xl border border-dashed flex items-center justify-center text-muted-foreground">
      {text}
    </div>
  );
}
