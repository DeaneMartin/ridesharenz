"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getRideByManageToken, cancelRide, Ride } from "@/lib/rides";

export default function ManageRide() {
  const params = useParams();
  const [ride, setRide] = useState<Ride | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.token) {
      getRideByManageToken(params.token as string)
        .then(setRide)
        .finally(() => setLoading(false));
    }
  }, [params.token]);

  async function handleCancel() {
    if (!confirm("Are you sure you want to cancel this ride?")) return;

    setCancelling(true);
    setError(null);

    try {
      await cancelRide(params.token as string);
      setCancelled(true);
    } catch {
      setError("Could not cancel ride. Please try again.");
    } finally {
      setCancelling(false);
    }
  }

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="inline-block w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
        <p className="mt-3 text-gray-500">Loading ride...</p>
      </div>
    );
  }

  if (!ride) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Ride Not Found</h1>
        <p className="text-gray-500 mb-6">This manage link may be invalid or the ride has been removed.</p>
        <Link href="/" className="text-teal-600 underline">
          Go home
        </Link>
      </div>
    );
  }

  if (cancelled) {
    return (
      <div className="py-16">
        <div className="max-w-xl mx-auto px-4 text-center">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Ride Cancelled</h1>
            <p className="text-gray-600 mb-6">
              Your ride from <strong>{ride.from_location}</strong> to{" "}
              <strong>{ride.to_location}</strong> has been cancelled.
            </p>
            <Link
              href="/"
              className="inline-block bg-teal-700 hover:bg-teal-800 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              Go Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-10">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-teal-800 mb-2">Manage Your Ride</h1>
        <p className="text-gray-600 mb-8">Review or cancel your posted ride.</p>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
          <div className="bg-gradient-to-r from-teal-700 to-teal-800 text-white p-4 rounded-xl">
            <h2 className="text-xl font-bold">
              {ride.from_location} → {ride.to_location}
            </h2>
            <p className="text-teal-200">
              {ride.departure_date} at {ride.departure_time}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Driver:</span>{" "}
              <span className="font-medium">{ride.driver_name}</span>
            </div>
            <div>
              <span className="text-gray-500">Seats:</span>{" "}
              <span className="font-medium">{ride.seats_available}</span>
            </div>
            <div>
              <span className="text-gray-500">Pricing:</span>{" "}
              <span className="font-medium">{ride.pricing}</span>
            </div>
            <div>
              <span className="text-gray-500">Contact:</span>{" "}
              <span className="font-medium">{ride.contact}</span>
            </div>
          </div>

          {ride.notes && (
            <div className="text-sm">
              <span className="text-gray-500">Notes:</span>{" "}
              <span className="text-gray-700">{ride.notes}</span>
            </div>
          )}

          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">{error}</div>
          )}

          <div className="border-t border-gray-100 pt-4">
            <button
              onClick={handleCancel}
              disabled={cancelling}
              className="w-full bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white py-3 rounded-xl font-semibold transition-colors"
            >
              {cancelling ? "Cancelling..." : "Cancel This Ride"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
