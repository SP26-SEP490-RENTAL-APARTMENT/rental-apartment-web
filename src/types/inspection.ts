export interface Inspection {
    inspectionId: string
    apartmentName: string
    apartmentId: string
    inspectorId: string
    scheduledDate: string
    completedDate: string
    status: string
    overallCondition: string
    issuesFound: string
    recommendations: string
    approvedForListing: boolean
    approvedAt: string
    approvedBy: string
    photos: string[]
}