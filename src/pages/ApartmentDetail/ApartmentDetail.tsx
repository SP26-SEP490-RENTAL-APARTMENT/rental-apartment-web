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

const detail = {
  guest: [
    {
      name: "string",
      avatarUrl: "string",
      comment:
        "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Vel, dolorum soluta. Ex, veritatis doloremque laboriosam vitae aliquam quaerat nobis illum molestiae perspiciatis excepturi neque ratione sapiente quod sint nulla molestias!",
      time: "string",
      rate: 2,
    },
    {
      name: "string",
      avatarUrl: "string",
      comment:
        "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Vel, dolorum soluta. Ex, veritatis doloremque laboriosam vitae aliquam quaerat nobis illum molestiae perspiciatis excepturi neque ratione sapiente quod sint nulla molestias!",
      time: "string",
      rate: 2,
    },
    {
      name: "string",
      avatarUrl: "string",
      comment:
        "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Vel, dolorum soluta. Ex, veritatis doloremque laboriosam vitae aliquam quaerat nobis illum molestiae perspiciatis excepturi neque ratione sapiente quod sint nulla molestias!",
      time: "string",
      rate: 2,
    },
    {
      name: "string",
      avatarUrl: "string",
      comment:
        "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Vel, dolorum soluta. Ex, veritatis doloremque laboriosam vitae aliquam quaerat nobis illum molestiae perspiciatis excepturi neque ratione sapiente quod sint nulla molestias!",
      time: "string",
      rate: 2,
    },
  ],
};

function ApartmentDetail() {
  const { id } = useParams();

  const [apartment, setApartment] = useState<Apartment>();
  const [room, setRoom] = useState<Room>();
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [availability, setAvailability] = useState<Availability>();
  const [isOpen, setIsOpen] = useState(false);

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

    fetchApartmentDetail();
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

      <div className="border-b pb-10">
        <h1 className="text-center font-bold text-2xl">Comments Section</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-25 mt-6">
          {detail.guest.map((guest, index) => (
            <CommentSection key={index} guest={guest} />
          ))}
        </div>
      </div>
      <div className="h-100 mt-10">
        {apartment && (
          <MapDetail lat={apartment?.latitude} lng={apartment?.longitude} />
        )}
      </div>

      {availability && (
        <AvailabilityDialog
          data={availability}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}

export default ApartmentDetail;
