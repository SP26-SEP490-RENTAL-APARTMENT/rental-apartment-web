import type { Amenity } from "./amenity";

export interface Apartment {
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
  roomType: string;
  bedType: string;
  sizeSqm: number;
  isPrivateBathroom: string;
  createdAt: string;
}
