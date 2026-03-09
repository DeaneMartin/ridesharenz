import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="py-10">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-teal-800 mb-6">About RideShare NZ</h1>

        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Our Mission</h2>
            <p className="text-gray-700 leading-relaxed">
              RideShare NZ connects Kiwis who are heading the same way. We believe that empty
              seats on New Zealand roads are a missed opportunity — for saving money, reducing
              emissions, and building community.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">How It Works</h2>
            <p className="text-gray-700 leading-relaxed">
              No sign-ups, no fees, no middleman. Drivers post their upcoming trips with spare
              seats, and riders browse and get in touch directly via WhatsApp or phone. Simple
              as that.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Why We Built This</h2>
            <p className="text-gray-700 leading-relaxed">
              New Zealand is a beautiful country, but getting around it without a car can be
              tough and expensive. Public transport between towns is limited, and domestic
              flights aren&apos;t cheap. Ridesharing fills the gap — it&apos;s affordable,
              flexible, and connects real people on real journeys.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Safety</h2>
            <p className="text-gray-700 leading-relaxed">
              We encourage all users to exercise common sense when ridesharing. Share your
              trip details with someone you trust, meet in public places when possible, and
              always trust your instincts. Ridesharing has a long and safe tradition in New
              Zealand, and we want to keep it that way.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">100% Free</h2>
            <p className="text-gray-700 leading-relaxed">
              RideShare NZ is free to use for both drivers and riders. No commission, no
              booking fees, no premium tiers. Just Kiwis helping Kiwis.
            </p>
          </div>

          <div className="border-t border-gray-100 pt-6 text-center">
            <p className="text-gray-600 mb-4">Ready to get started?</p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/rides"
                className="bg-teal-700 hover:bg-teal-800 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Find a Ride
              </Link>
              <Link
                href="/post"
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Offer a Ride
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
