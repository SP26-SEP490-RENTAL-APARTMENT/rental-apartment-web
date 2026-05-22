import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LandlordWallet } from "@/types/landlordWallet";
import { Clock, Landmark, Wallet } from "lucide-react";
import CountUp from "react-countup";
import { useTranslation } from "react-i18next";

interface Props {
  wallet: LandlordWallet | null;
  onWithdraw?: () => void;
}

function WalletCard({ wallet, onWithdraw }: Props) {
  const { t } = useTranslation("landlord");
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <Card className="overflow-hidden border-0 shadow-xl bg-linear-to-br from-indigo-600 via-blue-600 to-cyan-500 text-white">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-white/80">{t("payout.title")}</p>

            <CardTitle className="text-3xl font-bold mt-1">
              {wallet ? (
                <CountUp
                  end={wallet.totalBalance}
                  duration={1.5}
                  separator=","
                  formattingFn={formatCurrency}
                />
              ) : (
                "N/A"
              )}
            </CardTitle>

            <p className="text-xs text-white/70 mt-1">{t("payout.totalBalance")}</p>
          </div>

          <div className="p-4 rounded-2xl bg-white/20 backdrop-blur-md">
            <Wallet className="w-8 h-8" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-xl bg-white/15 p-4 backdrop-blur-md">
            <div className="flex items-center gap-2 mb-2">
              <Landmark className="w-4 h-4 text-green-300" />
              <p className="text-sm text-white/80">{t("payout.availableBalance")}</p>
            </div>

            <p className="text-lg font-semibold text-green-200">
              {wallet ? (
                <CountUp
                  end={wallet.availableBalance}
                  duration={1.5}
                  separator=","
                  formattingFn={formatCurrency}
                />
              ) : (
                "N/A"
              )}
            </p>
          </div>

          <div className="rounded-xl bg-white/15 p-4 backdrop-blur-md">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-yellow-300" />
              <p className="text-sm text-white/80">{t("payout.pendingBalance")}</p>
            </div>

            <p className="text-lg font-semibold text-yellow-200">
              {wallet ? (
                <CountUp
                  end={wallet.pendingBalance}
                  duration={1.5}
                  separator=","
                  formattingFn={formatCurrency}
                />
              ) : (
                "N/A"
              )}
            </p>
          </div>
        </div>

        <div className="border-t border-white/20 pt-3 flex items-center justify-between">
          <div className="text-sm text-white/70">
            <p>{t("payout.updatedAt")}</p>
            <p>
              {wallet
                ? new Date(wallet.updatedAt).toLocaleString("vi-VN")
                : "N/A"}
            </p>
          </div>

          <Button
            onClick={onWithdraw}
            className="bg-white text-indigo-700 hover:bg-white/90 font-semibold rounded-xl px-6"
          >
            {t("payout.withdraw")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default WalletCard;
