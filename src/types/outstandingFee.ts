export interface OutstandingFee {
  bookingId: string;
  apartmentId: string;
  apartmentAddress: string;
  tenantId: string;
  tenantName: string;
  scheduledCheckIn: string;
  scheduledCheckOut: string;
  earlyCheckInFee: number;
  lateCheckOutFee: number;
  totalFee: number;
  feeSettlementStatus: string;
  feeDueAt: string;
  feeSettledAt: string | null;
  isOverdue: boolean;
  tenantDisputeReason: string | null;
  disputeResolutionStatus: string | null;
}

export interface WalletPenalty {
  paymentId: string;
  bookingId: string;
  apartmentId: string;
  apartmentAddress: string;
  tenantId: string;
  tenantName: string;
  amount: number;
  paymentType: string;
  paymentPurpose: string;
  method: string;
  status: string;
  transactionId: string;
  paidAt: string;
}