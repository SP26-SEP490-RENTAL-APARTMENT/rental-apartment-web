import type { Document } from "@/types/document";

export const documentTypeLabel: Record<Document["documentType"], string> = {
  passport: "Passport",
  national_id_card: "National ID Card",
  drivers_license: "Driver's License",
  other_government_id: "Other Government ID",
  selfie_with_id: "Selfie with ID",
};

export const sideLabel: Record<Document["side"], string> = {
  front: "Front",
  back: "Back",
  bio_page: "Bio Page",
  other: "Other",
};