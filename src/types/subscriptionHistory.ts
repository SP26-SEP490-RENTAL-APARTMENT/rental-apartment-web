export interface SubscriptionHistory {
    subscriptionId: string;
    landlordId: string;
    planId: string;
    status: string;
    startDate: string;
    renewalType: string;
    autoRenew: boolean;
    paymentMethod: string;
    lastPaymentId: string;
    createdAt: string;
    updatedAt: string;
}