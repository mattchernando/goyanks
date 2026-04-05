import { Suspense } from "react";
import Header from "@/components/Header";
import LatestOutingCard from "@/components/LatestOutingCard";
import QuickStats from "@/components/QuickStats";
import TrendChart from "@/components/TrendChart";
import OutingsTable from "@/components/OutingsTable";
import FilterTabs from "@/components/FilterTabs";
import {
  getLatestOuting,
  getOutings,
  getQuickStats,
  getTrendData,
} from "@/lib/queries";
import type { RoleFilter } from "@/types";

interface PageProps {
  searchParams: { role?: string };
}

export const dynamic = "force-dynamic"; // Always fetch fresh data
export const revalidate = 0;

export default async function HomePage({ searchParams }: PageProps) {
  const roleFilter = (searchParams.role as RoleFilter) || "all";

  // Fetch all data in parallel
  const [latestOuting, outings, quickStats, trendData] = await Promise.all([
    getLatestOuting(),
    getOutings(15, roleFilter),
    getQuickStats(10),
    getTrendData(10),
  ]);

  return (
    <div className="min-h-screen bg-navy">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section - Latest Outing */}
        <section className="mb-8">
          {latestOuting ? (
            <LatestOutingCard outing={latestOuting} />
          ) : (
            <div className="bg-navy-600 rounded-2xl p-8 text-center">
              <p className="text-gray-400">No outings recorded yet</p>
              <p className="text-sm text-gray-500 mt-2">
                Data will appear here once the Pi syncs pitcher exits
              </p>
            </div>
          )}
        </section>

        {/* Quick Stats Strip */}
        <section className="mb-8">
          <QuickStats stats={quickStats} />
        </section>

        {/* Trend Chart */}
        <section className="mb-8">
          <TrendChart data={trendData} />
        </section>

        {/* Filter + Table */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white gold-underline inline-block">
              All Outings
            </h2>
            <Suspense fallback={<div className="h-10" />}>
              <FilterTabs currentFilter={roleFilter} />
            </Suspense>
          </div>
          <OutingsTable outings={outings} />
        </section>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-white/10 text-center">
          <p className="text-gray-500 text-sm">
            Pinstripe Lab • Yankees Pitching Analytics
          </p>
          <p className="text-gray-600 text-xs mt-1">
            Powered by AI • Data synced from Raspberry Pi
          </p>
        </footer>
      </main>
    </div>
  );
}
