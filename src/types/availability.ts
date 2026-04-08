export interface Availability {
    apartmentId: string
    bookingStatus: string
    calendarStartDate: string
    calendarEndDate: string
    generatedAt: string
    availablePeriods: AvailablePeriod[]
    unavailablePeriods: UnavailablePeriod[]
}

export interface AvailablePeriod {
    startDate: string
    endDate: string
    pricePerNight: number
}

export interface UnavailablePeriod {
    startDate: string
    endDate: string
    reason: string
    bookingId: string
    bookingStatus: string
}