"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getRideById, Ride } from "@/lib/rides";

export default function RideDetail() {
  const params = useParams();
  const [ride, setRide] = useState<Ride | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      getRideById(params.id as string)
        .then(setRide)
        .finally(() => setLoading(false));
    }
  }, [params.id]);

  function formatPrice(r: Ride) {
    if (r.pricing === "free") return "Free ride!";
    if (r.pricing === "split-fuel") return "Split fuel costs";
    if (r.pricing === "custom" && r.price_amount) return `$${r.price_amount} per seat`;
    return "TBD";
  }

  function whatsappUrl(r: Ride) {
    const phone = r.contact.replace(/[^0-9]/g, "");
    const msg = encodeURIComponent(
      `Hey ${r.driver_name}, I'm interested in your ride from ${r.from_location} to ${r.to_location} on ${r.departure_date}. Is there still a seat available?`
    );
    return `https://wa.me/${phone}?text=${msg}`;
  }

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="inline-block w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
        <p className="mt-3 text-gray-500">Loading ride details...</p>
      </div>
    );
  }

  if (!ride) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Ride Not Found</h1>
        <p className="text-gray-500 mb-6">This ride may have been cancelled or doesn&apos;t exist.</p>
        <Link href="/rides" className="text-teal-600 underline">
          Browse available rides
        </Link>
      </div>
    );
  }

  return (
    <div className="py-10">
      <div className="max-w-3xl mx-auto px-4">
        <Link href="/rides" className="text-teal-600 hover:text-teal-700 text-sm mb-6 inline-block">
          ← Back to all rides
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-teal-700 to-teal-800 text-white p-6">
            <h1 className="text-2xl font-bold mb-1">
              {ride.from_location} → {ride.to_location}
            </h1>
            <p className="text-teal-200">
              {ride.departure_date} at {ride.departure_time}
            </p>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Driver</p>
                <p className="font-semibold text-gray-900">{ride.driver_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Seats Available</p>
                <p className="font-semibold text-gray-900">{ride.seats_available}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Pricing</p>
                <p className="font-semibold text-teal-700">{formatPrice(ride)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Status</p>
                <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  Active
                </span>
              </div>
            </div>

            {ride.notes && (
              <div>
                <p className="text-sm text-gray-500 mb-1">Notes</p>
                <p className="text-gray-700 bg-gray-50 rounded-lg p-4">{ride.notes}</p>
              </div>
            )}

            <div className="border-t border-gray-100 pt-6">
              <a
                href={whatsappUrl(ride)}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-green-500 hover:bg-green-600 text-white text-center py-4 rounded-xl font-semibold text-lg transition-colors"
              >
                Contact {ride.driver_name} on WhatsApp
              </a>
              <p className="text-center text-sm text-gray-400 mt-3">
                Opens WhatsApp with a pre-filled message
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
