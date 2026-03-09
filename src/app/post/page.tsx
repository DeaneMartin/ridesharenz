"use client";

import { useState } from "react";
import { NZ_LOCATIONS } from "@/lib/locations";
import { createRide } from "@/lib/rides";

export default function PostRidePage() {
  const [form, setForm] = useState({
    driver_name: "",
    from_location: "",
    to_location: "",
    departure_date: "",
    departure_time: "",
    seats_available: 2,
    pricing: "split-fuel",
    price_amount: "",
    contact: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [manageToken, setManageToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function generateToken() {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const token = generateToken();

    try {
      await createRide({
        driver_name: form.driver_name,
        from_location: form.from_location,
        to_location: form.to_location,
        departure_date: form.departure_date,
        departure_time: form.departure_time,
        seats_available: form.seats_available,
        pricing: form.pricing,
        price_amount: form.pricing === "custom" ? Number(form.price_amount) : null,
        contact: form.contact,
        notes: form.notes,
        manage_token: token,
      });
      setManageToken(token);
    } catch {
      setError("Could not post ride. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  }

  if (manageToken) {
    const manageUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/manage/${manageToken}`;
    return (
      <div className="py-16">
        <div className="max-w-xl mx-auto px-4 text-center">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
              ✓
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Ride Posted!</h1>
            <p className="text-gray-600 mb-6">
              Your ride from <strong>{form.from_location}</strong> to{" "}
              <strong>{form.to_location}</strong> is now live.
            </p>

            <div className="bg-teal-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-teal-800 font-medium mb-2">
                Save this link to manage your ride:
              </p>
              <input
                readOnly
                value={manageUrl}
                className="w-full px-3 py-2 border border-teal-200 rounded-lg text-sm text-center bg-white"
                onClick={(e) => (e.target as HTMLInputElement).select()}
              />
            </div>

            <div className="flex gap-3 justify-center">
              <a
                href="/rides"
                className="bg-teal-700 hover:bg-teal-800 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
              >
                View All Rides
              </a>
              <a
                href="/post"
                className="border border-teal-700 text-teal-700 px-6 py-2 rounded-lg font-semibold hover:bg-teal-50 transition-colors"
              >
                Post Another
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-10">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-teal-800 mb-2">Offer a Ride</h1>
        <p className="text-gray-600 mb-8">
          Got spare seats? Share your journey and help a fellow Kiwi out.
        </p>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
            <input
              required
              type="text"
              value={form.driver_name}
              onChange={(e) => setForm({ ...form, driver_name: e.target.value })}
              placeholder="e.g. Sarah"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>

          {/* From / To */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
              <select
                required
                value={form.from_location}
                onChange={(e) => setForm({ ...form, from_location: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="">Select town</option>
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
                required
                value={form.to_location}
                onChange={(e) => setForm({ ...form, to_location: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="">Select town</option>
                {NZ_LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date / Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Departure Date</label>
              <input
                required
                type="date"
                value={form.departure_date}
                onChange={(e) => setForm({ ...form, departure_date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Departure Time</label>
              <input
                required
                type="time"
                value={form.departure_time}
                onChange={(e) => setForm({ ...form, departure_time: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
          </div>

          {/* Seats */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Seats Available</label>
            <select
              value={form.seats_available}
              onChange={(e) => setForm({ ...form, seats_available: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <option key={n} value={n}>
                  {n} seat{n !== 1 ? "s" : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Pricing */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pricing</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: "free", label: "Free" },
                { value: "split-fuel", label: "Split Fuel" },
                { value: "custom", label: "Custom Price" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setForm({ ...form, pricing: opt.value })}
                  className={`py-2 px-4 rounded-lg text-sm font-medium border transition-colors ${
                    form.pricing === opt.value
                      ? "bg-teal-700 text-white border-teal-700"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            {form.pricing === "custom" && (
              <input
                type="number"
                min="0"
                step="1"
                placeholder="Price per seat ($)"
                value={form.price_amount}
                onChange={(e) => setForm({ ...form, price_amount: e.target.value })}
                className="mt-3 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            )}
          </div>

          {/* Contact */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact (Phone / WhatsApp)
            </label>
            <input
              required
              type="tel"
              value={form.contact}
              onChange={(e) => setForm({ ...form, contact: e.target.value })}
              placeholder="e.g. +64 21 123 4567"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes (optional)
            </label>
            <textarea
              rows={3}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Pickup location details, luggage space, music preferences..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">{error}</div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white py-3 rounded-xl font-semibold text-lg transition-colors"
          >
            {submitting ? "Posting..." : "Post Your Ride"}
          </button>
        </form>
      </div>
    </div>
  );
}
