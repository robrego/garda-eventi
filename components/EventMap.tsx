"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet";
import type { LatLngBoundsLiteral } from "leaflet";
import "leaflet/dist/leaflet.css";
import { EventItem, TOWN_COORDS, CATEGORIES, CATEGORIES_EN, translateTime } from "@/data/config";
import { useLang } from "@/components/LanguageProvider";

const ALL_TOWN_COORDS = Object.values(TOWN_COORDS) as LatLngBoundsLiteral;

function eventBounds(events: EventItem[]): LatLngBoundsLiteral {
  const towns = Array.from(new Set(events.map((e) => e.town)));
  const coords = towns.map((t) => TOWN_COORDS[t]).filter(Boolean) as LatLngBoundsLiteral;
  return coords.length > 0 ? coords : ALL_TOWN_COORDS;
}

function MapControls({ events }: { events: EventItem[] }) {
  const map = useMap();
  const { t } = useLang();

  useEffect(() => {
    map.fitBounds(eventBounds(events), { padding: [24, 24] });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [events]);

  return (
    <button
      type="button"
      className="map-refit"
      aria-label={t("ariaCenterMap")}
      onClick={() => map.fitBounds(eventBounds(events), { padding: [24, 24] })}
    >
      ⌖ {t("centerMapButton")}
    </button>
  );
}

export default function EventMap({
  events,
  selectedId,
  onSelect,
}: {
  events: EventItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const { lang } = useLang();
  return (
    <MapContainer
      center={[45.6, 10.65]}
      zoom={10}
      scrollWheelZoom={false}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />
      <MapControls events={events} />
      {events.map((e) => {
        const selected = e.id === selectedId;
        return (
          <CircleMarker
            key={e.id}
            center={TOWN_COORDS[e.town]}
            radius={selected ? 14 : 10}
            pathOptions={{
              color: selected ? "#1e4d54" : "#0b7f8f",
              weight: selected ? 3 : 1,
              fillColor: "#0b7f8f",
              fillOpacity: 0.9,
            }}
            eventHandlers={{ click: () => onSelect(e.id) }}
          >
            <Popup>
              <strong>{lang === "en" ? e.titleEn ?? e.title : e.title}</strong>
              <br />
              {e.town} · {translateTime(e.time, lang)}
              <br />
              <span style={{ color: "#5c979a" }}>{lang === "en" ? CATEGORIES_EN[e.cat] : CATEGORIES[e.cat]}</span>
            </Popup>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}
