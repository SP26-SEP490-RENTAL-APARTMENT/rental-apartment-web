import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
export interface MapDetailProps {
  lat: number;
  lng: number;
}
function MapDetail({ lat, lng }: MapDetailProps) {
  return (
    <MapContainer  center={[lat, lng]} zoom={15} style={{ height: "100%" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={[lat, lng]}>
        <Popup>Căn hộ của bạn</Popup>
      </Marker>
    </MapContainer>
  );
}

export default MapDetail;
