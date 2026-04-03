export interface Document {
  documentId: string;
  userId: string;
  documentType:
    | "passport"
    | "national_id_card"
    | "drivers_license"
    | "other_government_id"
    | "selfie_with_id";
  side: "front" | "back" | "bio_page" | "other";
  fileUrl: string;
  mimeType: string;
  fileSize: number;
  uploadedAt: boolean;
  verificationStatus: 'pending' | 'verified' | 'rejected' | 'expired';
  verifiedAt: string;
  rejectionReason: string;
  notes: string;
}
