export interface Occupy {
    bookingId: string
    tenantId: string
    tenantFullName: string
    apartmentId: string
    apartmentAddress: string
    landlordId: string
    landlordFullName: string
    checkInDate: string
    checkOutDate: string
    nights: number
    totalPrice: number
    bookingStatus: string
    hasCheckTimeDispute: boolean
    disputeReason: string | null
    disputeResolutionStatus: string | null
    disputeCreatedAt: string | null
    supportTicketCount: number
    createdAt: string
}