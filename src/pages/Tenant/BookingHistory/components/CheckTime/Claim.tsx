import { Card } from '@/components/ui/card'
import { formatDateTime } from '@/utils/utils'
import { useTranslation } from 'react-i18next';

function Claim({data}: {data: any}) {
  const { t } = useTranslation("paymentHistory");
  return (
    <Card className="p-4">
      <h4 className="font-semibold mb-4">{t("checkTime.claim.title")}</h4>

      <div className="space-y-2">
        <p>{t("checkTime.claim.status")}: {data.claimStatus}</p>
        <p>{t("checkTime.claim.open")}: {formatDateTime(data.claimOpenedAt)}</p>
        <p>{t("checkTime.claim.expire")}: {formatDateTime(data.claimExpiresAt)}</p>
        <p>{t("checkTime.claim.tenantResponse")}: {data.tenantResponseStatus || "--"}</p>
        <p>{t("checkTime.claim.response")}: {formatDateTime(data.tenantRespondedAt)}</p>
      </div>
    </Card>
  )
}

export default Claim