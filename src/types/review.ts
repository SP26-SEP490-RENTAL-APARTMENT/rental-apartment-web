export interface Review {
  reviewId: string;
  bookingId: string;
  teanantId: string;
  tenantName: string;
  landlordId: string;
  landlordName: string;
  apartmentId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface AverageRating {
  apartmentId: string;
  averageRating: number;
  totalReviews: number;
}
