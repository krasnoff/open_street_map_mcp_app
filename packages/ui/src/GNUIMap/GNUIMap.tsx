import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export function GNUIMap() {
  return (
    <MapContainer
      center={[51.5074, -0.1278]}
      zoom={12}
      style={{ height: "600px", width: "100%" }}
    >
      <TileLayer
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        referrerPolicy="origin"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
      />
    </MapContainer>
  );
}