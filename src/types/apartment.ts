import type { Amenity } from "./amenity";

export interface Apartment extends InspectionStatus {
  apartmentId: string;
  landlordId: string;
  landlordName: string;
  title: string;
  description: string;
  maxOccupants: number;
  maxInfants: number;
  isPetAllowed: boolean;
  address: string;
  district: string;
  city: string;
  maxPets?: number;
  bookingStatus: string;
  latitude: number;
  longitude: number;
  basePricePerNight: number;
  status: string;
  createdAt: string;
  photos: string[];
  room: Room;
  amenities: Amenity[];
  isFavorite?: boolean;
  collectionId?: string;
  priceChanges: PriceChange[];
  nearbyAttractions?: NearbyAttraction;
  noShowGraceHours: number;
  media: ApartmentMedia[];
  totalReviews: number;
  averageRating: number;
}

export interface ApartmentMedia {
  mediaId: string;
  url: string;
}

export interface AlternativeApartment {
  reasons: string[];
  adjustmentType: "upgrade" | "downgrade" | "same";
  priceDifference: number;
  estimatedTotalPrice: number;
  distanceKm: number;
  apartment: Apartment;
}

export interface NearbyAttraction {
  primaryRadiusKm: string;
  expandedRadiusKm: number;
  hasExpandedAttractions: boolean;
  primaryAttractions: PrimaryAttraction[];
}

export interface PrimaryAttraction {
  attractionId: string;
  nameEn: string;
  nameVi: string;
  type: string;
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  distanceKm: number;
}

export interface PriceChange {
  oldPricePerNight: number;
  newPricePerNight: number;
  reason: string;
  startDate: string;
  endDate: string;
}

export interface Room {
  roomId: string;
  apartmentId: string;
  title: string;
  description: string;
  roomType:
    | "private_single"
    | "private_double"
    | "shared_bed"
    | "studio"
    | "other";
  bedType: "single" | "double" | "queen" | "king" | "bunk" | "shared";
  sizeSqm: number;
  isPrivateBathroom: boolean;
  createdAt: string;
}

export interface InspectionStatus {
  inspectionStatus?: string;
}
