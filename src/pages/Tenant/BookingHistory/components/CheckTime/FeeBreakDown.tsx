import { Card } from '@/components/ui/card'
import { formatCurrency } from '@/utils/utils'
import { useTranslation } from 'react-i18next';

function FeeBreakDown({data}: {data: any}) {
  const { t } = useTranslation("paymentHistory");
  
  return (
    <Card className="p-4">
      <h4 className="font-semibold mb-4">{t("checkTime.fee.title")}</h4>

      <div className="space-y-2">
        <div className="flex justify-between">
          <span>{t("checkTime.fee.earlyCheckIn")}</span>
          <span>{formatCurrency(data.earlyCheckInFee)}</span>
        </div>

        <div className="flex justify-between">
          <span>{t("checkTime.fee.lateCheckOut")}</span>
          <span>{formatCurrency(data.lateCheckOutFee)}</span>
        </div>

        <hr />

        <div className="flex justify-between font-bold">
          <span>{t("checkTime.fee.total")}</span>
          <span>{formatCurrency(data.totalFee)}</span>
        </div>
      </div>
    </Card>
  )
}

export default FeeBreakDown