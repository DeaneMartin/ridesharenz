import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "RideShare NZ — Share Rides Across New Zealand",
  description:
    "Find or offer rideshares across New Zealand. Save money, reduce emissions, and meet great people.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
        <header className="bg-teal-800 text-white shadow-lg">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold tracking-tight">
              RideShare <span className="text-orange-400">NZ</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              <Link href="/rides" className="hover:text-orange-300 transition-colors">
                Find a Ride
              </Link>
              <Link href="/post" className="hover:text-orange-300 transition-colors">
                Offer a Ride
              </Link>
              <Link href="/alerts" className="hover:text-orange-300 transition-colors">
                Alerts
              </Link>
              <Link href="/blog" className="hover:text-orange-300 transition-colors">
                Blog
              </Link>
              <Link href="/about" className="hover:text-orange-300 transition-colors">
                About
              </Link>
            </nav>
            <Link
              href="/post"
              className="md:hidden bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
            >
              + Offer Ride
            </Link>
          </div>
          {/* Mobile nav */}
          <div className="md:hidden border-t border-teal-700">
            <div className="max-w-6xl mx-auto px-4 py-2 flex gap-4 text-xs font-medium overflow-x-auto">
              <Link href="/rides" className="hover:text-orange-300 whitespace-nowrap">
                Find a Ride
              </Link>
              <Link href="/alerts" className="hover:text-orange-300 whitespace-nowrap">
                Alerts
              </Link>
              <Link href="/blog" className="hover:text-orange-300 whitespace-nowrap">
                Blog
              </Link>
              <Link href="/about" className="hover:text-orange-300 whitespace-nowrap">
                About
              </Link>
            </div>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="bg-teal-900 text-teal-200 py-12">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-white font-bold text-lg mb-3">
                  RideShare <span className="text-orange-400">NZ</span>
                </h3>
                <p className="text-sm text-teal-300">
                  Connecting Kiwis through shared journeys. Save money, reduce emissions, and
                  make new friends on the road.
                </p>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-3">Quick Links</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link href="/rides" className="hover:text-white transition-colors">
                      Find a Ride
                    </Link>
                  </li>
                  <li>
                    <Link href="/post" className="hover:text-white transition-colors">
                      Offer a Ride
                    </Link>
                  </li>
                  <li>
                    <Link href="/alerts" className="hover:text-white transition-colors">
                      Set Up Alerts
                    </Link>
                  </li>
                  <li>
                    <Link href="/blog" className="hover:text-white transition-colors">
                      Blog
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-3">About</h4>
                <p className="text-sm text-teal-300">
                  Built for New Zealand. Free to use. No sign-up required.
                </p>
                <p className="text-sm text-teal-400 mt-4">
                  &copy; {new Date().getFullYear()} RideShare NZ
                </p>
              </div>
            </div>
          </div>
        </footer>

        {/* QT floating badge */}
        <div className="fixed bottom-4 right-4 z-50">
          <div className="bg-teal-700 text-white text-xs px-3 py-2 rounded-full shadow-lg opacity-80 hover:opacity-100 transition-opacity">
            QT
          </div>
        </div>
      </body>
    </html>
  );
}
