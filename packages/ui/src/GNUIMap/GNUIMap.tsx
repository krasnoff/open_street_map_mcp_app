import { useEffect } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
// The stylesheet is loaded by the bundler; TypeScript does not have declarations for CSS files.
// @ts-ignore
import "leaflet/dist/leaflet.css";
import { LatLngBoundsExpression } from "leaflet";

type MapProps = {
  north: number;
  south: number;
  east: number;
  west: number;
};

function MapBounds({ bounds }: { bounds: LatLngBoundsExpression }) {
  const map = useMap();

  useEffect(() => {
    map.fitBounds(bounds);
  }, [bounds, map]);

  return null;
}

export function GNUIMap({ north, south, east, west }: MapProps) {
  // Leaflet coordinates are [latitude, longitude].
  const bounds: LatLngBoundsExpression = [
    [south, west], // southwest corner
    [north, east], // northeast corner
  ];

  return (
    <MapContainer
      bounds={bounds}
      style={{ height: "600px", width: "100%" }}
    >
      <MapBounds bounds={bounds} />
      <TileLayer
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        referrerPolicy="origin"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
      />
    </MapContainer>
  );
}
