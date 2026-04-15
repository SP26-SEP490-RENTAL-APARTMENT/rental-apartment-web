export interface BookingHistory {
    bookingId: string,
    tenantId: string,
    apartmentId: string,
    checkInDate: string,
    checkOutDate: string,
    nights: number
    noOfAdults: number
    noOfInfants: number
    noOfPets: number
    totalPrice: number
    packageId: string
    packagePrice: number
    depositAmount: number
    depositPaid: boolean
    balanceDueDate: string
    status: 'pending' | 'negotiating' | 'confirmed' | 'paid' | 'completed' | 'cancelled' | 'disputed'
    createdAt: string
    paymentMode: 'partial' | 'full',
    upfrontPaymentAmount: number
    tenantFullName: string
    actualCheckIn: string | null
    actualCheckOut: string | null
}