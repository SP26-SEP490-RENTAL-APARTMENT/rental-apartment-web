export interface PaymentHistory {
  paymentId: string;
  relatedEntityId: string;
  relatedEntityType: string;
  amount: number;
  paymentType: string;
  paymentPurpose: string;
  method: string;
  status: string;
  transactionId: string;
  paidAt: string;
}
