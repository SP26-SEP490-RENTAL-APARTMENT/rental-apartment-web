import type { Apartment, Room } from "@/types/apartment";
import ApartmentInfo from "./components/ApartmentInfo";
import BookingBox from "./components/BookingBox";
import CommentSection from "./components/CommentSection";
import ImageCarousel from "./components/ImageCarousel";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apartmentApi } from "@/services/publicApi/apartmentApi";
import MapDetail from "./components/MapDetail";
import RoomInfo from "./components/RoomInfo";
import type { Amenity } from "@/types/amenity";
import AmenitiesInfo from "./components/AmenitiesInfo";
import type { Availability } from "@/types/availability";
import AvailabilityDialog from "./components/AvailabilityDialog";
import { MapPin } from "lucide-react";
import { reviewApi } from "@/services/privateApi/tenantApi";
import type { AverageRating, Review } from "@/types/review";
import ReviewSummary from "./components/ReviewSummary";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import AllReviewsDialog from "./components/AllReviewsDialog";

function ApartmentDetail() {
  const { id } = useParams();
  const { t: reviewT } = useTranslation("review");

  const [apartment, setApartment] = useState<Apartment>();
  const [room, setRoom] = useState<Room>();
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [availability, setAvailability] = useState<Availability>();
  const [isOpen, setIsOpen] = useState(false);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState<AverageRating | null>(
    null,
  );
  useEffect(() => {
    if (!id) return;

    const fetchApartmentDetail = async () => {
      try {
        const response = await apartmentApi.getApartmentById(id);
        const data = response.data.data;
        setApartment(data);
        setRoom(data.room);
        setAmenities(data.amenities);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await reviewApi.getAllReviews(id);
        setReviews(response.data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    const fetchAverageRating = async () => {
      try {
        const response = await reviewApi.getAverageRating(id);
        setAverageRating(response.data);
      } catch (error) {
        console.error("Error fetching average rating:", error);
      }
    };

    fetchApartmentDetail();
    fetchReviews();
    fetchAverageRating();
  }, [id]);

  const handleCheckAvailability = async () => {
    if (!id) return;

    try {
      const response = await apartmentApi.checkAvailability(id, {
        startDate: null,
        endDate: null,
      });
      setIsOpen(true);
      setAvailability(response.data.data);
    } catch (error) {
      console.error("Error checking availability:", error);
    }
  };
  return (
    <div className="px-20">
      <h1 className="text-3xl mb-3 font-medium">{apartment?.room?.title}</h1>
      <ImageCarousel photos={apartment?.photos || []} />

      <div className="lg:flex mt-10 gap-10 pb-10 grid grid-cols-1">
        <div className="lg:basis-2/3">
          {apartment && (
            <ApartmentInfo
              description={apartment.description}
              host={{
                name: "ll",
                avatarUrl: "https://i.pravatar.cc/150?img=1",
              }}
              address={apartment.address}
              district={apartment.district}
              price={apartment.basePricePerNight}
              isPetAllowed={apartment.isPetAllowed}
              maxOccupants={apartment.maxOccupants}
            />
          )}
        </div>

        <aside className="lg:basis-1/3 relative">
          <div className="sticky top-10">
            {apartment && (
              <BookingBox
                apartmentId={apartment.apartmentId}
                onSubmit={handleCheckAvailability}
                apartment={apartment}
              />
            )}
          </div>
        </aside>
      </div>

      <div className="pb-10">{room && <RoomInfo room={room} />}</div>

      <div className="pb-10">
        {amenities && <AmenitiesInfo amenities={amenities} />}
      </div>

      <div className="border-t-2 border-b-2 py-10">
        {averageRating && (
          <ReviewSummary averageData={averageRating} reviews={reviews} />
        )}
      </div>

      <div className="border-b py-10">
        <h1 className="font-bold text-2xl py-10">{reviewT("otherReviews")}</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-25 mt-6">
          {reviews.slice(0, 4).map((review) => (
            <CommentSection key={review.reviewId} reviews={review} />
          ))}
        </div>
        <div className="mt-15 flex justify-center">
          <Button
            onClick={() => setReviewDialogOpen(true)}
            className="font-medium p-5"
            variant="default"
          >
            View all the reviews
          </Button>
        </div>
      </div>

      <div className="mt-16">
        <div className="bg-white rounded-2xl shadow-lg p-5 border">
          {/* Header */}
          <div className="mb-4">
            <div className="flex items-center gap-2">
              <MapPin size={16} />
              <h2 className="text-xl font-semibold text-gray-900">Location</h2>
            </div>

            <p className="text-sm text-gray-500">
              {apartment?.address}, {apartment?.district}
            </p>
          </div>

          {/* Map */}
          <div className="w-full h-100 rounded-xl overflow-hidden">
            {apartment && (
              <MapDetail lat={apartment.latitude} lng={apartment.longitude} />
            )}
          </div>

          {/* Optional footer */}
          <div className="mt-3 text-xs text-gray-400">
            Exact location provided after booking
          </div>
        </div>
      </div>

      {availability && (
        <AvailabilityDialog
          data={availability}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />
      )}

      {reviewDialogOpen && averageRating && (
        <AllReviewsDialog
          open={reviewDialogOpen}
          onClose={() => setReviewDialogOpen(false)}
          reviews={reviews}
          averageRating={averageRating}
        />
      )}
    </div>
  );
}

export default ApartmentDetail;
