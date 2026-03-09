"use client";

import { useEffect, useRef, useState } from "react";
import type { Ride } from "@/lib/rides";
import { getCoords } from "@/lib/coordinates";
import Link from "next/link";

interface RidesMapSectionProps {
  rides: Ride[];
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-NZ", { weekday: "short", day: "numeric", month: "short" });
}

function formatPrice(ride: Ride) {
  if (ride.pricing === "free" || ride.price_amount === 0) return { label: "FREE", color: "text-green-600" };
  if (ride.pricing === "split-fuel") return { label: `$${ride.price_amount ?? "~"} / fuel share`, color: "text-teal-700" };
  return { label: `$${ride.price_amount} / seat`, color: "text-orange-500" };
}

export default function RidesMapSection({ rides }: RidesMapSectionProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletRef = useRef<any>(null);
  const markersRef = useRef<Map<string, any>>(new Map());
  const linesRef = useRef<Map<string, any>>(new Map());
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [mapReady, setMapReady] = useState(false);

  // Init Leaflet map
  useEffect(() => {
    if (!mapRef.current || leafletRef.current) return;

    let L: any;
    import("leaflet").then((mod) => {
      L = mod.default;

      // Fix default icon paths
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const map = L.map(mapRef.current!, {
        center: [-41.5, 172.5],
        zoom: 5,
        zoomControl: true,
        scrollWheelZoom: false,
        attributionControl: false,
      });

      L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
        attribution: "© OpenStreetMap © CARTO",
      }).addTo(map);

      L.control.attribution({ position: "bottomright", prefix: "" })
        .addAttribution('© <a href="https://carto.com">CARTO</a>')
        .addTo(map);

      leafletRef.current = { map, L };
      setMapReady(true);
    });

    return () => {
      if (leafletRef.current) {
        leafletRef.current.map.remove();
        leafletRef.current = null;
      }
    };
  }, []);

  // Draw/update markers when rides or hover changes
  useEffect(() => {
    if (!mapReady || !leafletRef.current) return;
    const { map, L } = leafletRef.current;

    // Clear old
    markersRef.current.forEach((m) => m.remove());
    linesRef.current.forEach((l) => l.remove());
    markersRef.current.clear();
    linesRef.current.clear();

    rides.forEach((ride) => {
      const from = getCoords(ride.from_location);
      const to = getCoords(ride.to_location);
      if (!from || !to) return;

      const isHovered = hoveredId === ride.id;
      const price = formatPrice(ride);

      // Line
      const line = L.polyline([from, to], {
        color: isHovered ? "#f97316" : "#0f766e",
        weight: isHovered ? 3 : 1.5,
        opacity: isHovered ? 0.9 : 0.35,
        dashArray: isHovered ? undefined : "6 4",
      }).addTo(map);
      linesRef.current.set(ride.id + "-line", line);

      // From marker (circle)
      const fromIcon = L.divIcon({
        html: `<div style="
          width:${isHovered ? 14 : 10}px;
          height:${isHovered ? 14 : 10}px;
          border-radius:50%;
          background:${isHovered ? "#0f766e" : "#0f766e88"};
          border:2px solid white;
          box-shadow:0 1px 4px rgba(0,0,0,0.3);
          transition:all 0.2s;
        "></div>`,
        className: "",
        iconSize: [isHovered ? 14 : 10, isHovered ? 14 : 10],
        iconAnchor: [isHovered ? 7 : 5, isHovered ? 7 : 5],
      });

      // To marker — animated pop-up pin when hovered
      const toIcon = L.divIcon({
        html: isHovered
          ? `<div style="position:relative;text-align:center;">
              <div style="
                background:#f97316;
                color:white;
                font-size:11px;
                font-weight:700;
                padding:4px 8px;
                border-radius:8px;
                white-space:nowrap;
                box-shadow:0 4px 12px rgba(0,0,0,0.25);
                margin-bottom:4px;
                animation:popUp 0.25s ease-out;
              ">${ride.from_location} → ${ride.to_location}<br/><span style="font-weight:400;font-size:10px;">${price.label}</span></div>
              <div style="
                width:14px;height:14px;
                background:#f97316;
                border-radius:50%;
                border:2px solid white;
                margin:0 auto;
                box-shadow:0 2px 6px rgba(0,0,0,0.3);
              "></div>
            </div>`
          : `<div style="
              width:10px;height:10px;
              border-radius:50%;
              background:#f97316aa;
              border:2px solid white;
              box-shadow:0 1px 3px rgba(0,0,0,0.2);
            "></div>`,
        className: "",
        iconSize: isHovered ? [160, 56] : [10, 10],
        iconAnchor: isHovered ? [80, 56] : [5, 5],
      });

      const fromMarker = L.marker(from, { icon: fromIcon }).addTo(map);
      const toMarker = L.marker(to, { icon: toIcon }).addTo(map);

      markersRef.current.set(ride.id + "-from", fromMarker);
      markersRef.current.set(ride.id + "-to", toMarker);
    });
  }, [rides, hoveredId, mapReady]);

  // Pan map to hovered ride
  useEffect(() => {
    if (!mapReady || !leafletRef.current || !hoveredId) return;
    const { map, L } = leafletRef.current;
    const ride = rides.find((r) => r.id === hoveredId);
    if (!ride) return;
    const from = getCoords(ride.from_location);
    const to = getCoords(ride.to_location);
    if (!from || !to) return;
    const bounds = L.latLngBounds([from, to]).pad(0.3);
    map.fitBounds(bounds, { animate: true, duration: 0.5 });
  }, [hoveredId, rides, mapReady]);

  return (
    <>
      <style>{`
        @keyframes popUp {
          from { transform: translateY(8px) scale(0.9); opacity: 0; }
          to { transform: translateY(0) scale(1); opacity: 1; }
        }
      `}</style>
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      />

      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">
            Upcoming Rides
          </h2>
          <p className="text-center text-gray-500 mb-10">
            Hover a ride to see it on the map
          </p>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Map */}
            <div className="lg:w-[58%] rounded-2xl overflow-hidden shadow-md border border-gray-100 min-h-[420px] bg-gray-50 sticky top-4 self-start">
              <div ref={mapRef} style={{ height: "480px", width: "100%" }} />
              {!mapReady && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-50 text-gray-400 text-sm">
                  Loading map…
                </div>
              )}
            </div>

            {/* Ride cards */}
            <div className="lg:w-[42%] flex flex-col gap-3 max-h-[480px] overflow-y-auto pr-1">
              {rides.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  No upcoming rides yet.{" "}
                  <Link href="/post" className="text-teal-600 font-medium underline">
                    Be the first!
                  </Link>
                </div>
              )}
              {rides.map((ride) => {
                const price = formatPrice(ride);
                const isHovered = hoveredId === ride.id;
                return (
                  <Link
                    key={ride.id}
                    href={`/ride/${ride.id}`}
                    onMouseEnter={() => setHoveredId(ride.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    className={`block rounded-xl p-4 border transition-all duration-200 cursor-pointer ${
                      isHovered
                        ? "border-orange-400 bg-orange-50 shadow-md -translate-y-0.5"
                        : "border-gray-100 bg-white hover:border-teal-200 hover:shadow-sm"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`text-xs font-semibold px-2.5 py-1 rounded-full transition-colors ${
                              isHovered
                                ? "bg-orange-100 text-orange-700"
                                : "bg-teal-50 text-teal-700"
                            }`}
                          >
                            {formatDate(ride.departure_date)}
                          </span>
                          {ride.departure_time && (
                            <span className="text-xs text-gray-400">
                              {ride.departure_time}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 font-semibold text-gray-900">
                          <span className="truncate">{ride.from_location}</span>
                          <span className="text-gray-400 flex-shrink-0">→</span>
                          <span className="truncate">{ride.to_location}</span>
                        </div>
                        <div className="flex items-center gap-3 mt-1.5 text-sm text-gray-500">
                          <span>🧑 {ride.driver_name}</span>
                          <span>· {ride.seats_available} seat{ride.seats_available !== 1 ? "s" : ""}</span>
                        </div>
                      </div>
                      <div className={`text-right flex-shrink-0 font-bold text-base ${price.color}`}>
                        {price.label.split(" ").slice(0, 1).join("")}
                        <div className="text-xs font-normal text-gray-400">
                          {price.label.split(" ").slice(1).join(" ")}
                        </div>
                      </div>
                    </div>

                    {isHovered && ride.notes && (
                      <p className="mt-2 text-xs text-gray-500 italic border-t border-orange-100 pt-2 line-clamp-2">
                        "{ride.notes}"
                      </p>
                    )}
                  </Link>
                );
              })}

              <div className="pt-2 pb-1">
                <Link
                  href="/rides"
                  className="block w-full text-center bg-teal-700 hover:bg-teal-800 text-white py-3 rounded-xl font-semibold transition-colors text-sm"
                >
                  View All Rides →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
