import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDocumentTypeLabel, getSideLabel } from "@/constants/document";
import type { Document } from "@/types/document";
import { FileText } from "lucide-react";
import { useTranslation } from "react-i18next";

function IdentityCard({ document }: { document: Document }) {
  const { t } = useTranslation("user");
  const isImage = document.mimeType.startsWith("image");
  const getStatusBadge = () => {
    const status = document.verificationStatus;
    switch (status) {
      case "verified":
        return (
          <Badge className="bg-green-500 text-white">
            {t("identityVerification.verified")}
          </Badge>
        );

      case "rejected":
        return (
          <Badge variant="destructive">
            {t("identityVerification.rejected")}
          </Badge>
        );

      case "expired":
        return (
          <Badge className="bg-gray-500 text-white">
            {t("identityVerification.expired")}
          </Badge>
        );

      default:
        return (
          <Badge variant="secondary">{t("identityVerification.pending")}</Badge>
        );
    }
  };

  const formatDate = (date?: string | null) => {
    if (!date) return "-";
    return new Date(date).toLocaleString();
  };

  return (
    <Card className="shadow-md rounded-2xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">
          {getDocumentTypeLabel(t)[document.documentType]}
        </CardTitle>
        <p>
          <span className="font-medium">
            {t("identityVerification.side")}:{" "}
          </span>{" "}
          {getSideLabel(t)[document.side]}
        </p>
        {getStatusBadge()}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Preview */}
        <div className="w-full h-52 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden">
          {isImage ? (
            <img
              src={document.fileUrl}
              alt="document"
              className="w-full h-full object-cover"
            />
          ) : (
            <FileText size={40} className="text-gray-400" />
          )}
        </div>

        {/* Info */}
        <div className="text-sm space-y-1">
          <p>
            <span className="font-bold">
              {t("identityVerification.uploadedAt")}:
            </span>{" "}
            {formatDate(document.uploadedAt)}
          </p>
          <p>
            <span className="font-bold">
              {t("identityVerification.verifyAt")}:
            </span>{" "}
            {formatDate(document.verifiedAt)}
          </p>
        </div>

        {/* Notes */}
        {document.notes && (
          <div className="text-sm">
            <span className="font-bold">
              {t("identityVerification.notes")}:{" "}
            </span>{" "}
            {document.notes}
          </div>
        )}

        {/* Rejection reason */}
        {document.verificationStatus === "rejected" &&
          document.rejectionReason && (
            <div className="text-sm text-red-500">
              <span className="font-bold">
                {t("identityVerification.reason")}:{" "}
              </span>{" "}
              {document.rejectionReason}
            </div>
          )}
      </CardContent>
    </Card>
  );
}

export default IdentityCard;
