import type { Apartment } from "./apartment"

export interface Wishlist {
    wishlistId: string
    apartmentId: string
    collectionId: string
    collectionName: string
    isFavorite: boolean
    notes: string
    addedAt: string
    apartmentDetails: Apartment
}