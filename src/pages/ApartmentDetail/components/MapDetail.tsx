import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Button } from "@/components/ui/button";
import { LocateFixed } from "lucide-react";

export interface MapDetailProps {
  lat: number;
  lng: number;
}

function RecenterButton({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();

  const handleClick = () => {
    map.setView([lat, lng], 15);
  };

  return (
    <Button
      onClick={handleClick}
      className="absolute top-4 right-4 z-1000 px-3 py-2 rounded-lg shadow text-sm"
    >
      <LocateFixed />
    </Button>
  );
}
function MapDetail({ lat, lng }: MapDetailProps) {
  return (
    <MapContainer
      center={[lat, lng]}
      zoom={15}
      style={{ height: "100%", zIndex: 0 }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={[lat, lng]}>
        <Popup>Căn hộ của bạn</Popup>
      </Marker>

      <RecenterButton lat={lat} lng={lng} />
    </MapContainer>
  );
}

export default MapDetail;
