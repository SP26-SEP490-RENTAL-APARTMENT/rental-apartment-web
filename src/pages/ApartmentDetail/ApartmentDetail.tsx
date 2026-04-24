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
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import AllReviewsDialog from "./components/AllReviewsDialog";

function ApartmentDetail() {
  const { id } = useParams();
  const { t: bookT } = useTranslation("book");
  const { t } = useTranslation("common");

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
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Image Carousel */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ImageCarousel photos={apartment?.photos || []} />
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title Section */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                {apartment?.room?.title}
              </h1>
              <div className="flex items-center gap-2 text-gray-600 mb-4">
                <MapPin size={18} />
                <span className="text-lg">
                  {apartment?.address}, {apartment?.district}
                </span>
              </div>
              {averageRating && (
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-lg ${
                          i < Math.round(averageRating.averageRating)
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-gray-700 font-semibold">
                    {averageRating?.averageRating}
                  </span>
                  <span className="text-gray-500">
                    ({averageRating?.totalReviews} {bookT("review.review")})
                  </span>
                </div>
              )}
            </div>

            {/* Apartment Info */}
            {apartment && (
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <ApartmentInfo
                  description={apartment.description}
                  address={apartment.address}
                  district={apartment.district}
                  price={apartment.basePricePerNight}
                  isPetAllowed={apartment.isPetAllowed}
                  maxOccupants={apartment.maxOccupants}
                  landlordName={apartment.landlordName}
                />
              </div>
            )}

            {/* Room Details */}
            {room && (
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {bookT("room.roomDetail")}
                </h2>
                <RoomInfo room={room} />
              </div>
            )}

            {/* Amenities */}
            {amenities && (
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {bookT("amenity.amenities")}
                </h2>
                <AmenitiesInfo amenities={amenities} />
              </div>
            )}

            {/* Reviews Section */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {bookT("review.otherReviews")}
                </h2>
                {reviews.length > 0 ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {reviews.slice(0, 4).map((review) => (
                        <CommentSection
                          key={review.reviewId}
                          reviews={review}
                        />
                      ))}
                    </div>
                    {reviews.length > 3 && (
                      <div className="pt-6 text-center">
                        <Button
                          onClick={() => setReviewDialogOpen(true)}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          {bookT("review.viewAllReviews")}
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    {t("description.noReviewYet")}
                  </p>
                )}
              </div>
            </div>

            {/* Location Map */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="mb-6 flex flex-col gap-2">
                <h2 className="text-2xl font-bold text-gray-900">
                  {bookT("location.location")}
                </h2>
                <p className="text-sm text-gray-500">
                  {apartment?.address}, {apartment?.district}
                </p>
              </div>

              <div className="w-full h-96 rounded-lg overflow-hidden border border-gray-200">
                {apartment && (
                  <MapDetail
                    lat={apartment.latitude}
                    lng={apartment.longitude}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Booking Box */}
          <aside className="lg:col-span-1">
            <div className="sticky top-20">
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
      </div>

      {/* Dialogs */}
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
