"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { NZ_LOCATIONS } from "@/lib/locations";
import { getRides, Ride } from "@/lib/rides";

function RideCard({ ride }: { ride: Ride }) {
  function formatPrice(r: Ride) {
    if (r.pricing === "free") return "Free";
    if (r.pricing === "split-fuel") return "Split fuel";
    if (r.pricing === "custom" && r.price_amount) return `$${r.price_amount}`;
    return "TBD";
  }

  return (
    <Link
      href={`/ride/${ride.id}`}
      className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100 block"
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <p className="text-lg font-semibold text-gray-900">
            {ride.from_location} → {ride.to_location}
          </p>
          <p className="text-sm text-gray-500">
            {ride.departure_date} at {ride.departure_time}
          </p>
        </div>
        <span className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm font-medium">
          {formatPrice(ride)}
        </span>
      </div>
      <div className="flex justify-between items-center text-sm text-gray-600">
        <span>Driver: {ride.driver_name}</span>
        <span>
          {ride.seats_available} seat{ride.seats_available !== 1 ? "s" : ""} available
        </span>
      </div>
      {ride.notes && (
        <p className="mt-3 text-sm text-gray-500 border-t border-gray-100 pt-3">{ride.notes}</p>
      )}
    </Link>
  );
}

export default function RidesList() {
  const searchParams = useSearchParams();
  const [from, setFrom] = useState(searchParams.get("from") || "");
  const [to, setTo] = useState(searchParams.get("to") || "");
  const [date, setDate] = useState(searchParams.get("date") || "");
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getRides({
      from: from || undefined,
      to: to || undefined,
      date: date || undefined,
    })
      .then(setRides)
      .finally(() => setLoading(false));
  }, [from, to, date]);

  return (
    <div className="py-10">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-teal-800 mb-2">Find a Ride</h1>
        <p className="text-gray-600 mb-8">Browse available rideshares across New Zealand</p>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
              <select
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="">Any location</option>
                {NZ_LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
              <select
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="">Any location</option>
                {NZ_LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setFrom("");
                  setTo("");
                  setDate("");
                }}
                className="w-full py-2 px-4 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
            <p className="mt-3 text-gray-500">Searching rides...</p>
          </div>
        ) : rides.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg mb-4">No rides found matching your criteria.</p>
            <p className="text-gray-400">
              Try different filters or{" "}
              <Link href="/post" className="text-teal-600 underline">
                offer a ride
              </Link>{" "}
              yourself!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              {rides.length} ride{rides.length !== 1 ? "s" : ""} found
            </p>
            {rides.map((ride) => (
              <RideCard key={ride.id} ride={ride} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
