import React from 'react';
import Link from 'next/link';
import { MapPin, Truck, BarChart2, Clock, Users, TrendingUp } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100 text-gray-800">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">
              Motor Telematics — Real-time visibility. Smarter fleets.
            </h1>
            <p className="mt-4 text-lg text-gray-600 max-w-xl">
              Track vehicles, replay routes, monitor performance and reduce downtime with a clean, powerful
              telematics dashboard built for fleet operators and heavy machinery owners.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/map"
                className="inline-flex items-center gap-2 rounded-md bg-orange-500 text-white px-4 py-2 text-sm font-medium hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-300"
              >
                <MapPin className="h-4 w-4" />
                Live Map
              </Link>

              <Link
                href="/dashboards"
                className="inline-flex items-center gap-2 rounded-md border border-gray-200 px-4 py-2 text-sm font-medium bg-white hover:shadow"
              >
                <BarChart2 className="h-4 w-4 text-gray-700" />
                Analytics
              </Link>
            </div>

            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-md">
              <div className="bg-white/70 rounded-lg p-3 shadow">
                <div className="flex items-center gap-3">
                  <Truck className="h-5 w-5 text-primary" />
                  <div>
                    <div className="text-xs text-gray-500">Active Vehicles</div>
                    <div className="font-semibold text-lg">128</div>
                  </div>
                </div>
              </div>

              <div className="bg-white/70 rounded-lg p-3 shadow">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-primary" />
                  <div>
                    <div className="text-xs text-gray-500">Avg. Uptime</div>
                    <div className="font-semibold text-lg">98.7%</div>
                  </div>
                </div>
              </div>

              <div className="bg-white/70 rounded-lg p-3 shadow">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <div>
                    <div className="text-xs text-gray-500">Fuel Savings</div>
                    <div className="font-semibold text-lg">12%</div>
                  </div>
                </div>
              </div>

              <div className="bg-white/70 rounded-lg p-3 shadow">
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-primary" />
                  <div>
                    <div className="text-xs text-gray-500">Clients</div>
                    <div className="font-semibold text-lg">42</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Visual / Map preview */}
          <div className="relative">
            <div className="rounded-xl overflow-hidden shadow-lg ring-1 ring-black/5">
              <div className="bg-gradient-to-br from-sky-50 to-white p-6 sm:p-8">
                <div className="h-64 sm:h-80 bg-gray-100 rounded-md border border-gray-200 flex items-center justify-center">
                  {/* Placeholder map snapshot / embed */}
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-700 mb-3">
                      <MapPin className="h-6 w-6" />
                    </div>
                    <div className="text-sm font-medium">Realtime Fleet</div>
                    <div className="text-xs text-gray-500 mt-2">Live positions, replay routes & telematics metrics</div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                  <div>Last update: 12s ago</div>
                  <div>Coverage: Nationwide</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        <h2 className="text-xl font-semibold mb-6">Why choose Motor Telematics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-5 shadow">
            <div className="flex items-center gap-3">
              <BarChart2 className="h-6 w-6 text-orange-500" />
              <div className="font-semibold">Actionable Analytics</div>
            </div>
            <p className="mt-3 text-sm text-gray-600">Custom dashboards, trip summaries and exportable reports to optimize operations.</p>
          </div>

          <div className="bg-white rounded-lg p-5 shadow">
            <div className="flex items-center gap-3">
              <Truck className="h-6 w-6 text-green-600" />
              <div className="font-semibold">Fleet & Asset Tracking</div>
            </div>
            <p className="mt-3 text-sm text-gray-600">Track trucks, tractors and cars with precision and low-latency updates.</p>
          </div>

          <div className="bg-white rounded-lg p-5 shadow">
            <div className="flex items-center gap-3">
              <Clock className="h-6 w-6 text-sky-600" />
              <div className="font-semibold">Playback & Alerts</div>
            </div>
            <p className="mt-3 text-sm text-gray-600">Replay past routes, configure alerts for geofence, speed or inactivity events.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="rounded-lg bg-gradient-to-r from-orange-50 to-white p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-semibold">Ready to modernize your fleet?</h3>
            <p className="mt-2 text-gray-600 max-w-lg">Start a free trial, demo or integrate with your existing workflow in minutes.</p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/sign-up"
              className="inline-flex items-center gap-2 rounded-md bg-green-600 text-white px-4 py-3 text-sm font-semibold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300"
            >
              Get started
            </Link>

            <Link
              href="/sign-in"
              className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-4 py-3 text-sm font-medium hover:shadow"
            >
              Sign in
            </Link>

            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-4 py-3 text-sm font-medium hover:shadow"
            >
              Request demo
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-600">&copy; {new Date().getFullYear()} Motor Telematics — All rights reserved.</div>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/privacy" className="text-gray-600 hover:underline">
              Privacy
            </Link>
            <Link href="/terms" className="text-gray-600 hover:underline">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}