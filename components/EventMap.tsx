"use client";

import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { EventItem, TOWN_COORDS, CATEGORIES } from "@/data/config";

export default function EventMap({
  events,
  onSelect,
}: {
  events: EventItem[];
  onSelect: (id: string) => void;
}) {
  return (
    <MapContainer
      center={[45.47, 10.62]}
      zoom={12}
      scrollWheelZoom={false}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />
      {events.map((e) => (
        <CircleMarker
          key={e.id}
          center={TOWN_COORDS[e.town]}
          radius={10}
          pathOptions={{ color: "#2c6a72", weight: 1, fillColor: "#3f9d5f", fillOpacity: 0.9 }}
          eventHandlers={{ click: () => onSelect(e.id) }}
        >
          <Popup>
            <strong>{e.title}</strong>
            <br />
            {e.town} · {e.time}
            <br />
            <span style={{ color: "#5c979a" }}>{CATEGORIES[e.cat]}</span>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
