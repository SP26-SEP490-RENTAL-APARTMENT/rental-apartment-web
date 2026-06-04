import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Button } from "@/components/ui/button";
import {
  Bus,
  Home,
  Landmark,
  LocateFixed,
  MapPin,
  ShoppingBag,
  Trees,
  UtensilsCrossed,
} from "lucide-react";
import L from "leaflet";
import { renderToString } from "react-dom/server";
import type { PrimaryAttraction } from "@/types/apartment";
import { useTranslation } from "react-i18next";

interface MapDetailProps {
  lat: number;
  lng: number;
  attractions?: PrimaryAttraction[];
}

function createIcon(type: string) {
  const iconMap: Record<string, React.ReactNode> = {
    apartment: <Home size={18} color="white" />,

    restaurant: <UtensilsCrossed size={18} color="white" />,

    museum: <Landmark size={18} color="white" />,

    park: <Trees size={18} color="white" />,

    landmark: <Landmark size={18} color="white" />,

    shopping: <ShoppingBag size={18} color="white" />,

    transport: <Bus size={18} color="white" />,
  };

  const bgColor: Record<string, string> = {
    apartment: "#dc2626",

    restaurant: "#ea580c",

    museum: "#7c3aed",

    park: "#16a34a",

    landmark: "#0f766e",

    shopping: "#2563eb",

    transport: "#475569",
  };

  return L.divIcon({
    html: renderToString(
      <div
        style={{
          backgroundColor: bgColor[type] || "#64748b",
          width: 36,
          height: 36,
          borderRadius: "9999px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "2px solid white",
          boxShadow: "0 2px 8px rgba(0,0,0,.25)",
        }}
      >
        {iconMap[type] || <MapPin size={18} color="white" />}
      </div>,
    ),
    className: "",
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });
}

function RecenterButton({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();

  return (
    <Button
      onClick={() => map.setView([lat, lng], 15)}
      size="icon"
      className="absolute top-4 right-4 z-500 shadow-lg"
    >
      <LocateFixed className="h-4 w-4" />
    </Button>
  );
}

function MapDetail({ lat, lng, attractions = [] }: MapDetailProps) {
  const { i18n } = useTranslation();
  return (
    <MapContainer
      center={[lat, lng]}
      zoom={15}
      className="z-0"
      style={{
        height: "100%",
        width: "100%",
      }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {/* Apartment */}
      <Marker position={[lat, lng]} icon={createIcon("apartment")}>
        <Popup>
          <div>
            <div className="font-semibold">Apartment</div>
          </div>
        </Popup>
      </Marker>

      {/* Attractions */}
      {attractions.map((item) => (
        <Marker
          key={item.attractionId}
          position={[item.latitude, item.longitude]}
          icon={createIcon(item.type)}
        >
          <Popup>
            <div className="space-y-1 max-w-62.5">
              <div className="font-semibold">
                {i18n.language === "vi" ? item.nameVi : item.nameEn}
              </div>

              <div className="text-xs text-muted-foreground">
                {item.address}
              </div>

              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <p className="font-bold">{item.distanceKm.toFixed(1)}</p>
                km away from apartment
              </div>
            </div>
          </Popup>
        </Marker>
      ))}

      <RecenterButton lat={lat} lng={lng} />
    </MapContainer>
  );
}

export default MapDetail;
