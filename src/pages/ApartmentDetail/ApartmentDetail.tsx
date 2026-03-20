import type { Apartment } from "@/types/apartment";
// import ApartmentInfo from "./components/ApartmentInfo";
// import BookingBox from "./components/BookingBox";
// import CommentSection from "./components/CommentSection";
// import ImageCarousel from "./components/ImageCarousel";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apartmentApi } from "@/services/publicApi/apartmentApi";

function ApartmentDetail() {
  const { id } = useParams();

  const [apartment, setApartment] = useState<Apartment>();

  useEffect(() => {
  if (!id) return;

  const fetchApartmentDetail = async () => {
    try {
      const response = await apartmentApi.getApartmentById(id);
      setApartment(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  fetchApartmentDetail();
}, [id]);
  return (
    <div className="px-20">
      {apartment?.address}
      {/* <h1 className="text-3xl mb-3 font-medium">{detail.name}</h1>
      <ImageCarousel images={detail.images} />
      <div className="flex mt-10 gap-2 border-b pb-10">
        <div className="basis-2/3">
          <ApartmentInfo
            description={detail.description}
            host={detail.host}
            location={detail.location}
            price={detail.price}
          />
        </div>

        <aside className="basis-1/3 relative">
          <div className="sticky top-10">
            <BookingBox />
          </div>
        </aside>
      </div>
      <div>
        <h1 className="text-center font-bold text-2xl">Comments Section</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-25 mt-6">
          {detail.guest.map((guest, index) => (
            <CommentSection key={index} guest={guest} />
          ))}
        </div>
      </div> */}
      hi
    </div>
  );
}

export default ApartmentDetail;
