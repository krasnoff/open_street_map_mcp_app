import { MapContainer, TileLayer } from "react-leaflet";
// Leaflet's stylesheet is provided by the package at runtime but has no TypeScript declarations.
// @ts-expect-error -- side-effect CSS import
import "leaflet/dist/leaflet.css";
import { LatLngBoundsExpression } from "leaflet";

type MapProps = {
  north: number;
  south: number;
  east: number;
  west: number;
};

export function GNUIMap({ north, south, east, west }: MapProps) {
  // Leaflet coordinates are [latitude, longitude].
  const bounds: LatLngBoundsExpression = [
    [south, west], // southwest corner
    [north, east], // northeast corner
  ];

  return (
    <MapContainer
      bounds={bounds}
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