import type { Apartment } from "@/types/apartment";
import ApartmentInfo from "./components/ApartmentInfo";
import BookingBox from "./components/BookingBox";
import CommentSection from "./components/CommentSection";
import ImageCarousel from "./components/ImageCarousel";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apartmentApi } from "@/services/publicApi/apartmentApi";
import MapDetail from "./components/MapDetail";

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

  useEffect(() => {
    if (!id) return;

    const fetchApartmentDetail = async () => {
      try {
        const response = await apartmentApi.getApartmentById(id);
        const data = response.data.data;
        setApartment(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchApartmentDetail();
  }, [id]);
  return (
    <div className="px-20">
      <h1 className="text-3xl mb-3 font-medium">{apartment?.room?.title}</h1>
      <ImageCarousel photos={apartment?.photos || []} />
      <div className="lg:flex mt-10 gap-2 border-b pb-10 grid grid-cols-1">
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
            <BookingBox />
          </div>
        </aside>
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
    </div>
  );
}

export default ApartmentDetail;
