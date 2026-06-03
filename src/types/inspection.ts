export interface Inspection {
    inspectionId: string
    apartmentName: string
    apartmentId: string
    inspectorId: string
    scheduledDateTime: string
    completedDate: string
    status: string
    overallCondition: string
    issuesFound: string
    recommendations: string
    approvedForListing: boolean
    approvedAt: string
    approvedBy: string
    photos: string[]
    createdAt: string
}