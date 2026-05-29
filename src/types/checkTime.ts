export interface Dispute {
    bookingId: string;
    tenantId: string;
    tenantFullName: string;
    apartmentId: string;
    apartmentAddress: string;
    landlordId: string;
    landlordFullName: string;
    checkInDate: string;
    checkOutDate: string;
    nights: number;
    totalPrice: number;
    bookingStatus: string;
    hasCheckTimeDispute: boolean;
    disputeReason: string;
    disputeResolutionStatus: string;
    disputeCreatedAt: string;
    supportTicketCount: number;
    ticketId: string;
    images: string[];
    checkTimeImages: string[];
    createdAt: string;
}