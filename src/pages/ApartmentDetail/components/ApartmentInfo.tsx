interface ApartmentInfoProps {
  description: string;
  host: {
    name: string;
    avatarUrl: string;
  };
  location: string;
  price: number;
}
function ApartmentInfo({
  description,
  host,
  location,
  price,
}: ApartmentInfoProps) {
  return (
    <div className="space-y-8 px-6 py-8">
      <div className="flex items-center gap-4 pb-6 border-b">
        <img
          className="w-20 h-20 rounded-full object-cover ring-2 ring-gray-200"
          src={host.avatarUrl}
          alt={host.name}
        />
        <div>
          <p className="text-sm text-gray-500">Hosted by</p>
          <p className="text-xl font-semibold text-gray-900">{host.name}</p>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-900">
          About this place
        </h3>
        <p className="text-gray-600 leading-relaxed">{description}</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-500">Location</p>
          <p className="text-gray-900 font-semibold">{location}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-500">Price per night</p>
          <p className="text-2xl font-bold text-blue-600">${price}</p>
        </div>
      </div>
    </div>
  );
}

export default ApartmentInfo;
