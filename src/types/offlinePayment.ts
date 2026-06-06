export interface OfflinePayment {
  paymentId: string;
  amount: number;
  status: string;
  proofUrl: string;
  notes: string;
  confirmedAt: string | null;
  confirmedBy: string | null;
  paidAt: string;
}
