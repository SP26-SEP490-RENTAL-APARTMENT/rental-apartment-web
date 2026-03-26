export interface Package {
    packageId: string
    apartmentId: string
    name: string
    description: string
    price: number
    currency: string
    isActive: boolean
    maxBookings: number
    createdAt: string
    items: PackageItem[]
}

export interface PackageItem {
    packageItemId: string
    itemName: string
    itemDescription: string
    quantity: number
    estimatedValue: number
    sortOrder: number
}