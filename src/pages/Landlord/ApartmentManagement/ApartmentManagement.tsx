import ApartmentCard from "@/components/ui/ApartmentCard";
import AddApartmentDialog from "./components/AddApartmentDialog";

const data = [
  {
    id: 1,
    image:
      "https://thuanducphat.com/Files/39/thie%CC%82%CC%81t%20ke%CC%82%CC%81%20penthouses%20%C4%91e%CC%A3p-3.jpg",
    price: 10,
    name: "Penhouse 1",
    location: "TP.Hồ Chí Minh",
    rate: 4,
    desciption:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos modi expedita iure nostrum maxime aliquam temporibus labore, excepturi quia distinctio consequatur cum recusandae nihil delectus error ipsum enim odit assumenda?",
  },
  {
    id: 2,
    image:
      "https://thuanducphat.com/Files/39/thie%CC%82%CC%81t%20ke%CC%82%CC%81%20penthouses%20%C4%91e%CC%A3p-3.jpg",
    price: 10,
    name: "Penhouse 1",
    location: "123",
    rate: 4,
    desciption: "hello",
  },
  {
    id: 3,
    image:
      "https://thuanducphat.com/Files/39/thie%CC%82%CC%81t%20ke%CC%82%CC%81%20penthouses%20%C4%91e%CC%A3p-3.jpg",
    price: 10,
    name: "Penhouse 1",
    location: "123",
    rate: 4,
    desciption: "hello",
  },
  {
    id: 4,
    image:
      "https://thuanducphat.com/Files/39/thie%CC%82%CC%81t%20ke%CC%82%CC%81%20penthouses%20%C4%91e%CC%A3p-3.jpg",
    price: 10,
    name: "Penhouse 1",
    location: "123",
    rate: 4,
    desciption: "hello",
  },
];

function ApartmentManagement() {
  return (
    <div>
      <div className="flex justify-end mb-10">
        <AddApartmentDialog />
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {data.map((d) => (
          <ApartmentCard
            key={d.id}
            description={d.desciption}
            image={d.image}
            location={d.location}
            name={d.name}
            price={d.price}
            rate={d.rate}
          />
        ))}
      </div>
    </div>
  );
}

export default ApartmentManagement;
