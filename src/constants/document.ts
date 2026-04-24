import type { Document } from "@/types/document";

export const getDocumentTypeLabel = (
  t: any,
): Record<Document["documentType"], string> => ({
  passport: t("identityVerification.passport"),
  national_id_card: t("identityVerification.nationalIdCard"),
  drivers_license: t("identityVerification.driverLicense"),
  other_government_id: t("identityVerification.otherGovernmentId"),
  selfie_with_id: t("identityVerification.selfieWithId"),
});

export const getSideLabel = (t: any): Record<Document["side"], string> => ({
  front: t("identityVerification.front"),
  back: t("identityVerification.back"),
  bio_page: t("identityVerification.bioPage"),
  other: t("identityVerification.other"),
});
