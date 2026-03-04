import ApartmentInfo from "./components/ApartmentInfo";
import BookingBox from "./components/BookingBox";
import ImageCarousel from "./components/ImageCarousel";

const detail = {
  images: [
    "https://ezcloud.vn/wp-content/uploads/2024/10/nha-nghi-o-hoi-an.webp",
    "https://3.bp.blogspot.com/-yFth85DL5c8/WaVqMuIUJxI/AAAAAAABO_s/aOiO3K0FzhYxgGOB7jNtyXIvzYTaSLYVwCKgBGAs/s1600/nha-nghi-ly-son-binh-tam-motel-1.jpg",
    "https://mia.vn/media/uploads/blog-du-lich/top-10-nha-nghi-vung-tau-02-1700181435.jpg",
    "https://baokhanhhoa.vn/file/e7837c02857c8ca30185a8c39b582c03/022025/456610954_901078405389902_3630523513728959622_n_20250211124307.jpg",
    "https://cdn3.ivivu.com/2020/01/top-7-resort-nha-trang-tua-son-huong-thuy-ivivu-13.jpg",
  ],
  name: "Apartment 1",
  location: "123",
  price: 30,
  description:
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem, ut incidunt. Amet possimus aut maiores optio ratione, voluptate vero quae deleniti vitae maxime, soluta numquam quas odit consequatur velit placeat?",
  rate: 5,
  numberOfReviews: 100,
  host: {
    name: "Long Le",
    avatarUrl: "https://ipwatchdog.com/wp-content/uploads/2018/03/pepe-the-frog-1272162_640.jpg",
  },
};
function ApartmentDetail() {
  return (
    <div className="px-20">
      <h1 className="text-3xl mb-3 font-medium">{detail.name}</h1>
      <ImageCarousel images={detail.images} />
      <div className="flex mt-10 gap-2">
        <div className="basis-2/3">
          <ApartmentInfo description={detail.description} host={detail.host} location={detail.location} price={detail.price} />
        </div>

        <div className="basis-1/3 relative">
          <div className="sticky top-10">
            <BookingBox />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ApartmentDetail;
