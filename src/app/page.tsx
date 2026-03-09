"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { NZ_LOCATIONS } from "@/lib/locations";
import { getRides, Ride } from "@/lib/rides";

function HeroSection() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");

  return (
    <section className="bg-gradient-to-br from-teal-700 via-teal-800 to-teal-900 text-white py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Share the Journey</h1>
        <p className="text-2xl md:text-3xl font-semibold text-orange-400 mb-8">
          Split the Cost
        </p>
        <p className="text-lg text-teal-100 mb-10 max-w-2xl mx-auto">
          Connect with fellow Kiwis heading your way. Save money, cut emissions, and enjoy the
          ride together across Aotearoa.
        </p>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 max-w-3xl mx-auto">
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm text-teal-200 mb-1 text-left">From</label>
              <select
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="w-full px-3 py-3 rounded-lg bg-white text-gray-900 text-sm"
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
              <label className="block text-sm text-teal-200 mb-1 text-left">To</label>
              <select
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="w-full px-3 py-3 rounded-lg bg-white text-gray-900 text-sm"
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
              <label className="block text-sm text-teal-200 mb-1 text-left">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-3 rounded-lg bg-white text-gray-900 text-sm"
              />
            </div>
            <div className="flex items-end">
              <Link
                href={`/rides?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&date=${encodeURIComponent(date)}`}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors text-center block"
              >
                Search Rides
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      num: 1,
      title: "Search or Post",
      desc: "Find a ride heading your way, or offer your spare seats to others.",
    },
    {
      num: 2,
      title: "Connect",
      desc: "Get in touch directly via WhatsApp or phone. No middleman, no fees.",
    },
    {
      num: 3,
      title: "Ride Together",
      desc: "Share the journey, split the costs, and reduce your carbon footprint.",
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-teal-800 mb-12">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div key={step.num} className="text-center">
              <div className="w-16 h-16 bg-teal-100 text-teal-800 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                {step.num}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function UpcomingRides() {
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRides()
      .then((data) => setRides(data.slice(0, 4)))
      .finally(() => setLoading(false));
  }, []);

  function formatPrice(ride: Ride) {
    if (ride.pricing === "free") return "Free";
    if (ride.pricing === "split-fuel") return "Split fuel";
    if (ride.pricing === "custom" && ride.price_amount) return `$${ride.price_amount}`;
    return "TBD";
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-teal-800 mb-4">Upcoming Rides</h2>
        <p className="text-center text-gray-600 mb-10">Jump on a ride that suits you</p>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
            <p className="mt-3 text-gray-500">Loading rides...</p>
          </div>
        ) : rides.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            No rides available right now. Be the first to{" "}
            <Link href="/post" className="text-teal-600 underline">
              offer one
            </Link>
            !
          </p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {rides.map((ride) => (
              <Link
                key={ride.id}
                href={`/ride/${ride.id}`}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-lg font-semibold text-gray-900">
                      {ride.from_location} → {ride.to_location}
                    </p>
                    <p className="text-sm text-gray-500">{ride.departure_date} at {ride.departure_time}</p>
                  </div>
                  <span className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm font-medium">
                    {formatPrice(ride)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <span>Driver: {ride.driver_name}</span>
                  <span>{ride.seats_available} seat{ride.seats_available !== 1 ? "s" : ""} available</span>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="text-center mt-8">
          <Link
            href="/rides"
            className="inline-block bg-teal-700 hover:bg-teal-800 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            View All Rides
          </Link>
        </div>
      </div>
    </section>
  );
}

function CommunityStats() {
  return (
    <section className="bg-teal-800 text-white py-16">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-10">Community Impact</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { num: "500+", label: "Rides Shared" },
            { num: "1,200+", label: "Happy Riders" },
            { num: "30+", label: "NZ Towns" },
            { num: "15t", label: "CO₂ Saved" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-3xl md:text-4xl font-bold text-orange-400">{stat.num}</p>
              <p className="text-teal-200 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SpareSeats() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-teal-800 mb-4">Got Spare Seats?</h2>
        <p className="text-gray-600 mb-8 text-lg">
          Help a fellow Kiwi out. Share your journey, cover your fuel costs, and make the roads
          a little less empty.
        </p>
        <Link
          href="/post"
          className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-10 py-4 rounded-lg text-lg font-semibold transition-colors"
        >
          Offer a Ride
        </Link>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <HowItWorks />
      <UpcomingRides />
      <CommunityStats />
      <SpareSeats />
    </>
  );
}
