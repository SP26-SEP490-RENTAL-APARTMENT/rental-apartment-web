import type { Amenity } from "./amenity";

export interface Apartment extends InspectionStatus {
  apartmentId: string;
  landlordId: string;
  title: string;
  description: string;
  maxOccupants: number;
  isPetAllowed: boolean;
  address: string;
  district: string;
  city: string;
  latitude: number;
  longitude: number;
  basePricePerNight: number;
  status: string;
  createdAt: string;
  photos: string[];
  room: Room;
  amenities: Amenity[];
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
  inspectionStatus?: string
}
